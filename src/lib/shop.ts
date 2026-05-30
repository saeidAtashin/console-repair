import { prisma } from "@/lib/db";

export async function listActiveCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findFirst({
    where: { slug, isActive: true },
  });
}

export async function listProducts(filters?: {
  categorySlug?: string;
  featured?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}) {
  const category = filters?.categorySlug
    ? await getCategoryBySlug(filters.categorySlug)
    : null;

  return prisma.product.findMany({
    where: {
      isActive: true,
      ...(category ? { categoryId: category.id } : {}),
      ...(filters?.featured ? { isFeatured: true } : {}),
      ...(filters?.inStock ? { stock: { gt: 0 } } : {}),
      ...(filters?.minPrice !== undefined
        ? { price: { gte: filters.minPrice } }
        : {}),
      ...(filters?.maxPrice !== undefined
        ? { price: { lte: filters.maxPrice } }
        : {}),
      ...(filters?.search
        ? {
            OR: [
              { name: { contains: filters.search } },
              { shortDescription: { contains: filters.search } },
            ],
          }
        : {}),
    },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit = 4,
) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      categoryId,
      id: { not: productId },
      stock: { gt: 0 },
    },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    take: limit,
  });
}

export function serializeProduct(product: {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isGiftReady: boolean;
  giftNote: string;
  categoryId: string;
  category?: { id: string; name: string; slug: string };
  images?: { id: string; url: string; alt: string; sortOrder: number }[];
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    stock: product.stock,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    isGiftReady: product.isGiftReady,
    giftNote: product.giftNote,
    categoryId: product.categoryId,
    category: product.category,
    images: product.images ?? [],
    imageUrl: product.images?.[0]?.url ?? null,
    createdAt: product.createdAt?.toISOString(),
    updatedAt: product.updatedAt?.toISOString(),
  };
}

export function serializeCategory(category: {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  _count?: { products: number };
}) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    imageUrl: category.imageUrl,
    sortOrder: category.sortOrder,
    isActive: category.isActive,
    productCount: category._count?.products ?? 0,
  };
}

export function serializeShopOrder(order: {
  id: string;
  orderNumber: string;
  guestName: string;
  guestPhone: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentRef: string | null;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingName: string;
  shippingPhone: string;
  shippingProvince: string;
  shippingCity: string;
  shippingAddress: string;
  shippingPostalCode: string;
  adminNote: string;
  createdAt: Date;
  updatedAt: Date;
  items?: {
    id: string;
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
  }[];
}) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    guestName: order.guestName,
    guestPhone: order.guestPhone,
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    paymentRef: order.paymentRef,
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    discount: order.discount,
    total: order.total,
    shippingName: order.shippingName,
    shippingPhone: order.shippingPhone,
    shippingProvince: order.shippingProvince,
    shippingCity: order.shippingCity,
    shippingAddress: order.shippingAddress,
    shippingPostalCode: order.shippingPostalCode,
    adminNote: order.adminNote,
    items: order.items ?? [],
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}
