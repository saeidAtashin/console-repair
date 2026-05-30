import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { serializeShopOrder } from "@/lib/shop";

export async function GET() {
  const session = await getSession();
  if (!session?.phone) {
    return NextResponse.json({ success: false, message: "لطفاً وارد شوید" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { phone: session.phone } });
  if (!user) {
    return NextResponse.json({ success: true, orders: [] });
  }

  const orders = await prisma.shopOrder.findMany({
    where: {
      OR: [{ userId: user.id }, { guestPhone: session.phone }],
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    success: true,
    orders: orders.map(serializeShopOrder),
  });
}
