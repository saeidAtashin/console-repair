"use client";

import DesignSampleGrid from "@/app/components/designs/DesignSampleGrid";
import type { CaseTemplate } from "@/lib/design/types";

type Props = {
  templates: CaseTemplate[];
};

export default function DesignsGalleryClient({ templates }: Props) {
  return <DesignSampleGrid templates={templates} linkMode />;
}
