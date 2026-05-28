import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { setSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = String(body.phone ?? "").trim();
    const code = String(body.code ?? "").trim();

    if (!/^09\d{9}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: "شماره موبایل معتبر نیست" },
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

    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({
        data: { name: "کاربر", phone, role: "user" },
      });
    }

    await setSession({ name: user.name, role: "user" });

    return NextResponse.json({
      success: true,
      user: { name: user.name, role: "user" },
    });
  } catch (error) {
    console.error("POST /api/auth/otp/verify failed:", error);
    return NextResponse.json(
      { success: false, message: "خطا در تایید کد" },
      { status: 500 },
    );
  }
}
