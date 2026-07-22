import { buildPhoneModel } from "../phone-back";
import type { PhoneModel } from "../types";
import { getChassisTemplate, resolveChassisTemplate } from "./chassis-templates";

function appleModel(
  slug: string,
  name: string,
  nameEn: string,
  widthMm: number,
  heightMm: number,
  templateSlug: string,
): PhoneModel {
  const template = getChassisTemplate(templateSlug);
  return buildPhoneModel({
    slug,
    brandSlug: "apple",
    name,
    nameEn,
    widthMm,
    heightMm,
    back: resolveChassisTemplate(template, widthMm, heightMm),
  });
}

export const APPLE_PHONE_MODELS: PhoneModel[] = [
  // iPhone 16
  appleModel("iphone-16-pro-max", "آیفون ۱۶ پرو مکس", "iPhone 16 Pro Max", 77.6, 163.0, "iphone-16-pro-triple"),
  appleModel("iphone-16-pro", "آیفون ۱۶ پرو", "iPhone 16 Pro", 71.5, 149.6, "iphone-16-pro-triple"),
  appleModel("iphone-16-plus", "آیفون ۱۶ پلاس", "iPhone 16 Plus", 77.8, 160.9, "iphone-16-dual"),
  appleModel("iphone-16", "آیفون ۱۶", "iPhone 16", 71.6, 147.6, "iphone-16-dual"),

  // iPhone 15
  appleModel("iphone-15-pro-max", "آیفون ۱۵ پرو مکس", "iPhone 15 Pro Max", 76.7, 159.9, "iphone-15-pro-triple"),
  appleModel("iphone-15-pro", "آیفون ۱۵ پرو", "iPhone 15 Pro", 70.6, 146.6, "iphone-15-pro-triple"),
  appleModel("iphone-15-plus", "آیفون ۱۵ پلاس", "iPhone 15 Plus", 77.8, 160.9, "iphone-12-dual-diagonal"),
  appleModel("iphone-15", "آیفون ۱۵", "iPhone 15", 71.6, 147.6, "iphone-12-dual-diagonal"),

  // iPhone 14
  appleModel("iphone-14-pro-max", "آیفون ۱۴ پرو مکس", "iPhone 14 Pro Max", 77.6, 160.7, "iphone-12-pro-triple"),
  appleModel("iphone-14-pro", "آیفون ۱۴ پرو", "iPhone 14 Pro", 71.5, 147.5, "iphone-12-pro-triple"),
  appleModel("iphone-14-plus", "آیفون ۱۴ پلاس", "iPhone 14 Plus", 78.1, 160.8, "iphone-12-dual-diagonal"),
  appleModel("iphone-14", "آیفون ۱۴", "iPhone 14", 71.5, 146.7, "iphone-12-dual-diagonal"),

  // iPhone 13
  appleModel("iphone-13-pro-max", "آیفون ۱۳ پرو مکس", "iPhone 13 Pro Max", 78.1, 160.8, "iphone-12-pro-triple"),
  appleModel("iphone-13-pro", "آیفون ۱۳ پرو", "iPhone 13 Pro", 71.5, 146.7, "iphone-12-pro-triple"),
  appleModel("iphone-13-mini", "آیفون ۱۳ مینی", "iPhone 13 mini", 64.2, 131.5, "iphone-12-dual-diagonal"),
  appleModel("iphone-13", "آیفون ۱۳", "iPhone 13", 71.5, 146.7, "iphone-12-dual-diagonal"),

  // iPhone 12
  appleModel("iphone-12-pro-max", "آیفون ۱۲ پرو مکس", "iPhone 12 Pro Max", 78.1, 160.8, "iphone-12-pro-triple"),
  appleModel("iphone-12-pro", "آیفون ۱۲ پرو", "iPhone 12 Pro", 71.5, 146.7, "iphone-12-pro-triple"),
  appleModel("iphone-12-mini", "آیفون ۱۲ مینی", "iPhone 12 mini", 64.2, 131.5, "iphone-12-dual-diagonal"),
  appleModel("iphone-12", "آیفون ۱۲", "iPhone 12", 71.5, 146.7, "iphone-12-dual-diagonal"),

  // iPhone 11
  appleModel("iphone-11-pro-max", "آیفون ۱۱ پرو مکس", "iPhone 11 Pro Max", 77.8, 158.0, "iphone-11-pro-triple"),
  appleModel("iphone-11-pro", "آیفون ۱۱ پرو", "iPhone 11 Pro", 71.4, 144.0, "iphone-11-pro-triple"),
  appleModel("iphone-11", "آیفون ۱۱", "iPhone 11", 75.7, 150.9, "iphone-11-dual"),

  // iPhone X series
  appleModel("iphone-xs-max", "آیفون XS Max", "iPhone XS Max", 77.8, 157.5, "iphone-x-dual-vertical"),
  appleModel("iphone-xs", "آیفون XS", "iPhone XS", 70.9, 143.6, "iphone-x-dual-vertical"),
  appleModel("iphone-xr", "آیفون XR", "iPhone XR", 75.7, 150.9, "iphone-xr-single"),
  appleModel("iphone-x", "آیفون X", "iPhone X", 70.9, 143.6, "iphone-x-dual-vertical"),

  // iPhone SE
  appleModel("iphone-se-3", "آیفون SE (نسل ۳)", "iPhone SE (3rd gen)", 67.3, 138.4, "iphone-se-single"),
  appleModel("iphone-se-2", "آیفون SE (نسل ۲)", "iPhone SE (2nd gen)", 67.3, 138.4, "iphone-se-single"),
];
