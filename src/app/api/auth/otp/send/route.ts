import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOtpCode, getOtpExpiry } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = String(body.phone ?? "").trim();

    if (!/^09\d{9}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: "شماره موبایل معتبر نیست" },
        { status: 400 },
      );
    }

    const code = generateOtpCode();
    const expiresAt = getOtpExpiry();

    await prisma.otpSession.deleteMany({ where: { phone } });
    await prisma.otpSession.create({
      data: { phone, code, expiresAt },
    });

    if (process.env.NODE_ENV === "development") {
      console.log(`[OTP] ${phone} => ${code}`);
    }

    return NextResponse.json({
      success: true,
      message: "کد تایید ارسال شد",
      ...(process.env.NODE_ENV === "development" ? { devCode: code } : {}),
    });
  } catch (error) {
    console.error("POST /api/auth/otp/send failed:", error);
    return NextResponse.json(
      { success: false, message: "خطا در ارسال کد" },
      { status: 500 },
    );
  }
}
