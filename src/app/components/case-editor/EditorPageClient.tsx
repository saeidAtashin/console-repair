"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Undo2,
  Redo2,
  Eye,
  Save,
  Share2,
  Download,
  ShoppingCart,
  Type,
  Sticker,
  Upload,
  FileText,
} from "lucide-react";
import type Konva from "konva";

import WizardBreadcrumb from "@/app/components/case-wizard/WizardBreadcrumb";
import TextPanel from "@/app/components/case-editor/TextPanel";
import StickerPanel from "@/app/components/case-editor/StickerPanel";
import UploadPanel from "@/app/components/case-editor/UploadPanel";
import DescriptionPanel from "@/app/components/case-editor/DescriptionPanel";
import PreviewModal from "@/app/components/case-editor/PreviewModal";
import { useAuth } from "@/app/context/AuthContext";
import { useShopCart } from "@/app/context/ShopCartContext";
import {
  getBrandBySlug,
  getCaseTypeBySlug,
  getCaseTotalPrice,
  getModelBySlug,
  getStickerPacks,
} from "@/lib/cases";
import type { CaseType } from "@/lib/cases/types";
import { useEditorStore } from "@/lib/design/editor-store";
import { saveDesign } from "@/lib/design/api";
import { exportAndDownload } from "@/lib/design/export";
import { formatToman } from "@/lib/shop/format";

const CaseCanvas = dynamic(() => import("@/app/components/case-editor/CaseCanvas"), {
  ssr: false,
});

type Tab = "text" | "stickers" | "upload" | "description";

type Props = {
  brandSlug: string;
  modelSlug: string;
  caseTypeSlug: string;
};

export default function EditorPageClient({ brandSlug, modelSlug, caseTypeSlug }: Props) {
  const brand = getBrandBySlug(brandSlug)!;
  const model = getModelBySlug(brandSlug, modelSlug)!;
  const caseType = getCaseTypeBySlug(caseTypeSlug)!;
  const stickerPacks = getStickerPacks();

  const { user } = useAuth();
  const { addCustomCase } = useShopCart();
  const stageRef = useRef<Konva.Stage | null>(null);

  const {
    init,
    document,
    undo,
    redo,
    canUndo,
    canRedo,
    setPreviewMode,
    previewMode,
  } = useEditorStore();

  const [activeTab, setActiveTab] = useState<Tab>("text");
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    init({
      brandSlug,
      modelSlug,
      caseTypeSlug,
      caseType,
      canvasWidth: model.canvasWidth,
      canvasHeight: model.canvasHeight,
    });
  }, [brandSlug, modelSlug, caseTypeSlug, caseType, model, init]);

  const handleSave = useCallback(async () => {
    if (!user) {
      setMessage("برای ذخیره طراحی ابتدا وارد شوید.");
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const saved = await saveDesign(document);
      setShareUrl(`${window.location.origin}/share/${saved.shareToken}`);
      setMessage("طراحی ذخیره شد.");
    } catch {
      setMessage("خطا در ذخیره طراحی.");
    } finally {
      setSaving(false);
    }
  }, [user, document]);

  const handleShare = useCallback(async () => {
    const saved = await saveDesign(document);
    const url = `${window.location.origin}/share/${saved.shareToken}`;
    setShareUrl(url);
    try {
      await navigator.clipboard.writeText(url);
      setMessage("لینک اشتراک‌گذاری کپی شد.");
    } catch {
      setMessage(url);
    }
  }, [document]);

  const handleDownload = useCallback(async () => {
    if (!stageRef.current) return;
    await exportAndDownload(
      stageRef.current,
      `case-${brandSlug}-${modelSlug}.png`,
    );
  }, [brandSlug, modelSlug]);

  const handleBuy = useCallback(async () => {
    const saved = await saveDesign(document);
    let previewUrl = saved.previewUrl ?? "";
    if (stageRef.current && !previewUrl) {
      previewUrl = stageRef.current.toDataURL({ pixelRatio: 2 });
    }
    const price = getCaseTotalPrice(caseType, true);
    addCustomCase({
      designId: saved.id,
      previewUrl,
      unitPrice: price,
      title: document.name || `قاب ${model.name}`,
      brandSlug,
      modelSlug,
      caseTypeSlug,
      description: document.description,
    });
    setMessage("به سبد خرید اضافه شد.");
  }, [document, caseType, model, addCustomCase, brandSlug, modelSlug, caseTypeSlug]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "text", label: "متن", icon: <Type size={16} /> },
    { id: "stickers", label: "استیکر", icon: <Sticker size={16} /> },
    { id: "upload", label: "تصویر", icon: <Upload size={16} /> },
    { id: "description", label: "توضیحات", icon: <FileText size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-black pt-20 pb-24 lg:pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <WizardBreadcrumb
          crumbs={[
            { label: "برند", href: "/create" },
            { label: brand.name, href: `/create/${brandSlug}` },
            { label: model.name, href: `/create/${brandSlug}/${modelSlug}` },
            { label: caseType.name },
            { label: "طراحی" },
          ]}
        />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <ToolbarButton onClick={undo} disabled={!canUndo()} icon={<Undo2 size={16} />} label="بازگشت" />
          <ToolbarButton onClick={redo} disabled={!canRedo()} icon={<Redo2 size={16} />} label="جلو" />
          <ToolbarButton
            onClick={() => {
              setPreviewMode(true);
              setShowPreview(true);
            }}
            icon={<Eye size={16} />}
            label="پیش‌نمایش"
          />
          <ToolbarButton onClick={handleSave} disabled={saving} icon={<Save size={16} />} label="ذخیره" />
          <ToolbarButton onClick={handleShare} icon={<Share2 size={16} />} label="اشتراک" />
          <ToolbarButton onClick={handleDownload} icon={<Download size={16} />} label="دانلود" />
          <button
            type="button"
            onClick={handleBuy}
            className="mr-auto flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-bold text-black transition hover:bg-cyan-400"
          >
            <ShoppingCart size={16} />
            خرید — {formatToman(getCaseTotalPrice(caseType, true))}
          </button>
        </div>

        {message ? (
          <p className="mt-3 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
            {message}
          </p>
        ) : null}
        {shareUrl ? (
          <p className="mt-2 truncate text-xs text-zinc-500">{shareUrl}</p>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/30 p-4 lg:p-8">
            <CaseCanvas
              caseColor={caseType.color}
              caseMaterial={caseType.material}
              onStageRef={(stage) => {
                stageRef.current = stage;
              }}
            />
          </div>

          <div className="hidden lg:block">
            <EditorSidePanel
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              stickerPacks={stickerPacks}
            />
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-zinc-950/95 backdrop-blur-xl lg:hidden">
        <div className="flex border-b border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs ${
                activeTab === tab.id ? "text-cyan-400" : "text-zinc-500"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        <div className="max-h-48 overflow-y-auto p-4">
          <EditorSidePanel
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            stickerPacks={stickerPacks}
            compact
          />
        </div>
      </div>

      {showPreview ? (
        <PreviewModal
          caseColor={caseType.color}
          caseMaterial={caseType.material}
          onClose={() => {
            setShowPreview(false);
            setPreviewMode(false);
          }}
        />
      ) : null}
    </div>
  );
}

function ToolbarButton({
  onClick,
  disabled,
  icon,
  label,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300 transition hover:border-cyan-500/50 disabled:opacity-40"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function EditorSidePanel({
  activeTab,
  onTabChange,
  stickerPacks,
  compact,
}: {
  tabs: { id: Tab; label: string; icon: React.ReactNode }[];
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  stickerPacks: ReturnType<typeof getStickerPacks>;
  compact?: boolean;
}) {
  const tabLabels: { id: Tab; label: string }[] = [
    { id: "text", label: "متن" },
    { id: "stickers", label: "استیکر" },
    { id: "upload", label: "تصویر" },
    { id: "description", label: "توضیحات" },
  ];

  return (
    <div className={compact ? "" : "rounded-2xl border border-white/10 bg-zinc-900/60 p-4"}>
      {!compact ? (
        <div className="mb-4 flex gap-1 border-b border-white/5 pb-3">
          {tabLabels.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs transition ${
                activeTab === tab.id ? "bg-cyan-500/20 text-cyan-400" : "text-zinc-500 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : null}
      {activeTab === "text" ? <TextPanel /> : null}
      {activeTab === "stickers" ? <StickerPanel packs={stickerPacks} /> : null}
      {activeTab === "upload" ? <UploadPanel /> : null}
      {activeTab === "description" ? <DescriptionPanel /> : null}
    </div>
  );
}
