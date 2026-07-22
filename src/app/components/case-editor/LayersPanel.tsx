"use client";

import {
  ArrowDown,
  ArrowUp,
  Copy,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Sticker,
  Trash2,
  Type,
} from "lucide-react";

import { useEditorStore } from "@/lib/design/editor-store";
import { isLayerVisible, type DesignLayer } from "@/lib/design/types";

function layerLabel(layer: DesignLayer): string {
  if (layer.name) return layer.name;
  if (layer.type === "text") {
    const preview = layer.text.length > 20 ? `${layer.text.slice(0, 20)}…` : layer.text;
    return preview || "متن";
  }
  if (layer.isSticker) return "استیکر";
  return "تصویر";
}

function LayerTypeIcon({ layer }: { layer: DesignLayer }) {
  if (layer.type === "text") return <Type size={14} className="shrink-0" />;
  if (layer.isSticker) return <Sticker size={14} className="shrink-0" />;
  return <ImageIcon size={14} className="shrink-0" />;
}

export default function LayersPanel() {
  const layers = useEditorStore((s) => s.document.layers);
  const selectedLayerId = useEditorStore((s) => s.selectedLayerId);
  const selectLayer = useEditorStore((s) => s.selectLayer);
  const setLayerVisible = useEditorStore((s) => s.setLayerVisible);
  const restoreLayer = useEditorStore((s) => s.restoreLayer);
  const moveLayer = useEditorStore((s) => s.moveLayer);
  const duplicateLayer = useEditorStore((s) => s.duplicateLayer);

  const layersReversed = [...layers].reverse();
  const selected = selectedLayerId
    ? layers.find((l) => l.id === selectedLayerId)
    : null;

  if (layers.length === 0) {
    return (
      <p className="text-center text-xs text-muted">
        هنوز لایه‌ای اضافه نشده. از تب متن، استیکر یا تصویر استفاده کنید.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted">بالا = جلوتر روی قاب</p>
      <ul className="space-y-1">
        {layersReversed.map((layer) => {
          const visible = isLayerVisible(layer);
          const isSelected = selectedLayerId === layer.id;
          return (
            <li
              key={layer.id}
              className={`flex items-center gap-2 rounded-lg border px-2 py-2 text-xs transition ${
                isSelected
                  ? "border-cyan-500/50 bg-cyan-500/10 text-foreground"
                  : visible
                    ? "border-border bg-card/60 text-muted hover:border-cyan-500/30"
                    : "border-border/50 bg-card/30 text-muted/50"
              }`}
            >
              <button
                type="button"
                onClick={() => (visible ? selectLayer(layer.id) : restoreLayer(layer.id))}
                className="flex min-w-0 flex-1 items-center gap-2 text-right"
              >
                <LayerTypeIcon layer={layer} />
                <span className="truncate">{layerLabel(layer)}</span>
              </button>
              <button
                type="button"
                onClick={() => setLayerVisible(layer.id, !visible)}
                className="shrink-0 p-1 text-muted hover:text-foreground"
                title={visible ? "مخفی کردن" : "نمایش"}
              >
                {visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              {!visible ? (
                <button
                  type="button"
                  onClick={() => restoreLayer(layer.id)}
                  className="shrink-0 rounded px-1.5 py-0.5 text-[10px] text-cyan-400"
                >
                  نمایش
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setLayerVisible(layer.id, false)}
                  className="shrink-0 p-1 text-red-400/70 hover:text-red-400"
                  title="حذف از قاب"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {selected ? (
        <div className="space-y-2 rounded-xl border border-border bg-card/60 p-3">
          <p className="text-xs font-semibold text-muted">لایه انتخاب‌شده</p>
          <div className="flex flex-wrap gap-2">
            <ActionButton
              onClick={() => moveLayer(selected.id, "up")}
              icon={<ArrowUp size={14} />}
              label="جلو"
            />
            <ActionButton
              onClick={() => moveLayer(selected.id, "down")}
              icon={<ArrowDown size={14} />}
              label="عقب"
            />
            <ActionButton
              onClick={() => duplicateLayer(selected.id)}
              icon={<Copy size={14} />}
              label="کپی"
            />
            {isLayerVisible(selected) ? (
              <ActionButton
                onClick={() => setLayerVisible(selected.id, false)}
                icon={<Trash2 size={14} />}
                label="حذف"
                danger
              />
            ) : (
              <ActionButton
                onClick={() => restoreLayer(selected.id)}
                icon={<Eye size={14} />}
                label="بازیابی"
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ActionButton({
  onClick,
  icon,
  label,
  danger,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 text-[10px] ${
        danger
          ? "border-red-500/30 text-red-400"
          : "border-border text-muted hover:border-cyan-500/30"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
