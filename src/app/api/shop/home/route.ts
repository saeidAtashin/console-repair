import { NextResponse } from "next/server";

import { listActiveCategories, listProducts, serializeCategory, serializeProduct } from "@/lib/shop";

export async function GET() {
  const [categories, products] = await Promise.all([
    listActiveCategories(),
    listProducts({ featured: true }),
  ]);

  return NextResponse.json({
    categories: categories.map(serializeCategory),
    featured: products.slice(0, 8).map((p) =>
      serializeProduct({ ...p, images: p.images }),
    ),
  });
}
