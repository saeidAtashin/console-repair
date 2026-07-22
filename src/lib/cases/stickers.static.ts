import type { StickerPack } from "./types";

import { DESIGNED_STICKER_PACK } from "./designed.stickers.generated";

export const STICKER_PACKS: StickerPack[] = [
  ...(DESIGNED_STICKER_PACK.stickers.length > 0 ? [DESIGNED_STICKER_PACK] : []),
  {
    id: "emoji",
    category: "ایموجی",
    name: "ایموجی‌های محبوب",
    stickers: [
      { id: "e1", name: "قلب", src: "/cases/stickers/heart.svg", width: 64, height: 64 },
      { id: "e2", name: "ستاره", src: "/cases/stickers/star.svg", width: 64, height: 64 },
      { id: "e3", name: "آتش", src: "/cases/stickers/fire.svg", width: 64, height: 64 },
      { id: "e4", name: "رعد", src: "/cases/stickers/bolt.svg", width: 64, height: 64 },
      { id: "e5", name: "تاج", src: "/cases/stickers/crown.svg", width: 64, height: 64 },
      { id: "e6", name: "الماس", src: "/cases/stickers/diamond.svg", width: 64, height: 64 },
    ],
  },
  {
    id: "patterns",
    category: "الگو",
    name: "الگوهای هندسی",
    stickers: [
      { id: "p1", name: "دایره", src: "/cases/stickers/circle.svg", width: 80, height: 80 },
      { id: "p2", name: "مثلث", src: "/cases/stickers/triangle.svg", width: 80, height: 80 },
      { id: "p3", name: "موج", src: "/cases/stickers/wave.svg", width: 120, height: 40 },
      { id: "p4", name: "زیگزاگ", src: "/cases/stickers/zigzag.svg", width: 120, height: 40 },
    ],
  },
  {
    id: "nature",
    category: "طبیعت",
    name: "طبیعت و گل",
    stickers: [
      { id: "n1", name: "برگ", src: "/cases/stickers/leaf.svg", width: 72, height: 72 },
      { id: "n2", name: "گل", src: "/cases/stickers/flower.svg", width: 72, height: 72 },
      { id: "n3", name: "خورشید", src: "/cases/stickers/sun.svg", width: 72, height: 72 },
      { id: "n4", name: "ماه", src: "/cases/stickers/moon.svg", width: 72, height: 72 },
    ],
  },
  {
    id: "gaming",
    category: "گیمینگ",
    name: "گیمینگ",
    stickers: [
      { id: "g1", name: "دسته بازی", src: "/cases/stickers/gamepad.svg", width: 80, height: 80 },
      { id: "g2", name: "هدفون", src: "/cases/stickers/headphones.svg", width: 80, height: 80 },
      { id: "g3", name: "تروفی", src: "/cases/stickers/trophy.svg", width: 80, height: 80 },
      { id: "g4", name: "PIXEL", src: "/cases/stickers/pixel-text.svg", width: 100, height: 40 },
    ],
  },
];

export function getStickerPacks(): StickerPack[] {
  return STICKER_PACKS;
}
