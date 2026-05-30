import { NextResponse } from "next/server";

import {
  addToCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/lib/cart";
import { cartAddSchema, cartUpdateSchema } from "@/lib/shop-schemas";

export async function GET() {
  const cart = await getCart();
  return NextResponse.json({ success: true, cart });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = cartAddSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0]?.message ?? "داده نامعتبر" },
      { status: 400 },
    );
  }

  try {
    const cart = await addToCart(parsed.data.productId, parsed.data.quantity);
    return NextResponse.json({ success: true, cart });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ERROR";
    const status = message === "OUT_OF_STOCK" ? 409 : 404;
    return NextResponse.json(
      {
        success: false,
        message:
          message === "OUT_OF_STOCK"
            ? "موجودی کافی نیست"
            : "محصول یافت نشد",
      },
      { status },
    );
  }
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const parsed = cartUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0]?.message ?? "داده نامعتبر" },
      { status: 400 },
    );
  }

  try {
    const cart = await updateCartItem(parsed.data.cartItemId, parsed.data.quantity);
    return NextResponse.json({ success: true, cart });
  } catch {
    return NextResponse.json({ success: false, message: "آیتم یافت نشد" }, { status: 404 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const cartItemId = searchParams.get("cartItemId");
  if (!cartItemId) {
    return NextResponse.json({ success: false, message: "cartItemId الزامی است" }, { status: 400 });
  }

  try {
    const cart = await removeCartItem(cartItemId);
    return NextResponse.json({ success: true, cart });
  } catch {
    return NextResponse.json({ success: false, message: "آیتم یافت نشد" }, { status: 404 });
  }
}
