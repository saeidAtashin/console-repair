import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOtpCode, getOtpExpiry } from "@/lib/auth";
import {
  getIppanelConfigError,
  sendLoginOtpPattern,
  getIppanelSendUrl,
} from "@/lib/ippanel";

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

    const skipSms = process.env.OTP_SKIP_SMS === "true";
    const ippanelError = getIppanelConfigError();

    if (skipSms) {
      console.log(`[OTP skip] ${phone} => ${code}`);
    } else if (ippanelError) {
      if (process.env.NODE_ENV === "development") {
        console.log(`[OTP dev] ${phone} => ${code} (${ippanelError})`);
      } else {
        await prisma.otpSession.deleteMany({ where: { phone } });
        return NextResponse.json(
          { success: false, message: ippanelError },
          { status: 503 },
        );
      }
    } else {
      try {
        await sendLoginOtpPattern(phone, code);
        console.log(`[IPPanel] POST ${getIppanelSendUrl()} → ${phone}`);
      } catch (error) {
        await prisma.otpSession.deleteMany({ where: { phone } });
        console.error("IPPanel OTP send failed:", error);
        return NextResponse.json(
          { success: false, message: "خطا در ارسال پیامک" },
          { status: 502 },
        );
      }
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
