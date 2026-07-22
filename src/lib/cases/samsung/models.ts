import { buildPhoneModel } from "../phone-back";
import type { PhoneModel } from "../types";
import { getChassisTemplate, resolveChassisTemplate } from "./chassis-templates";

function samsungModel(
  slug: string,
  name: string,
  nameEn: string,
  widthMm: number,
  heightMm: number,
  templateSlug: string,
  baseCanvasWidth?: number,
): PhoneModel {
  const template = getChassisTemplate(templateSlug);
  return buildPhoneModel({
    slug,
    brandSlug: "samsung",
    name,
    nameEn,
    widthMm,
    heightMm,
    back: resolveChassisTemplate(template, widthMm, heightMm),
    baseCanvasWidth,
  });
}

export const SAMSUNG_PHONE_MODELS: PhoneModel[] = [
  // Galaxy S25
  samsungModel("galaxy-s25-ultra", "گلکسی S25 Ultra", "Galaxy S25 Ultra", 77.6, 162.8, "galaxy-s-ultra-isolated", 290),
  samsungModel("galaxy-s25-plus", "گلکسی S25 Plus", "Galaxy S25 Plus", 75.8, 158.4, "galaxy-s25-base-dual"),
  samsungModel("galaxy-s25", "گلکسی S25", "Galaxy S25", 70.5, 146.9, "galaxy-s25-base-dual"),
  samsungModel("galaxy-s25-fe", "گلکسی S25 FE", "Galaxy S25 FE", 76.7, 161.9, "galaxy-s25-base-dual"),

  // Galaxy S24
  samsungModel("galaxy-s24-ultra", "گلکسی S24 Ultra", "Galaxy S24 Ultra", 79.0, 162.3, "galaxy-s-ultra-isolated", 290),
  samsungModel("galaxy-s24-plus", "گلکسی S24 Plus", "Galaxy S24 Plus", 75.9, 158.5, "galaxy-s-plus-vertical"),
  samsungModel("galaxy-s24", "گلکسی S24", "Galaxy S24", 70.6, 147.0, "galaxy-s-base-vertical"),
  samsungModel("galaxy-s24-fe", "گلکسی S24 FE", "Galaxy S24 FE", 78.0, 162.0, "galaxy-s-plus-vertical"),

  // Galaxy S23
  samsungModel("galaxy-s23-ultra", "گلکسی S23 Ultra", "Galaxy S23 Ultra", 78.1, 163.4, "galaxy-s-ultra-isolated", 290),
  samsungModel("galaxy-s23-plus", "گلکسی S23 Plus", "Galaxy S23 Plus", 76.2, 157.8, "galaxy-s-plus-vertical"),
  samsungModel("galaxy-s23", "گلکسی S23", "Galaxy S23", 70.9, 146.3, "galaxy-s-base-vertical"),
  samsungModel("galaxy-s23-fe", "گلکسی S23 FE", "Galaxy S23 FE", 76.5, 162.0, "galaxy-s-plus-vertical"),

  // Galaxy S22
  samsungModel("galaxy-s22-ultra", "گلکسی S22 Ultra", "Galaxy S22 Ultra", 77.9, 163.3, "galaxy-s-ultra-isolated", 290),
  samsungModel("galaxy-s22-plus", "گلکسی S22 Plus", "Galaxy S22 Plus", 75.8, 157.4, "galaxy-s-plus-vertical"),
  samsungModel("galaxy-s22", "گلکسی S22", "Galaxy S22", 75.6, 146.0, "galaxy-s-base-vertical"),

  // Galaxy S21
  samsungModel("galaxy-s21-ultra", "گلکسی S21 Ultra", "Galaxy S21 Ultra", 75.6, 165.1, "galaxy-s-ultra-isolated", 290),
  samsungModel("galaxy-s21-plus", "گلکسی S21 Plus", "Galaxy S21 Plus", 75.6, 161.5, "galaxy-s-plus-vertical"),
  samsungModel("galaxy-s21", "گلکسی S21", "Galaxy S21", 75.6, 151.7, "galaxy-s-base-vertical"),
  samsungModel("galaxy-s21-fe", "گلکسی S21 FE", "Galaxy S21 FE", 74.5, 155.7, "galaxy-s21-fe-triple"),

  // Galaxy A series
  samsungModel("galaxy-a56", "گلکسی A56", "Galaxy A56", 77.4, 166.3, "galaxy-a-triple-vertical"),
  samsungModel("galaxy-a55", "گلکسی A55", "Galaxy A55", 77.4, 161.1, "galaxy-a-triple-vertical"),
  samsungModel("galaxy-a54", "گلکسی A54", "Galaxy A54", 76.7, 158.2, "galaxy-a-triple-vertical", 275),
  samsungModel("galaxy-a53", "گلکسی A53", "Galaxy A53", 74.8, 159.6, "galaxy-a-triple-vertical"),
  samsungModel("galaxy-a36", "گلکسی A36", "Galaxy A36", 77.6, 161.1, "galaxy-a-triple-vertical"),
  samsungModel("galaxy-a35", "گلکسی A35", "Galaxy A35", 78.0, 161.7, "galaxy-a-triple-vertical"),
  samsungModel("galaxy-a34", "گلکسی A34", "Galaxy A34", 78.0, 162.1, "galaxy-a-triple-vertical"),
  samsungModel("galaxy-a33", "گلکسی A33", "Galaxy A33", 74.0, 159.7, "galaxy-a-triple-vertical"),
  samsungModel("galaxy-a26", "گلکسی A26", "Galaxy A26", 77.5, 164.4, "galaxy-a-dual"),
  samsungModel("galaxy-a25", "گلکسی A25", "Galaxy A25", 76.6, 161.0, "galaxy-a-dual"),
  samsungModel("galaxy-a16", "گلکسی A16", "Galaxy A16", 77.4, 164.4, "galaxy-a-dual"),
  samsungModel("galaxy-a15", "گلکسی A15", "Galaxy A15", 76.8, 160.1, "galaxy-a-dual"),

  // Galaxy Z Fold (cover screen back)
  samsungModel("galaxy-z-fold-7", "گلکسی Z Fold 7", "Galaxy Z Fold 7", 58.9, 158.4, "galaxy-z-fold-cover", 240),
  samsungModel("galaxy-z-fold-6", "گلکسی Z Fold 6", "Galaxy Z Fold 6", 58.9, 153.5, "galaxy-z-fold-cover", 240),
  samsungModel("galaxy-z-fold-5", "گلکسی Z Fold 5", "Galaxy Z Fold 5", 58.9, 154.9, "galaxy-z-fold-cover", 240),
  samsungModel("galaxy-z-fold-4", "گلکسی Z Fold 4", "Galaxy Z Fold 4", 58.3, 155.1, "galaxy-z-fold-cover", 240),
  samsungModel("galaxy-z-fold-3", "گلکسی Z Fold 3", "Galaxy Z Fold 3", 58.1, 158.2, "galaxy-z-fold-cover", 240),

  // Galaxy Z Flip
  samsungModel("galaxy-z-flip-7", "گلکسی Z Flip 7", "Galaxy Z Flip 7", 75.2, 172.2, "galaxy-z-flip-dual"),
  samsungModel("galaxy-z-flip-6", "گلکسی Z Flip 6", "Galaxy Z Flip 6", 71.9, 165.1, "galaxy-z-flip-dual"),
  samsungModel("galaxy-z-flip-5", "گلکسی Z Flip 5", "Galaxy Z Flip 5", 71.9, 165.1, "galaxy-z-flip-dual"),
  samsungModel("galaxy-z-flip-4", "گلکسی Z Flip 4", "Galaxy Z Flip 4", 71.2, 165.2, "galaxy-z-flip-dual"),
  samsungModel("galaxy-z-flip-3", "گلکسی Z Flip 3", "Galaxy Z Flip 3", 72.2, 166.0, "galaxy-z-flip-dual"),
];
