"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
import RepairDevicePicker from "./RepairDevicePicker";
import {
  consoleCatalog,
  getRepairService,
  type ConsoleId,
} from "../../lib/console-catalog";
import { neonInputProps } from "../../lib/neon-autofill";
import {
  IRAN_PHONE_INVALID_MESSAGE,
  isValidIranPhone,
  normalizeIranPhone,
  sanitizePhoneInput,
} from "../../lib/phone";
import {
  consoleRepairIcons,
  consoleIdFromDeviceName,
  getRepairDeviceDisplayName,
  getRepairDeviceIcon,
  getRepairDeviceLabel,
  type RepairPrefill,
} from "../../lib/repair-links";
import type { BrandTheme } from "@/lib/brand-theme";
import { brandThemes } from "@/lib/brand-theme";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api-client";
import PhoneVerificationModal from "@/app/components/auth/PhoneVerificationModal";
import { useAuth } from "@/app/context/AuthContext";
import { usePhoneVerifiedSubmit, VerificationCancelledError } from "@/app/hooks/usePhoneVerifiedSubmit";
import {
  buildRepairRequestPayload,
  fetchRepairDevices,
  fetchRepairProblemTypes,
  matchDeviceForConsole,
  submitRepairRequest,
  type RepairDevice,
  type RepairProblemType,
} from "@/lib/repair/api";

const repairSchema = z.object({
  name: z.string().optional(),
  phone: z
    .string()
    .min(1, "شماره تماس الزامی است")
    .refine((value) => isValidIranPhone(value), {
      message: IRAN_PHONE_INVALID_MESSAGE,
    })
    .transform((value) => normalizeIranPhone(value)!),
  description: z.string().optional(),
});

type RepairFormInput = z.input<typeof repairSchema>;
type RepairFormData = z.output<typeof repairSchema>;

type Props = {
  initialPrefill: RepairPrefill;
  defaultPhone?: string;
  onSuccess?: () => void;
  theme?: BrandTheme;
  onConsoleChange?: (consoleId: ConsoleId | undefined) => void;
  variant?: "page" | "embedded";
};

const defaultTheme = brandThemes.gaming;

function buildInitialDescription(prefill: RepairPrefill): string {
  const parts = [prefill.issue, prefill.description].filter(Boolean);
  return parts.join("\n\n");
}

export default function RepairFormClient({
  initialPrefill,
  defaultPhone = "",
  onSuccess,
  theme = defaultTheme,
  onConsoleChange,
  variant = "page",
}: Props) {
  const { user } = useAuth();
  const { requestSubmit, verifying, modalProps } = usePhoneVerifiedSubmit();

  const [authHydrated, setAuthHydrated] = useState(false);

  useEffect(() => {
    setAuthHydrated(true);
  }, []);

  const accountPhone = user?.phone_number ?? user?.phone ?? defaultPhone;
  const initialPhone = authHydrated ? accountPhone : defaultPhone;
  const consoleId = initialPrefill.consoleId;
  const prefillIssue = initialPrefill.issue;
  const prefillDescription = initialPrefill.description;
  const consoleConfig = consoleId ? consoleCatalog[consoleId] : null;
  const repairService = consoleId ? getRepairService(consoleId) : null;

  const [devices, setDevices] = useState<RepairDevice[]>([]);
  const [problemTypes, setProblemTypes] = useState<RepairProblemType[]>([]);
  const [deviceTypeId, setDeviceTypeId] = useState<number | "">("");
  const [problemTypeId, setProblemTypeId] = useState<number | "">("");
  const [devicesLoading, setDevicesLoading] = useState(true);
  const [problemTypesLoading, setProblemTypesLoading] = useState(false);

  const selectedDevice = devices.find((device) => device.id === deviceTypeId);

  const deviceLabel = consoleId
    ? getRepairDeviceLabel(consoleId)
    : selectedDevice
      ? getRepairDeviceDisplayName(selectedDevice.name)
      : null;

  const headerIconSrc = consoleId
    ? consoleRepairIcons[consoleId]
    : selectedDevice
      ? getRepairDeviceIcon(selectedDevice.name)
      : null;

  const defaultValues = useMemo<RepairFormInput>(
    () => ({
      name: "",
      phone: initialPhone,
      description: buildInitialDescription({
        consoleId,
        issue: prefillIssue,
        description: prefillDescription,
      }),
    }),
    [initialPhone, consoleId, prefillIssue, prefillDescription],
  );

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [acceptanceCode, setAcceptanceCode] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const embedded = variant === "embedded";
  const HeadingTag = embedded ? "h2" : "h1";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RepairFormInput, unknown, RepairFormData>({
    resolver: zodResolver(repairSchema),
    defaultValues,
  });

  const phoneField = register("phone");

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const loadProblemTypes = useCallback(async (deviceId: number) => {
    setProblemTypesLoading(true);
    setProblemTypeId("");

    try {
      const results = await fetchRepairProblemTypes(deviceId);
      setProblemTypes(results);
      if (results.length === 1) {
        setProblemTypeId(results[0].id);
      }
    } catch (error) {
      console.error(error);
      setProblemTypes([]);
    } finally {
      setProblemTypesLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    void fetchRepairDevices()
      .then((results) => {
        if (cancelled) return;
        setDevices(results);

        if (consoleId) {
          const matched = matchDeviceForConsole(results, consoleId);
          if (matched) {
            setDeviceTypeId(matched.id);
            void loadProblemTypes(matched.id);
          }
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        if (!cancelled) setDevicesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [consoleId, loadProblemTypes]);

  const onSubmit = async (data: RepairFormData) => {
    setSuccess(false);
    setAcceptanceCode(null);
    setSubmitError(null);
    setLoading(true);

    try {
      await requestSubmit(data.phone, async () => {
        const payload = buildRepairRequestPayload(
          data,
          deviceTypeId,
          problemTypeId,
          devices,
          problemTypes,
        );

        const created = await submitRepairRequest(payload);
        setAcceptanceCode(created.id != null ? String(created.id) : null);
        setSuccess(true);
        reset(defaultValues);
        setImagePreview(null);
        setProblemTypeId("");
        if (!consoleId) {
          setDeviceTypeId("");
          setProblemTypes([]);
          onConsoleChange?.(undefined);
        }
        onSuccess?.();
      });
    } catch (error) {
      if (error instanceof VerificationCancelledError) {
        return;
      }
      if (error instanceof ApiError) {
        setSubmitError(error.message);
      } else if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError("خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
    <div
      id={embedded ? "repair-request" : undefined}
      className={cn("relative text-white", embedded ? "px-0 py-4" : "px-6 py-12")}
    >
      <PhoneVerificationModal {...modalProps} />

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

          {!consoleId && selectedDevice && (
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              aria-hidden
            >
              <Image
                src={getRepairDeviceIcon(selectedDevice.name)}
                alt=""
                width={280}
                height={280}
                className="opacity-[0.07] blur-[1px]"
              />
            </div>
          )}

          <div
            className={cn(
              "relative mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border bg-gradient-to-br to-transparent backdrop-blur-xl",
              theme.border,
              theme.bg,
            )}
          >
            {headerIconSrc ? (
              <Image
                src={headerIconSrc}
                alt={deviceLabel ?? ""}
                width={56}
                height={56}
                className="relative z-10 h-24 w-24 object-contain invert"
              />
            ) : (
              <Wrench className={cn("h-12 w-12", theme.primary)} aria-hidden />
            )}
          </div>

          <HeadingTag className="relative text-4xl font-extrabold leading-snug tracking-tight text-white md:text-5xl">
            {headerTitle}
          </HeadingTag>

          <p className="relative mx-auto mt-4 max-w-xl text-lg text-zinc-300">
            {headerSubtitle}
          </p>

          {consoleId ? (
            deviceLabel ? (
              <p
                className={cn(
                  "relative mt-5 inline-flex rounded-2xl border px-6 py-3 font-bold tracking-wide",
                  theme.border,
                  theme.bg,
                  theme.primary,
                )}
              >
                {deviceLabel}
              </p>
            ) : null
          ) : (
            <RepairDevicePicker
              devices={devices}
              value={deviceTypeId}
              loading={devicesLoading}
              theme={theme}
              onChange={(id) => {
                setDeviceTypeId(id);
                setProblemTypeId("");
                setProblemTypes([]);
                void loadProblemTypes(id);
                const device = devices.find((item) => item.id === id);
                onConsoleChange?.(
                  device
                    ? consoleIdFromDeviceName(device.name)
                    : undefined,
                );
              }}
            />
          )}
        </header>

        <div
          className={cn(
            "rounded-3xl border bg-white/5 p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-[border-color,box-shadow] duration-700",
            theme.border,
          )}
        >
          {success && (
            <div
              className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-5 text-green-300 shadow-[0_0_15px_rgba(0,255,100,0.2)]"
              role="status"
            >
              <p className="font-bold text-white">درخواست شما با موفقیت ثبت شد.</p>
              {acceptanceCode ? (
                <div className="mt-3">
                  <p className="text-sm text-zinc-300">کد پذیرش</p>
                  <p className="mt-1 text-2xl font-black tracking-[0.28em] text-white">
                    {acceptanceCode}
                  </p>
                  <Link
                    href={`/tracking?code=${encodeURIComponent(acceptanceCode)}`}
                    className="mt-4 inline-flex rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-black"
                  >
                    مشاهده وضعیت
                  </Link>
                </div>
              ) : null}
            </div>
          )}

          {submitError && (
            <div
              className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300"
              role="alert"
            >
              <p className="text-white">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <FormInput
              label="شماره تماس *"
              id="repair-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="09 / +98 / 98 / 9..."
              className="placeholder:text-end text-end"
              error={errors.phone?.message}
              suppressHydrationWarning
              {...phoneField}
              onChange={(e) => {
                e.target.value = sanitizePhoneInput(e.target.value);
                phoneField.onChange(e);
              }}
            />

            <FormInput
              label="نام ( اختیاری )"
              id="repair-name"
              type="text"
              autoComplete="name"
              placeholder="مثلاً علی محمدی"
              {...neonInputProps(register("name"))}
            />

            <FormSelect
              label="نوع مشکل ( اختیاری )"
              id="repair-problem-type"
              value={problemTypeId === "" ? "" : String(problemTypeId)}
              onChange={(e) => {
                const value = e.target.value;
                setProblemTypeId(value ? Number(value) : "");
              }}
              disabled={deviceTypeId === "" || problemTypesLoading}
            >
              <option value="">
                {deviceTypeId === ""
                  ? "ابتدا دستگاه را انتخاب کنید"
                  : problemTypesLoading
                    ? "در حال بارگذاری..."
                    : "نوع مشکل را انتخاب کنید"}
              </option>
              {problemTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </FormSelect>

            <FormTextarea
              label="توضیحات ( اختیاری )"
              id="repair-description"
              rows={5}
              placeholder="توضیحات مشکل..."
              className="resize-none placeholder:padding-4 padding-4"
              {...neonInputProps(register("description"))}
            />

            <ImageUploadField
              label="تصویر مشکل ( اختیاری — فعلاً ارسال نمی‌شود )"
              id="repair-image"
              preview={imagePreview}
              onChange={handleImageChange}
            />

            <button
              type="submit"
              disabled={loading || verifying}
              className={cn(
                "h-14 w-full rounded-2xl font-bold text-black transition-all disabled:opacity-40",
                theme.submit,
              )}
            >
              {loading || verifying ? "در حال ثبت..." : "ثبت درخواست تعمیر"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
