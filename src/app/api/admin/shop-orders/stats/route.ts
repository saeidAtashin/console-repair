import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { serializeShopOrder } from "@/lib/shop";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [todayOrders, pendingOrders, paidOrders, lowStockProducts] =
    await Promise.all([
      prisma.shopOrder.count({
        where: { createdAt: { gte: startOfDay } },
      }),
      prisma.shopOrder.count({
        where: { status: { in: ["paid", "processing"] } },
      }),
      prisma.shopOrder.findMany({
        where: { paymentStatus: "paid" },
        select: { total: true },
      }),
      prisma.product.findMany({
        where: { isActive: true, stock: { lte: 5 } },
        select: { id: true, name: true, stock: true },
        orderBy: { stock: "asc" },
        take: 10,
      }),
    ]);

  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  return NextResponse.json({
    success: true,
    stats: {
      todayOrders,
      pendingOrders,
      totalRevenue,
      lowStockProducts,
    },
  });
}
