import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { addressSchema } from "@/lib/shop-schemas";

async function getUserId(): Promise<string | null> {
  const session = await getSession();
  if (!session?.phone) return null;
  const user = await prisma.user.findUnique({ where: { phone: session.phone } });
  return user?.id ?? null;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ success: false, message: "لطفاً وارد شوید" }, { status: 401 });
  }

  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ success: true, addresses });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ success: false, message: "لطفاً وارد شوید" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = addressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0]?.message ?? "داده نامعتبر" },
      { status: 400 },
    );
  }

  const data = parsed.data;

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: {
      userId,
      fullName: data.fullName,
      phone: data.phone,
      province: data.province,
      city: data.city,
      addressLine: data.addressLine,
      postalCode: data.postalCode ?? "",
      isDefault: data.isDefault ?? false,
    },
  });

  return NextResponse.json({ success: true, address });
}
