import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { saveProductImage } from "@/lib/uploads";
import { serializeProduct } from "@/lib/shop";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ success: false, message: "محصول یافت نشد" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, message: "فایل تصویر الزامی است" }, { status: 400 });
  }

  try {
    const url = await saveProductImage(file);
    const count = await prisma.productImage.count({ where: { productId: id } });

    await prisma.productImage.create({
      data: {
        productId: id,
        url,
        alt: product.name,
        sortOrder: count,
      },
    });

    const updated = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    });

    return NextResponse.json({ success: true, product: serializeProduct(updated!) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UPLOAD_FAILED";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const imageId = searchParams.get("imageId");

  if (!imageId) {
    return NextResponse.json({ success: false, message: "imageId الزامی است" }, { status: 400 });
  }

  await prisma.productImage.deleteMany({
    where: { id: imageId, productId: id },
  });

  const updated = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  return NextResponse.json({ success: true, product: serializeProduct(updated!) });
}
