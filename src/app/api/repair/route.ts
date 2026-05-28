import { NextResponse } from "next/server";
import { createRepairOrder, serializeOrder } from "@/lib/orders";
import { saveRepairImage } from "@/lib/uploads";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const phone = String(formData.get("phone") ?? "").trim();
    if (!/^09\d{9}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: "شماره تماس معتبر نیست" },
        { status: 400 },
      );
    }

    let imageUrl = "";
    const imageFile = formData.get("image");

    if (imageFile instanceof File && imageFile.size > 0) {
      try {
        imageUrl = await saveRepairImage(imageFile);
      } catch (error) {
        const message =
          error instanceof Error && error.message === "IMAGE_TOO_LARGE"
            ? "حجم تصویر بیش از حد مجاز است"
            : "فرمت تصویر پشتیبانی نمی‌شود";

        return NextResponse.json(
          { success: false, message },
          { status: 400 },
        );
      }
    }

    const order = await createRepairOrder({
      name: String(formData.get("name") ?? "").trim(),
      phone,
      device: String(formData.get("device") ?? "دستگاه نامشخص").trim(),
      issue: String(formData.get("issue") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      imageUrl,
    });

    return NextResponse.json({
      success: true,
      trackingCode: order.trackingCode,
      order: serializeOrder(order),
    });
  } catch (error) {
    console.error("POST /api/repair failed:", error);
    return NextResponse.json(
      { success: false, message: "خطا در ثبت درخواست" },
      { status: 500 },
    );
  }
}
