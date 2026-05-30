import { cookies } from "next/headers";
import { randomBytes } from "crypto";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const CART_SESSION_COOKIE = "cart_session";
const CART_SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export type CartLine = {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    isActive: boolean;
    isGiftReady: boolean;
    imageUrl: string | null;
  };
};

export type CartSummary = {
  items: CartLine[];
  subtotal: number;
  itemCount: number;
};

async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_SESSION_COOKIE)?.value;
  if (existing) return existing;

  const sessionId = randomBytes(16).toString("hex");
  cookieStore.set(CART_SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CART_SESSION_MAX_AGE,
  });
  return sessionId;
}

export async function getCartOwner(): Promise<{
  userId?: string;
  sessionId?: string;
}> {
  const session = await getSession();
  if (session?.role === "user" && session.phone) {
    const user = await prisma.user.findUnique({
      where: { phone: session.phone },
    });
    if (user) return { userId: user.id };
  }
  const sessionId = await getOrCreateSessionId();
  return { sessionId };
}

export async function mergeGuestCartToUser(
  sessionId: string,
  userId: string,
): Promise<void> {
  const guestItems = await prisma.cartItem.findMany({
    where: { sessionId },
  });

  for (const item of guestItems) {
    const existing = await prisma.cartItem.findFirst({
      where: { userId, productId: item.productId },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + item.quantity },
      });
      await prisma.cartItem.delete({ where: { id: item.id } });
    } else {
      await prisma.cartItem.update({
        where: { id: item.id },
        data: { userId, sessionId: null },
      });
    }
  }
}

function mapCartItem(item: {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    isActive: boolean;
    isGiftReady: boolean;
    images: { url: string; sortOrder: number }[];
  };
}): CartLine {
  const sortedImages = [...item.product.images].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
  return {
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    product: {
      id: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      price: item.product.price,
      stock: item.product.stock,
      isActive: item.product.isActive,
      isGiftReady: item.product.isGiftReady,
      imageUrl: sortedImages[0]?.url ?? null,
    },
  };
}

export async function getCart(): Promise<CartSummary> {
  const owner = await getCartOwner();
  const where = owner.userId
    ? { userId: owner.userId }
    : { sessionId: owner.sessionId };

  const items = await prisma.cartItem.findMany({
    where,
    include: {
      product: {
        include: { images: { orderBy: { sortOrder: "asc" } } },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const lines = items
    .filter((item) => item.product.isActive)
    .map(mapCartItem);

  const subtotal = lines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  );
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  return { items: lines, subtotal, itemCount };
}

export async function addToCart(
  productId: string,
  quantity: number,
): Promise<CartSummary> {
  const owner = await getCartOwner();
  const product = await prisma.product.findFirst({
    where: { id: productId, isActive: true },
  });

  if (!product) throw new Error("PRODUCT_NOT_FOUND");
  if (product.stock < 1) throw new Error("OUT_OF_STOCK");

  const where = owner.userId
    ? { userId: owner.userId, productId }
    : { sessionId: owner.sessionId, productId };

  const existing = await prisma.cartItem.findFirst({ where });

  if (existing) {
    const newQty = Math.min(existing.quantity + quantity, product.stock);
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQty },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        userId: owner.userId ?? null,
        sessionId: owner.sessionId ?? null,
        productId,
        quantity: Math.min(quantity, product.stock),
      },
    });
  }

  return getCart();
}

export async function updateCartItem(
  cartItemId: string,
  quantity: number,
): Promise<CartSummary> {
  const owner = await getCartOwner();
  const where = owner.userId
    ? { id: cartItemId, userId: owner.userId }
    : { id: cartItemId, sessionId: owner.sessionId };

  const item = await prisma.cartItem.findFirst({
    where,
    include: { product: true },
  });

  if (!item) throw new Error("CART_ITEM_NOT_FOUND");

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: Math.min(quantity, item.product.stock) },
    });
  }

  return getCart();
}

export async function removeCartItem(cartItemId: string): Promise<CartSummary> {
  return updateCartItem(cartItemId, 0);
}

export async function clearCart(): Promise<void> {
  const owner = await getCartOwner();
  if (owner.userId) {
    await prisma.cartItem.deleteMany({ where: { userId: owner.userId } });
  } else if (owner.sessionId) {
    await prisma.cartItem.deleteMany({ where: { sessionId: owner.sessionId } });
  }
}
