import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOtpCode, getOtpExpiry } from "@/lib/auth";
import {
  IRAN_PHONE_INVALID_MESSAGE,
  normalizeIranPhone,
} from "@/lib/phone";
import {
  getIppanelConfigError,
  sendLoginOtpPattern,
  getIppanelSendUrl,
} from "@/lib/ippanel";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = normalizeIranPhone(String(body.phone ?? ""));

    if (!phone) {
      return NextResponse.json(
        { success: false, message: IRAN_PHONE_INVALID_MESSAGE },
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
    let smsSent = false;

    if (skipSms) {
      console.log(`[OTP skip] ${phone} => ${code}`);
    } else if (ippanelError) {
      await prisma.otpSession.deleteMany({ where: { phone } });
      return NextResponse.json(
        { success: false, message: ippanelError },
        { status: 503 },
      );
    } else {
      try {
        await sendLoginOtpPattern(phone, code);
        smsSent = true;
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
      message: smsSent ? "کد تایید پیامک شد" : "کد تایید (بدون پیامک)",
      smsSent,
      ...(!smsSent ? { devCode: code } : {}),
    });
  } catch (error) {
    console.error("POST /api/auth/otp/send failed:", error);

    const message =
      error instanceof Error &&
      (error.message.includes("better_sqlite3") ||
        error.message.includes("bindings file") ||
        error.message.includes("SQLITE"))
        ? "خطا در اتصال به پایگاه داده"
        : "خطا در ارسال کد";

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
