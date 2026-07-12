"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useEditorStore } from "@/lib/design/editor-store";
import CaseCanvas from "./CaseCanvas";

type Props = {
  caseColor: string;
  caseMaterial: string;
  onClose: () => void;
};

export default function PreviewModal({ caseColor, caseMaterial, onClose }: Props) {
  const { setPreviewMode } = useEditorStore();

  useEffect(() => {
    setPreviewMode(true);
    return () => setPreviewMode(false);
  }, [setPreviewMode]);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 p-4">
      <div className="relative w-full max-w-sm">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 left-0 rounded-lg p-2 text-zinc-400 hover:text-white"
          aria-label="بستن"
        >
          <X size={24} />
        </button>
        <CaseCanvas caseColor={caseColor} caseMaterial={caseMaterial} readOnly />
      </div>
    </div>
  );
}
