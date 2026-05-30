import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { clearCart, getCart } from "@/lib/cart";
import { prisma } from "@/lib/db";
import { generateOrderNumber } from "@/lib/slug";
import { checkoutSchema } from "@/lib/shop-schemas";
import { calculateShipping } from "@/lib/shipping";
import { requestZarinpalPayment } from "@/lib/zarinpal";
import { serializeShopOrder } from "@/lib/shop";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0]?.message ?? "داده نامعتبر" },
      { status: 400 },
    );
  }

  const cart = await getCart();
  if (cart.items.length === 0) {
    return NextResponse.json({ success: false, message: "سبد خرید خالی است" }, { status: 400 });
  }

  const session = await getSession();
  let userId: string | null = null;
  if (session?.phone) {
    const user = await prisma.user.findUnique({ where: { phone: session.phone } });
    userId = user?.id ?? null;
  }

  const data = parsed.data;
  const shippingCost = calculateShipping(cart.subtotal);
  const total = cart.subtotal + shippingCost;
  const orderNumber = generateOrderNumber();

  try {
    const order = await prisma.$transaction(async (tx) => {
      for (const line of cart.items) {
        const product = await tx.product.findUnique({ where: { id: line.productId } });
        if (!product || !product.isActive || product.stock < line.quantity) {
          throw new Error(`OUT_OF_STOCK:${line.product.name}`);
        }
      }

      const created = await tx.shopOrder.create({
        data: {
          orderNumber,
          userId,
          guestName: data.guestName,
          guestPhone: data.guestPhone,
          status: data.paymentMethod === "cod" ? "processing" : "pending_payment",
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentMethod === "cod" ? "pending" : "pending",
          subtotal: cart.subtotal,
          shippingCost,
          total,
          shippingName: data.shippingName,
          shippingPhone: data.shippingPhone,
          shippingProvince: data.shippingProvince,
          shippingCity: data.shippingCity,
          shippingAddress: data.shippingAddress,
          shippingPostalCode: data.shippingPostalCode ?? "",
          items: {
            create: cart.items.map((line) => ({
              productId: line.productId,
              productName: line.product.name,
              unitPrice: line.product.price,
              quantity: line.quantity,
            })),
          },
        },
        include: { items: true },
      });

      for (const line of cart.items) {
        await tx.product.update({
          where: { id: line.productId },
          data: { stock: { decrement: line.quantity } },
        });
      }

      return created;
    });

    await clearCart();

    if (data.paymentMethod === "online") {
      try {
        const payment = await requestZarinpalPayment({
          amount: total,
          description: `سفارش ${orderNumber}`,
          orderNumber,
          mobile: data.guestPhone,
        });

        await prisma.shopOrder.update({
          where: { id: order.id },
          data: { authority: payment.authority },
        });

        return NextResponse.json({
          success: true,
          order: serializeShopOrder(order),
          paymentUrl: payment.paymentUrl,
        });
      } catch (error) {
        await prisma.shopOrder.update({
          where: { id: order.id },
          data: { status: "cancelled", paymentStatus: "failed" },
        });

        for (const item of order.items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }

        return NextResponse.json(
          {
            success: false,
            message:
              error instanceof Error
                ? error.message
                : "خطا در اتصال به درگاه پرداخت",
          },
          { status: 502 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      order: serializeShopOrder(order),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "CHECKOUT_FAILED";
    if (message.startsWith("OUT_OF_STOCK:")) {
      return NextResponse.json(
        { success: false, message: `موجودی ${message.split(":")[1]} کافی نیست` },
        { status: 409 },
      );
    }
    return NextResponse.json({ success: false, message: "خطا در ثبت سفارش" }, { status: 500 });
  }
}
