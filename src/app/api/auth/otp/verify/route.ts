import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveRoleForPhone, setSession } from "@/lib/auth";
import {
  IRAN_PHONE_INVALID_MESSAGE,
  normalizeIranPhone,
} from "@/lib/phone";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = normalizeIranPhone(String(body.phone ?? ""));
    const code = String(body.code ?? "").trim();

    if (!phone) {
      return NextResponse.json(
        { success: false, message: IRAN_PHONE_INVALID_MESSAGE },
        { status: 400 },
      );
    }

    if (!code) {
      return NextResponse.json(
        { success: false, message: "کد تایید الزامی است" },
        { status: 400 },
      );
    }

    const session = await prisma.otpSession.findFirst({
      where: { phone },
      orderBy: { createdAt: "desc" },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, message: "کد تایید یافت نشد" },
        { status: 400 },
      );
    }

    if (session.expiresAt < new Date()) {
      await prisma.otpSession.delete({ where: { id: session.id } });
      return NextResponse.json(
        { success: false, message: "کد تایید منقضی شده است" },
        { status: 400 },
      );
    }

    if (session.code !== code) {
      return NextResponse.json(
        { success: false, message: "کد تایید اشتباه است" },
        { status: 401 },
      );
    }

    await prisma.otpSession.deleteMany({ where: { phone } });

    const role = resolveRoleForPhone(phone);

    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({
        data: { name: role === "admin" ? "مدیر" : "کاربر", phone, role },
      });
    } else if (user.role !== role) {
      user = await prisma.user.update({
        where: { phone },
        data: { role },
      });
    }

    await setSession({ name: user.name, role, phone });

    return NextResponse.json({
      success: true,
      user: { name: user.name, role, phone },
    });
  } catch (error) {
    console.error("POST /api/auth/otp/verify failed:", error);
    return NextResponse.json(
      { success: false, message: "خطا در تایید کد" },
      { status: 500 },
    );
  }
}
