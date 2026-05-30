import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { productSchema } from "@/lib/shop-schemas";
import { serializeProduct } from "@/lib/shop";

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");

  const products = await prisma.product.findMany({
    where: categoryId ? { categoryId } : undefined,
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    success: true,
    products: products.map(serializeProduct),
  });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0]?.message ?? "داده نامعتبر" },
      { status: 400 },
    );
  }

  const slug = parsed.data.slug || slugify(parsed.data.name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ success: false, message: "slug تکراری است" }, { status: 409 });
  }

  const product = await prisma.product.create({
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description ?? "",
      shortDescription: parsed.data.shortDescription ?? "",
      price: parsed.data.price,
      compareAtPrice: parsed.data.compareAtPrice ?? null,
      stock: parsed.data.stock ?? 0,
      isActive: parsed.data.isActive ?? true,
      isFeatured: parsed.data.isFeatured ?? false,
      isGiftReady: parsed.data.isGiftReady ?? true,
      giftNote: parsed.data.giftNote ?? "",
      categoryId: parsed.data.categoryId,
    },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  return NextResponse.json({ success: true, product: serializeProduct(product) });
}
