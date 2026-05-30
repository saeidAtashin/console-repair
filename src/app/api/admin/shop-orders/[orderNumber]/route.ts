import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { shopOrderStatusSchema } from "@/lib/shop-schemas";
import { serializeShopOrder } from "@/lib/shop";

type Params = { params: Promise<{ orderNumber: string }> };

export async function GET(_request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const { orderNumber } = await params;
  const order = await prisma.shopOrder.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ success: false, message: "سفارش یافت نشد" }, { status: 404 });
  }

  return NextResponse.json({ success: true, order: serializeShopOrder(order) });
}

export async function PATCH(request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const { orderNumber } = await params;
  const body = await request.json();
  const parsed = shopOrderStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0]?.message ?? "داده نامعتبر" },
      { status: 400 },
    );
  }

  const order = await prisma.shopOrder.update({
    where: { orderNumber },
    data: {
      status: parsed.data.status,
      ...(parsed.data.adminNote !== undefined
        ? { adminNote: parsed.data.adminNote }
        : {}),
    },
    include: { items: true },
  });

  return NextResponse.json({ success: true, order: serializeShopOrder(order) });
}
