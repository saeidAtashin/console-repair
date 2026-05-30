"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cog } from "lucide-react";

import {
  FormInput,
  FormTextarea,
  ImageUploadField,
} from "../components/ui/form";
import { services } from "../data/services";
import { products } from "../data/products";
import { neonInputProps } from "../../lib/neon-autofill";
import {
  IRAN_PHONE_INVALID_MESSAGE,
  isValidIranPhone,
  normalizeIranPhone,
  sanitizePhoneInput,
} from "../../lib/phone";
import {
  getOrderDeviceLabel,
  MATERIAL_OPTIONS,
  type OrderPrefill,
} from "../../lib/order-links";

const orderSchema = z.object({
  name: z.string().optional(),
  phone: z
    .string()
    .min(1, "شماره تماس الزامی است")
    .refine((value) => isValidIranPhone(value), {
      message: IRAN_PHONE_INVALID_MESSAGE,
    })
    .transform((value) => normalizeIranPhone(value)!),
  material: z.string().optional(),
  description: z.string().optional(),
});

type OrderFormInput = z.input<typeof orderSchema>;
type OrderFormData = z.output<typeof orderSchema>;

type Props = {
  initialPrefill: OrderPrefill;
  defaultPhone?: string;
  onSuccess?: () => void;
};

export default function OrderFormClient({
  initialPrefill,
  defaultPhone = "",
  onSuccess,
}: Props) {
  const [selectedServiceSlug, setSelectedServiceSlug] = useState(
    initialPrefill.serviceSlug ?? "",
  );
  const [deviceError, setDeviceError] = useState<string | null>(null);

  const prefill: OrderPrefill = {
    serviceSlug: selectedServiceSlug || initialPrefill.serviceSlug,
    productSlug: initialPrefill.productSlug,
    material: initialPrefill.material,
    description: initialPrefill.description,
  };

  const deviceLabel = getOrderDeviceLabel(prefill);
  const hasFixedSelection =
    Boolean(initialPrefill.serviceSlug) || Boolean(initialPrefill.productSlug);

  const defaultValues = useMemo<OrderFormInput>(
    () => ({
      name: "",
      phone: defaultPhone,
      material: initialPrefill.material ?? "",
      description: initialPrefill.description ?? "",
    }),
    [defaultPhone, initialPrefill.material, initialPrefill.description],
  );

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderFormInput, unknown, OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues,
  });

  const phoneField = register("phone");

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = async (data: OrderFormData) => {
    const label = getOrderDeviceLabel({
      ...prefill,
      serviceSlug: selectedServiceSlug || prefill.serviceSlug,
    });

    if (!label || (!hasFixedSelection && !selectedServiceSlug)) {
      setDeviceError("لطفاً نوع خدمت یا محصول را انتخاب کنید");
      return;
    }

    setDeviceError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name || "");
      formData.append("phone", data.phone);
      formData.append("device", label);
      formData.append("issue", data.material || "");
      formData.append("description", data.description || "");

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const res = await fetch("/api/repair", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setSuccess(true);
        setTrackingCode(result.trackingCode);
        reset(defaultValues);
        setSelectedFile(null);
        setImagePreview(null);
        onSuccess?.();
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const headerTitle = initialPrefill.productSlug
    ? `سفارش ${products.find((p) => p.slug === initialPrefill.productSlug)?.title ?? "محصول"}`
    : initialPrefill.serviceSlug
      ? `ثبت سفارش ${services.find((s) => s.slug === initialPrefill.serviceSlug)?.title ?? "CNC"}`
      : "ثبت سفارش CNC";

  return (
    <div className="relative overflow-hidden px-6 py-12 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] bg-cover opacity-20" />

      <div className="relative mx-auto max-w-3xl">
        <header className="relative mb-14 text-center">
          <div className="relative mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-amber-600/10 shadow-[0_0_25px_rgba(249,115,22,0.25)] backdrop-blur-xl">
            <Cog className="h-12 w-12 text-orange-400" aria-hidden />
          </div>

          <h1 className="relative text-4xl font-extrabold leading-snug tracking-tight text-white md:text-5xl">
            {headerTitle}
          </h1>

          <p className="relative mx-auto mt-4 max-w-xl text-lg text-zinc-300">
            فایل طراحی، جنس و ابعاد را ارسال کنید تا قیمت و زمان تحویل اعلام
            شود.
          </p>

          {hasFixedSelection ? (
            <p className="relative mt-5 inline-flex rounded-2xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-amber-500/10 px-6 py-3 font-bold tracking-wide text-orange-300">
              {deviceLabel}
            </p>
          ) : (
            <div className="relative mt-8 text-right">
              <label className="mb-2 block text-sm text-zinc-400">
                نوع خدمت *
              </label>
              <select
                value={selectedServiceSlug}
                onChange={(e) => {
                  setSelectedServiceSlug(e.target.value);
                  setDeviceError(null);
                }}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-orange-400/50"
              >
                <option value="">انتخاب کنید...</option>
                {services.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.title}
                  </option>
                ))}
              </select>
              {deviceError && (
                <p className="mt-2 text-sm text-red-400">{deviceError}</p>
              )}
            </div>
          )}
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          {success && (
            <div
              className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-green-300"
              role="status"
            >
              <p className="text-white">سفارش شما با موفقیت ثبت شد.</p>
              {trackingCode && (
                <p className="mt-2">
                  کد پیگیری:{" "}
                  <span className="font-black tracking-widest text-white">
                    {trackingCode}
                  </span>
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <FormInput
              label="شماره تماس *"
              id="order-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="09..."
              className="placeholder:text-end text-end"
              error={errors.phone?.message}
              readOnly={Boolean(defaultPhone)}
              {...phoneField}
              onChange={(e) => {
                e.target.value = sanitizePhoneInput(e.target.value);
                phoneField.onChange(e);
              }}
            />

            <FormInput
              label="نام (اختیاری)"
              id="order-name"
              type="text"
              autoComplete="name"
              placeholder="مثلاً علی محمدی"
              {...neonInputProps(register("name"))}
            />

            <div>
              <label
                htmlFor="order-material"
                className="mb-2 block text-sm text-zinc-400"
              >
                جنس / ضخامت (اختیاری)
              </label>
              <select
                id="order-material"
                {...register("material")}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-orange-400/50"
              >
                <option value="">انتخاب کنید...</option>
                {MATERIAL_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <FormTextarea
              label="ابعاد و جزئیات پروژه (اختیاری)"
              id="order-description"
              rows={5}
              placeholder="ابعاد، تعداد، توضیحات..."
              className="resize-none"
              {...neonInputProps(register("description"))}
            />

            <ImageUploadField
              label="فایل طراحی (DXF, SVG, PDF, عکس — اختیاری)"
              id="order-image"
              preview={imagePreview}
              onChange={handleImageChange}
            />

            <button
              type="submit"
              disabled={loading}
              className="h-14 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 font-bold text-black shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all hover:from-orange-400 hover:to-amber-400 disabled:opacity-40"
            >
              {loading ? "در حال ثبت..." : "ثبت سفارش CNC"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
