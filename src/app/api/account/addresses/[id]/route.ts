import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { addressSchema } from "@/lib/shop-schemas";

type Params = { params: Promise<{ id: string }> };

async function getUserId(): Promise<string | null> {
  const session = await getSession();
  if (!session?.phone) return null;
  const user = await prisma.user.findUnique({ where: { phone: session.phone } });
  return user?.id ?? null;
}

export async function PATCH(request: Request, { params }: Params) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ success: false, message: "لطفاً وارد شوید" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = addressSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0]?.message ?? "داده نامعتبر" },
      { status: 400 },
    );
  }

  const existing = await prisma.address.findFirst({ where: { id, userId } });
  if (!existing) {
    return NextResponse.json({ success: false, message: "آدرس یافت نشد" }, { status: 404 });
  }

  const data = parsed.data;
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.update({
    where: { id },
    data: {
      ...(data.fullName !== undefined ? { fullName: data.fullName } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.province !== undefined ? { province: data.province } : {}),
      ...(data.city !== undefined ? { city: data.city } : {}),
      ...(data.addressLine !== undefined ? { addressLine: data.addressLine } : {}),
      ...(data.postalCode !== undefined ? { postalCode: data.postalCode } : {}),
      ...(data.isDefault !== undefined ? { isDefault: data.isDefault } : {}),
    },
  });

  return NextResponse.json({ success: true, address });
}

export async function DELETE(_request: Request, { params }: Params) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ success: false, message: "لطفاً وارد شوید" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.address.findFirst({ where: { id, userId } });
  if (!existing) {
    return NextResponse.json({ success: false, message: "آدرس یافت نشد" }, { status: 404 });
  }

  await prisma.address.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
