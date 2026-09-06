"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  FormInput,
  FormSelect,
  FormTextarea,
  ImageUploadField,
} from "@/app/components/ui/form";
import PhoneVerificationModal from "@/app/components/auth/PhoneVerificationModal";
import { useAuth } from "@/app/context/AuthContext";
import {
  usePhoneVerifiedSubmit,
  VerificationCancelledError,
} from "@/app/hooks/usePhoneVerifiedSubmit";
import { ApiError } from "@/lib/api-client";
import {
  appendRepairDetails,
  buildDiagnosisTransfer,
  diagnosisCatalog,
  matchDeviceForDiagnosis,
  matchProblemTypeForDiagnosis,
  type DiagnosisResult,
  type DiagnosisSession,
} from "@/lib/diagnosis";
import { neonInputProps } from "@/lib/neon-autofill";
import {
  IRAN_PHONE_INVALID_MESSAGE,
  isValidIranPhone,
  normalizeIranPhone,
  sanitizePhoneInput,
} from "@/lib/phone";
import {
  buildRepairRequestPayload,
  fetchRepairDevices,
  fetchRepairProblemTypes,
  submitRepairRequest,
} from "@/lib/repair/api";
import type { BrandTheme } from "@/lib/brand-theme";
import { cn } from "@/lib/utils";

const repairSchema = z.object({
  name: z.string().optional(),
  phone: z
    .string()
    .min(1, "شماره تماس الزامی است")
    .refine((value) => isValidIranPhone(value), {
      message: IRAN_PHONE_INVALID_MESSAGE,
    })
    .transform((value) => normalizeIranPhone(value)!),
  city: z.string().min(2, "شهر را وارد کنید"),
  delivery: z.string().min(1, "روش تحویل را انتخاب کنید"),
  notes: z.string().optional(),
});

type RepairFormInput = z.input<typeof repairSchema>;
type RepairFormData = z.output<typeof repairSchema>;

type Props = {
  session: DiagnosisSession;
  result: DiagnosisResult;
  theme: BrandTheme;
  onSuccess: (trackingCode: string) => void;
};

const DELIVERY_OPTIONS = [
  { id: "courier", label: "پیک" },
  { id: "post", label: "ارسال با پست" },
  { id: "in-person", label: "مراجعه حضوری" },
];

export default function RepairStep({ session, result, theme, onSuccess }: Props) {
  const { user } = useAuth();
  const { requestSubmit, verifying, modalProps } = usePhoneVerifiedSubmit();
  const transfer = useMemo(
    () => buildDiagnosisTransfer(session, diagnosisCatalog),
    [session],
  );

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultPhone = user?.phone_number ?? user?.phone ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RepairFormInput, unknown, RepairFormData>({
    resolver: zodResolver(repairSchema),
    defaultValues: {
      name: "",
      phone: defaultPhone,
      city: "",
      delivery: "",
      notes: "",
    },
  });

  const phoneField = register("phone");

  useEffect(() => {
    void fetchRepairDevices().catch(() => undefined);
  }, []);

  const onSubmit = async (data: RepairFormData) => {
    setSubmitError(null);
    setLoading(true);
    try {
      await requestSubmit(data.phone, async () => {
        const devices = await fetchRepairDevices();
        if (devices.length === 0) {
          throw new Error("لیست دستگاه‌ها از سرور نیامد. کمی بعد دوباره تلاش کنید.");
        }
        const device = matchDeviceForDiagnosis(
          devices,
          diagnosisCatalog,
          session,
        );
        if (!device) {
          throw new Error("لیست دستگاه‌ها از سرور نیامد. کمی بعد دوباره تلاش کنید.");
        }
        const problemTypes = await fetchRepairProblemTypes(device.id);
        const problemType = matchProblemTypeForDiagnosis(
          problemTypes,
          diagnosisCatalog,
          session,
        );
        const description = appendRepairDetails(transfer.description, {
          city: data.city,
          delivery: DELIVERY_OPTIONS.find((item) => item.id === data.delivery)?.label,
          notes: data.notes,
          hasPhoto: Boolean(imagePreview),
          hasVideo: Boolean(videoName),
        });
        const payload = buildRepairRequestPayload(
          { name: data.name, phone: data.phone, description },
          device.id,
          problemType?.id ?? "",
          devices,
          problemTypes,
        );
        const created = await submitRepairRequest(payload);
        onSuccess(created.id != null ? String(created.id) : data.phone);
      });
    } catch (error) {
      if (error instanceof VerificationCancelledError) return;
      if (error instanceof ApiError || error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError("خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PhoneVerificationModal {...modalProps} />
      <div className={cn("rounded-3xl border bg-white/5 p-5 text-sm leading-7 text-zinc-300", theme.border)}>
        <p className="font-bold text-white">خلاصه بررسی</p>
        <p className="mt-2">
          {result.consoleModel}
          {result.variant ? ` · ${result.variant}` : ""} — {result.problem}
        </p>
        <p className="mt-1 text-zinc-400">
          این اطلاعات از عیب‌یابی منتقل می‌شود و لازم نیست دوباره واردشان کنی.
        </p>
      </div>

      {submitError ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          {submitError}
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          label="شماره تماس *"
          id="diagnosis-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...phoneField}
          onChange={(event) => {
            event.target.value = sanitizePhoneInput(event.target.value);
            phoneField.onChange(event);
          }}
        />
        <FormInput
          label="نام"
          id="diagnosis-name"
          autoComplete="name"
          {...neonInputProps(register("name"))}
        />
        <FormInput
          label="شهر *"
          id="diagnosis-city"
          error={errors.city?.message}
          {...neonInputProps(register("city"))}
        />
        <FormSelect
          label="روش تحویل *"
          id="diagnosis-delivery"
          error={errors.delivery?.message}
          {...register("delivery")}
        >
          <option value="">انتخاب کنید</option>
          {DELIVERY_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </FormSelect>
        <FormTextarea
          label="توضیحات اضافه"
          id="diagnosis-notes"
          rows={4}
          placeholder="اگر نکته‌ای مانده بنویس..."
          {...neonInputProps(register("notes"))}
        />
        <ImageUploadField
          label="عکس (اختیاری — فعلاً ارسال نمی‌شود)"
          id="diagnosis-photo"
          preview={imagePreview}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setImagePreview(URL.createObjectURL(file));
          }}
        />
        <label className="block text-sm font-medium text-zinc-300">
          ویدئو (اختیاری — فعلاً ارسال نمی‌شود)
          <input
            type="file"
            accept="video/*"
            className="mt-2 block w-full text-sm text-zinc-400"
            onChange={(event) => {
              setVideoName(event.target.files?.[0]?.name ?? null);
            }}
          />
          {videoName ? (
            <span className="mt-2 block text-xs text-zinc-500">{videoName}</span>
          ) : null}
        </label>
        <button
          type="submit"
          disabled={loading || verifying}
          className={cn(
            "h-14 w-full rounded-2xl font-bold text-black disabled:opacity-40",
            theme.submit,
          )}
        >
          {loading || verifying ? "در حال ثبت..." : "ثبت درخواست تعمیر"}
        </button>
      </form>
    </div>
  );
}
