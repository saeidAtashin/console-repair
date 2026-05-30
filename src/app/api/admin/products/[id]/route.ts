import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { productSchema } from "@/lib/shop-schemas";
import { serializeProduct } from "@/lib/shop";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product) {
    return NextResponse.json({ success: false, message: "محصول یافت نشد" }, { status: 404 });
  }

  return NextResponse.json({ success: true, product: serializeProduct(product) });
}

export async function PATCH(request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0]?.message ?? "داده نامعتبر" },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const slug = data.slug ?? (data.name ? slugify(data.name) : undefined);

  if (slug) {
    const conflict = await prisma.product.findFirst({
      where: { slug, NOT: { id } },
    });
    if (conflict) {
      return NextResponse.json({ success: false, message: "slug تکراری است" }, { status: 409 });
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(slug !== undefined ? { slug } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.shortDescription !== undefined ? { shortDescription: data.shortDescription } : {}),
      ...(data.price !== undefined ? { price: data.price } : {}),
      ...(data.compareAtPrice !== undefined ? { compareAtPrice: data.compareAtPrice } : {}),
      ...(data.stock !== undefined ? { stock: data.stock } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      ...(data.isFeatured !== undefined ? { isFeatured: data.isFeatured } : {}),
      ...(data.isGiftReady !== undefined ? { isGiftReady: data.isGiftReady } : {}),
      ...(data.giftNote !== undefined ? { giftNote: data.giftNote } : {}),
      ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
    },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  return NextResponse.json({ success: true, product: serializeProduct(product) });
}

export async function DELETE(_request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
