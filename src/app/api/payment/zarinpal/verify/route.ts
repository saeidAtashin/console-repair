import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { verifyZarinpalPayment } from "@/lib/zarinpal";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");
  const orderNumber = searchParams.get("order");

  if (!authority || !orderNumber) {
    redirect("/checkout/failed");
  }

  const order = await prisma.shopOrder.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order) {
    redirect("/checkout/failed");
  }

  if (status !== "OK") {
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

    redirect("/checkout/failed");
  }

  try {
    const verified = await verifyZarinpalPayment({
      authority,
      amount: order.total,
    });

    await prisma.shopOrder.update({
      where: { id: order.id },
      data: {
        status: "processing",
        paymentStatus: "paid",
        paymentRef: verified.refId,
        authority,
      },
    });

    redirect(`/checkout/success?order=${encodeURIComponent(orderNumber)}`);
  } catch {
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

    redirect("/checkout/failed");
  }
}

// Keep route handler export for non-redirect cases if needed
export const dynamic = "force-dynamic";
