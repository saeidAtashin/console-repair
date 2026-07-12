export type PhoneBrand = {
  slug: string;
  name: string;
  nameEn: string;
  logo: string;
};

export type PhoneModel = {
  slug: string;
  brandSlug: string;
  name: string;
  nameEn: string;
  image: string;
  canvasWidth: number;
  canvasHeight: number;
  widthMm: number;
  heightMm: number;
};

export type CaseType = {
  slug: string;
  name: string;
  description: string;
  price: number;
  customizationFee: number;
  color: string;
  material: "clear" | "matte" | "glass" | "silicone" | "leather";
};

export type ReadyCase = {
  id: string;
  slug: string;
  title: string;
  description: string;
  brandSlug: string;
  modelSlug: string;
  caseTypeSlug: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  tags: string[];
  inStock: boolean;
};

export type StickerPack = {
  id: string;
  category: string;
  name: string;
  stickers: StickerItem[];
};

export type StickerItem = {
  id: string;
  name: string;
  src: string;
  width: number;
  height: number;
};
