"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  Layers,
  LayoutTemplate,
  Sparkles,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import type Konva from "konva";

import WizardBreadcrumb from "@/app/components/case-wizard/WizardBreadcrumb";
import TextPanel from "@/app/components/case-editor/TextPanel";
import StickerPanel from "@/app/components/case-editor/StickerPanel";
import UploadPanel from "@/app/components/case-editor/UploadPanel";
import DescriptionPanel from "@/app/components/case-editor/DescriptionPanel";
import LayersPanel from "@/app/components/case-editor/LayersPanel";
import TemplatesPanel from "@/app/components/case-editor/TemplatesPanel";
import DesignForYouPanel from "@/app/components/case-editor/DesignForYouPanel";
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
import { getCaseTemplateBySlug } from "@/lib/cases/templates.static";
import { getReadyCaseBySlug } from "@/lib/cases/ready.static";
import type { CaseType } from "@/lib/cases/types";
import { getDesign, getDesignByShareToken } from "@/lib/design/api";
import { useEditorStore } from "@/lib/design/editor-store";
import { saveDesign } from "@/lib/design/api";
import { exportAndDownload, exportStageToPng } from "@/lib/design/export";
import {
  SHORTCUT_HELP,
  useEditorShortcuts,
} from "@/lib/design/use-editor-shortcuts";
import { loadEditorFonts } from "@/lib/design/editor-fonts";
import { formatToman } from "@/lib/shop/format";

const CaseCanvas = dynamic(() => import("@/app/components/case-editor/CaseCanvas"), {
  ssr: false,
});

export type EditorTab =
  | "layers"
  | "text"
  | "stickers"
  | "upload"
  | "templates"
  | "design-for-you"
  | "description";

type Props = {
  brandSlug: string;
  modelSlug: string;
  caseTypeSlug: string;
  initialDesignId?: string;
  initialShareToken?: string;
  initialTemplateSlug?: string;
  initialTab?: EditorTab;
};

export default function EditorPageClient({
  brandSlug,
  modelSlug,
  caseTypeSlug,
  initialDesignId,
  initialShareToken,
  initialTemplateSlug,
  initialTab,
}: Props) {
  const brand = getBrandBySlug(brandSlug)!;
  const model = getModelBySlug(brandSlug, modelSlug)!;
  const caseType = getCaseTypeBySlug(caseTypeSlug)!;
  const stickerPacks = getStickerPacks();

  const { user } = useAuth();
  const { addCustomCase } = useShopCart();
  const stageRef = useRef<Konva.Stage | null>(null);
  const loadedRef = useRef(false);

  const {
    init,
    loadDocument,
    loadTemplate,
    document,
    undo,
    redo,
    canUndo,
    canRedo,
    setPreviewMode,
  } = useEditorStore();

  useEditorShortcuts();

  useEffect(() => {
    void loadEditorFonts();
  }, []);

  const [activeTab, setActiveTab] = useState<EditorTab>(initialTab ?? "text");
  const [showPreview, setShowPreview] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (loadedRef.current) return;

    async function bootstrap() {
      const meta = {
        brandSlug,
        modelSlug,
        caseTypeSlug,
        caseType,
        model,
        canvasWidth: model.canvasWidth,
        canvasHeight: model.canvasHeight,
      };

      if (initialDesignId) {
        const saved = await getDesign(initialDesignId);
        if (saved) {
          loadDocument(saved, meta);
          loadedRef.current = true;
          return;
        }
      }
      if (initialShareToken) {
        const shared = await getDesignByShareToken(initialShareToken);
        if (shared) {
          loadDocument(shared, meta);
          loadedRef.current = true;
          return;
        }
      }
      init(meta);
      loadedRef.current = true;

      if (initialTemplateSlug) {
        const template = getCaseTemplateBySlug(initialTemplateSlug);
        if (template) {
          loadTemplate(template, true);
        } else {
          const readyCase = getReadyCaseBySlug(initialTemplateSlug);
          if (readyCase?.template) {
            loadTemplate(
              {
                id: readyCase.id,
                slug: readyCase.slug,
                title: readyCase.title,
                description: readyCase.description,
                thumbnail: readyCase.image,
                tags: readyCase.tags,
                referenceCanvas: {
                  width: model.canvasWidth,
                  height: model.canvasHeight,
                },
                layers: readyCase.template.layers,
              },
              true,
            );
          }
        }
      }
    }

    void bootstrap();
  }, [
    brandSlug,
    modelSlug,
    caseTypeSlug,
    initialDesignId,
    initialShareToken,
    initialTemplateSlug,
    init,
    loadDocument,
    loadTemplate,
    caseType,
    model,
  ]);

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
      previewUrl = await exportStageToPng(stageRef.current, 2);
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

  const tabs: { id: EditorTab; label: string; icon: React.ReactNode }[] = [
    { id: "layers", label: "لایه‌ها", icon: <Layers size={16} /> },
    { id: "text", label: "متن", icon: <Type size={16} /> },
    { id: "stickers", label: "استیکر", icon: <Sticker size={16} /> },
    { id: "upload", label: "تصویر", icon: <Upload size={16} /> },
    { id: "templates", label: "قالب", icon: <LayoutTemplate size={16} /> },
    { id: "design-for-you", label: "طراحی برای شما", icon: <Sparkles size={16} /> },
    { id: "description", label: "توضیحات", icon: <FileText size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-24 lg:pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <WizardBreadcrumb
          crumbs={[
            { label: "برند", href: "/create" },
            { label: brand.name, href: `/create/${brandSlug}` },
            { label: model.name, href: `/phones/${brandSlug}/${modelSlug}` },
            { label: caseType.name },
            { label: "طراحی" },
          ]}
        />

        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
          <p className="text-sm leading-relaxed text-amber-100/90">
            تفاوت طراحی و قاب اصلی را چشم‌پوشی کنید. قبل از طراحی و ارسال، هماهنگی
            بابت تایید طراحی با شما انجام خواهد شد.
          </p>
        </div>

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
          <div className="relative">
            <ToolbarButton
              onClick={() => setShowShortcuts((v) => !v)}
              icon={<HelpCircle size={16} />}
              label="?"
            />
            {showShortcuts ? (
              <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-border bg-card p-3 shadow-xl">
                <p className="mb-2 text-xs font-bold text-foreground">میانبرهای صفحه‌کلید</p>
                <ul className="space-y-1">
                  {SHORTCUT_HELP.map((item) => (
                    <li key={item.keys} className="flex justify-between gap-2 text-[10px]">
                      <span className="text-muted">{item.action}</span>
                      <kbd className="shrink-0 rounded bg-background px-1.5 py-0.5 font-mono text-foreground">
                        {item.keys}
                      </kbd>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
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
          <p className="mt-2 truncate text-xs text-muted">{shareUrl}</p>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex items-center justify-center rounded-2xl border border-border bg-card/30 p-4 lg:p-8">
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
              brandSlug={brandSlug}
              modelSlug={modelSlug}
              caseTypeSlug={caseTypeSlug}
              modelName={model.name}
            />
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl lg:hidden">
        <div className="flex overflow-x-auto border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex min-w-[4.5rem] flex-1 flex-col items-center gap-1 py-3 text-[10px] ${
                activeTab === tab.id ? "text-cyan-400" : "text-muted"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        <div
          className={`overflow-y-auto p-4 ${
            activeTab === "stickers" ? "max-h-60" : "max-h-48"
          }`}
        >
          <EditorSidePanel
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            stickerPacks={stickerPacks}
            brandSlug={brandSlug}
            modelSlug={modelSlug}
            caseTypeSlug={caseTypeSlug}
            modelName={model.name}
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
      className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-muted transition hover:border-cyan-500/50 disabled:opacity-40"
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
  brandSlug,
  modelSlug,
  caseTypeSlug,
  modelName,
  compact,
}: {
  tabs: { id: EditorTab; label: string; icon: React.ReactNode }[];
  activeTab: EditorTab;
  onTabChange: (tab: EditorTab) => void;
  stickerPacks: ReturnType<typeof getStickerPacks>;
  brandSlug: string;
  modelSlug: string;
  caseTypeSlug: string;
  modelName: string;
  compact?: boolean;
}) {
  const tabLabels: { id: EditorTab; label: string }[] = [
    { id: "layers", label: "لایه‌ها" },
    { id: "text", label: "متن" },
    { id: "stickers", label: "استیکر" },
    { id: "upload", label: "تصویر" },
    { id: "templates", label: "قالب" },
    { id: "design-for-you", label: "طراحی برای شما" },
    { id: "description", label: "توضیحات" },
  ];

  return (
    <div
      className={
        compact
          ? "min-h-0"
          : "flex max-h-[min(560px,calc(100vh-280px))] min-h-0 flex-col rounded-2xl border border-border bg-card/60 p-4"
      }
    >
      {!compact ? (
        <div className="mb-4 flex shrink-0 flex-wrap gap-1 border-b border-border pb-3">
          {tabLabels.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`rounded-lg px-2 py-1.5 text-[10px] transition ${
                activeTab === tab.id ? "bg-cyan-500/20 text-cyan-400" : "text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : null}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      {activeTab === "layers" ? <LayersPanel /> : null}
      {activeTab === "text" ? <TextPanel /> : null}
      {activeTab === "stickers" ? <StickerPanel packs={stickerPacks} compact={compact} /> : null}
      {activeTab === "upload" ? <UploadPanel /> : null}
      {activeTab === "templates" ? (
        <TemplatesPanel
          brandSlug={brandSlug}
          modelSlug={modelSlug}
          caseTypeSlug={caseTypeSlug}
        />
      ) : null}
      {activeTab === "design-for-you" ? (
        <DesignForYouPanel
          brandSlug={brandSlug}
          modelSlug={modelSlug}
          caseTypeSlug={caseTypeSlug}
          modelName={modelName}
        />
      ) : null}
      {activeTab === "description" ? <DescriptionPanel /> : null}
      </div>
    </div>
  );
}
