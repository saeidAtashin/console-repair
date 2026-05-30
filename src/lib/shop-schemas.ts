import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "نام دسته الزامی است"),
  slug: z.string().min(2).optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "نام محصول الزامی است"),
  slug: z.string().min(2).optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.coerce.number().int().min(0),
  compareAtPrice: z.coerce.number().int().min(0).nullable().optional(),
  stock: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isGiftReady: z.boolean().optional(),
  giftNote: z.string().optional(),
  categoryId: z.string().min(1, "دسته‌بندی الزامی است"),
});

export const checkoutSchema = z.object({
  guestName: z.string().min(2, "نام الزامی است"),
  guestPhone: z.string().min(10, "شماره موبایل معتبر نیست"),
  paymentMethod: z.enum(["online", "cod"]),
  shippingName: z.string().min(2),
  shippingPhone: z.string().min(10),
  shippingProvince: z.string().min(2),
  shippingCity: z.string().min(2),
  shippingAddress: z.string().min(5),
  shippingPostalCode: z.string().optional(),
});

export const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  province: z.string().min(2),
  city: z.string().min(2),
  addressLine: z.string().min(5),
  postalCode: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export const cartAddSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(99).default(1),
});

export const cartUpdateSchema = z.object({
  cartItemId: z.string().min(1),
  quantity: z.coerce.number().int().min(0).max(99),
});

export const shopOrderStatusSchema = z.object({
  status: z.enum([
    "pending_payment",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
  adminNote: z.string().optional(),
});
