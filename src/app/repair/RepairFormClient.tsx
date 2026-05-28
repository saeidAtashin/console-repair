"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wrench } from "lucide-react";

import {
  FormInput,
  FormSelect,
  FormTextarea,
  ImageUploadField,
} from "../components/ui/form";
import {
  consoleCatalog,
  consoleIds,
  getRepairService,
  type ConsoleId,
} from "../../lib/console-catalog";
import { neonInputProps } from "../../lib/neon-autofill";
import {
  consoleRepairIcons,
  getRepairDeviceLabel,
  type RepairPrefill,
} from "../../lib/repair-links";

const repairSchema = z.object({
  name: z.string().optional(),
  phone: z
    .string()
    .min(11, "شماره تماس معتبر نیست")
    .max(11, "شماره تماس معتبر نیست"),
  issue: z.string().optional(),
  description: z.string().optional(),
});

type RepairFormData = z.infer<typeof repairSchema>;

type Props = {
  initialPrefill: RepairPrefill;
};

export default function RepairFormClient({ initialPrefill }: Props) {
  const consoleId = initialPrefill.consoleId;
  const consoleConfig = consoleId ? consoleCatalog[consoleId] : null;
  const repairService = consoleId ? getRepairService(consoleId) : null;

  const [selectedConsoleId, setSelectedConsoleId] = useState<ConsoleId | "">(
    "",
  );
  const [deviceError, setDeviceError] = useState<string | null>(null);

  const deviceLabel = consoleId
    ? getRepairDeviceLabel(consoleId)
    : selectedConsoleId
      ? getRepairDeviceLabel(selectedConsoleId)
      : null;

  const defaultValues = useMemo<RepairFormData>(
    () => ({
      name: "",
      phone: "",
      issue: initialPrefill.issue ?? "",
      description: initialPrefill.description ?? "",
    }),
    [initialPrefill.issue, initialPrefill.description],
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
  } = useForm<RepairFormData>({
    resolver: zodResolver(repairSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = async (data: RepairFormData) => {
    if (!deviceLabel) {
      setDeviceError("لطفاً نوع دستگاه را انتخاب کنید");
      return;
    }

    setDeviceError(null);
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", data.name || "");
      formData.append("phone", data.phone);
      formData.append("device", deviceLabel);
      formData.append("issue", data.issue || "");
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

  const headerTitle = consoleConfig
    ? `ثبت درخواست تعمیر ${consoleConfig.title}`
    : "ثبت درخواست تعمیر";

  const headerSubtitle = consoleConfig
    ? (repairService?.description ??
      `فرم زیر را برای ${consoleConfig.title} تکمیل کنید.`)
    : "نوع دستگاه را انتخاب کرده و فرم زیر را تکمیل کنید.";

  return (
    <div className="relative overflow-hidden px-6 py-12 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] bg-cover opacity-20" />

      <div className="relative mx-auto max-w-3xl">
        <header className="relative mb-14 text-center">
          {consoleId && (
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              aria-hidden
            >
              <Image
                src={consoleRepairIcons[consoleId]}
                alt=""
                width={280}
                height={280}
                className="opacity-[0.07] blur-[1px]"
              />
            </div>
          )}

          <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 shadow-[0_0_25px_rgba(0,255,255,0.25)] backdrop-blur-xl">
            {consoleId ? (
              <Image
                src={consoleRepairIcons[consoleId]}
                alt={consoleConfig?.title ?? ""}
                width={56}
                height={56}
                className="relative z-10 h-14 w-14 object-contain"
              />
            ) : (
              <Wrench className="h-12 w-12 text-cyan-400" aria-hidden />
            )}
          </div>

          <h1 className="relative text-4xl font-extrabold leading-snug tracking-tight text-white drop-shadow-[0_0_10px_rgba(0,255,255,0.25)] md:text-5xl">
            {headerTitle}
          </h1>

          <p className="relative mx-auto mt-4 max-w-xl text-lg text-zinc-300">
            {headerSubtitle}
          </p>

          {consoleId && deviceLabel ? (
            <p className="relative mt-5 inline-flex rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 px-6 py-3 font-bold tracking-wide text-cyan-300 shadow-[0_0_15px_rgba(0,200,255,0.15)]">
              {deviceLabel}
            </p>
          ) : (
            <FormSelect
              label="نوع دستگاه *"
              id="repair-device"
              fieldClassName="relative mx-auto mt-5 w-full max-w-sm text-start"
              labelClassName="text-sm font-medium"
              errorClassName="text-sm"
              error={deviceError}
              value={selectedConsoleId}
              onChange={(e) => {
                setSelectedConsoleId(e.target.value as ConsoleId);
                setDeviceError(null);
              }}
            >
              <option value="" disabled>
                دستگاه خود را انتخاب کنید
              </option>
              {consoleIds.map((id) => (
                <option key={id} value={id}>
                  {getRepairDeviceLabel(id)}
                </option>
              ))}
            </FormSelect>
          )}
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          {success && (
            <div
              className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-green-300 shadow-[0_0_15px_rgba(0,255,100,0.2)]"
              role="status"
            >
              <p className="text-white">درخواست شما با موفقیت ثبت شد.</p>
              {trackingCode && (
                <p className="mt-2">
                  کد رهگیری:{" "}
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
              id="repair-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="09xxxxxxxxx"
              className="placeholder:text-end text-end"
              error={errors.phone?.message}
              {...register("phone")}
            />

            <FormInput
              label="نام ( اختیاری )"
              id="repair-name"
              type="text"
              autoComplete="name"
              placeholder="مثلاً علی محمدی"
              {...neonInputProps(register("name"))}
            />

            <FormInput
              label="نوع مشکل ( اختیاری )"
              id="repair-issue"
              type="text"
              placeholder="مثلاً خرابی HDMI"
              {...neonInputProps(register("issue"))}
            />

            <FormTextarea
              label="توضیحات بیشتر ( اختیاری )"
              id="repair-description"
              rows={5}
              placeholder="توضیحات مشکل..."
              className="resize-none placeholder:padding-4 padding-4"
              {...neonInputProps(register("description"))}
            />

            <ImageUploadField
              label="تصویر مشکل ( اختیاری )"
              id="repair-image"
              preview={imagePreview}
              onChange={handleImageChange}
            />

            <button
              type="submit"
              disabled={loading}
              className="h-14 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 font-bold text-black shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all hover:from-cyan-400 hover:to-blue-400 disabled:opacity-40"
            >
              {loading ? "در حال ثبت..." : "ثبت درخواست تعمیر"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
