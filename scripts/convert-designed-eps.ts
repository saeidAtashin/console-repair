import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join } from "node:path";

const ROOT = process.cwd();
const DESIGNED_DIR = join(ROOT, "public", "designed");
const META_PATH = join(DESIGNED_DIR, "designed.meta.json");
const MANIFEST_PATH = join(DESIGNED_DIR, "designed.manifest.json");
const TEMPLATES_OUT = join(ROOT, "src", "lib", "cases", "designed.templates.generated.ts");
const STICKERS_OUT = join(ROOT, "src", "lib", "cases", "designed.stickers.generated.ts");

const REF_CANVAS = { width: 280, height: 560 } as const;
const SVG_SIZE_LIMIT_BYTES = 2 * 1024 * 1024;
const DEFAULT_STICKER_SIZE = 240;
const MAX_EXPORT_EDGE = 2048;

type DesignedMetaEntry = {
  title?: string;
  description?: string;
  tags?: string[];
  stickerSize?: number;
};

type DesignedMeta = Record<string, DesignedMetaEntry>;

type ManifestEntry = {
  slug: string;
  sourceEps: string;
  outputFormat: "svg" | "png" | "jpg";
  outputPath: string;
  width: number;
  height: number;
  convertedAt: string;
  conversionMethod: "inkscape-svg" | "inkscape-png" | "imagemagick" | "xmp-preview";
};

type ToolPaths = {
  inkscape?: string;
  magick?: string;
  ghostscriptBin?: string;
};

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function getArg(name: string): string | undefined {
  const prefix = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(prefix));
  return arg?.slice(prefix.length);
}

function slugFromFilename(filename: string): string {
  return basename(filename, ".eps");
}

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function readMeta(): DesignedMeta {
  if (!existsSync(META_PATH)) return {};
  try {
    return JSON.parse(readFileSync(META_PATH, "utf8")) as DesignedMeta;
  } catch {
    console.warn(`Warning: could not parse ${META_PATH}, using defaults.`);
    return {};
  }
}

function findExecutable(
  customPath: string | undefined,
  defaults: string[],
  commandName: string,
): string | undefined {
  const candidates = [customPath, ...defaults].filter(Boolean) as string[];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  try {
    execFileSync(process.platform === "win32" ? "where" : "which", [commandName], {
      stdio: "pipe",
    });
    return commandName;
  } catch {
    return undefined;
  }
}

function resolveTools(): ToolPaths {
  const inkscape = findExecutable(
    getArg("inkscape-path") ??
      (process.platform === "win32"
        ? "C:\\Program Files\\Inkscape\\bin\\inkscape.exe"
        : "inkscape"),
    process.platform === "win32"
      ? [
          "C:\\Program Files\\Inkscape\\bin\\inkscape.exe",
          "C:\\Program Files (x86)\\Inkscape\\bin\\inkscape.exe",
        ]
      : ["/usr/bin/inkscape", "/usr/local/bin/inkscape"],
    "inkscape",
  );

  const magick = findExecutable(
    getArg("magick-path"),
    process.platform === "win32"
      ? ["C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\magick.exe"]
      : ["/usr/bin/magick", "/usr/local/bin/magick"],
    "magick",
  );

  const ghostscript = findExecutable(
    getArg("ghostscript-path"),
    process.platform === "win32"
      ? (() => {
          const found: string[] = [];
          const scoopPath = join(
            process.env.USERPROFILE ?? "",
            "scoop",
            "apps",
            "ghostscript",
            "current",
            "bin",
            "gswin64c.exe",
          );
          if (existsSync(scoopPath)) found.push(scoopPath);

          const roots = ["C:\\Program Files\\gs", "C:\\Program Files (x86)\\gs"];
          for (const root of roots) {
            if (!existsSync(root)) continue;
            for (const dir of readdirSync(root)) {
              const bin = join(root, dir, "bin", "gswin64c.exe");
              if (existsSync(bin)) found.push(bin);
            }
          }
          return found;
        })()
      : ["/usr/bin/gs", "/usr/local/bin/gs"],
    process.platform === "win32" ? "gswin64c" : "gs",
  );

  return {
    inkscape,
    magick,
    ghostscriptBin: ghostscript ? dirname(ghostscript) : undefined,
  };
}

function runWithPath(
  command: string,
  args: string[],
  extraPath?: string,
): { ok: boolean; error?: string } {
  const env = { ...process.env };
  if (extraPath) {
    env.PATH = `${extraPath}${process.platform === "win32" ? ";" : ":"}${env.PATH ?? ""}`;
  }

  const result = spawnSync(command, args, { stdio: "pipe", env, encoding: "utf8" });
  if (result.status === 0) return { ok: true };
  return {
    ok: false,
    error: [result.stderr, result.stdout].filter(Boolean).join("\n").trim(),
  };
}

function parseEpsBoundingBox(epsPath: string): { width: number; height: number } | null {
  const head = readFileSync(epsPath, "utf8").slice(0, 4096);
  const match = head.match(/%%BoundingBox:\s*(-?\d+)\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)/);
  if (!match) return null;
  const width = Number(match[3]) - Number(match[1]);
  const height = Number(match[4]) - Number(match[2]);
  if (width <= 0 || height <= 0) return null;
  return { width, height };
}

function computeExportSize(
  bbox: { width: number; height: number } | null,
): { width: number; height: number } {
  if (!bbox) {
    return { width: MAX_EXPORT_EDGE, height: MAX_EXPORT_EDGE };
  }

  const longest = Math.max(bbox.width, bbox.height);
  if (longest <= MAX_EXPORT_EDGE) {
    return { width: Math.round(bbox.width), height: Math.round(bbox.height) };
  }

  const scale = MAX_EXPORT_EDGE / longest;
  return {
    width: Math.round(bbox.width * scale),
    height: Math.round(bbox.height * scale),
  };
}

function parseSvgDimensions(svgPath: string): { width: number; height: number } {
  const content = readFileSync(svgPath, "utf8");
  const viewBoxMatch = content.match(/viewBox=["']([^"']+)["']/i);
  if (viewBoxMatch) {
    const parts = viewBoxMatch[1].trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
      return { width: parts[2], height: parts[3] };
    }
  }

  const widthMatch = content.match(/\bwidth=["']([\d.]+)/i);
  const heightMatch = content.match(/\bheight=["']([\d.]+)/i);
  if (widthMatch && heightMatch) {
    return { width: Number(widthMatch[1]), height: Number(heightMatch[1]) };
  }

  return { width: REF_CANVAS.width, height: REF_CANVAS.height };
}

function parsePngDimensions(pngPath: string): { width: number; height: number } {
  const buf = readFileSync(pngPath);
  if (buf.length >= 24 && buf[0] === 0x89 && buf[1] === 0x50) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  return { width: REF_CANVAS.width, height: REF_CANVAS.height };
}

function parseJpegDimensions(jpegPath: string): { width: number; height: number } {
  const buf = readFileSync(jpegPath);
  let offset = 2;
  while (offset < buf.length) {
    if (buf[offset] !== 0xff) break;
    const marker = buf[offset + 1];
    const length = buf.readUInt16BE(offset + 2);
    if (marker === 0xc0 || marker === 0xc2) {
      return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  return { width: REF_CANVAS.width, height: REF_CANVAS.height };
}

function extractXmpPreview(
  epsPath: string,
  slug: string,
): { outputPath: string; dimensions: { width: number; height: number } } | null {
  const content = readFileSync(epsPath, "utf8");
  const imageMatch = content.match(/<xmpGImg:image>([\s\S]*?)<\/xmpGImg:image>/);
  const formatMatch = content.match(/<xmpGImg:format>([\s\S]*?)<\/xmpGImg:format>/);
  if (!imageMatch) return null;

  const format = formatMatch?.[1]?.trim().toUpperCase() ?? "JPEG";
  const encoded = imageMatch[1]
    .replace(/&#xA;/g, "")
    .replace(/\s+/g, "")
    .trim();
  const binary = Buffer.from(encoded, "base64");

  const ext = format === "JPEG" || format === "JPG" ? ".jpg" : ".png";
  const outputPath = join(DESIGNED_DIR, `${slug}${ext}`);
  writeFileSync(outputPath, binary);

  const dimensions =
    ext === ".jpg" ? parseJpegDimensions(outputPath) : parsePngDimensions(outputPath);
  return { outputPath, dimensions };
}

function tryInkscapeExport(
  tools: ToolPaths,
  inputPath: string,
  outputPath: string,
  type: "svg" | "png",
  exportSize: { width: number; height: number },
): boolean {
  if (!tools.inkscape) return false;

  const args =
    type === "svg"
      ? [inputPath, "--export-type=svg", `--export-filename=${outputPath}`]
      : [
          inputPath,
          "--export-type=png",
          `--export-filename=${outputPath}`,
          `--export-width=${exportSize.width}`,
          `--export-height=${exportSize.height}`,
        ];

  const result = runWithPath(tools.inkscape, args, tools.ghostscriptBin);
  return result.ok && existsSync(outputPath);
}

function tryMagickExport(
  tools: ToolPaths,
  inputPath: string,
  outputPath: string,
  exportSize: { width: number; height: number },
): boolean {
  if (!tools.magick) return false;

  const result = runWithPath(
    tools.magick,
    [
      "-density",
      "300",
      inputPath,
      "-background",
      "none",
      "-resize",
      `${exportSize.width}x${exportSize.height}`,
      outputPath,
    ],
    tools.ghostscriptBin,
  );
  return result.ok && existsSync(outputPath);
}

function convertEpsFile(
  tools: ToolPaths,
  inputPath: string,
  slug: string,
): {
  outputFormat: "svg" | "png" | "jpg";
  outputPath: string;
  dimensions: { width: number; height: number };
  conversionMethod: ManifestEntry["conversionMethod"];
} {
  const svgPath = join(DESIGNED_DIR, `${slug}.svg`);
  const pngPath = join(DESIGNED_DIR, `${slug}.png`);
  const bbox = parseEpsBoundingBox(inputPath);
  const exportSize = computeExportSize(bbox);

  if (tryInkscapeExport(tools, inputPath, svgPath, "svg", exportSize)) {
    const svgSize = statSync(svgPath).size;
    if (svgSize <= SVG_SIZE_LIMIT_BYTES) {
      return {
        outputFormat: "svg",
        outputPath: svgPath,
        dimensions: parseSvgDimensions(svgPath),
        conversionMethod: "inkscape-svg",
      };
    }
    console.log(
      `  SVG is ${(svgSize / 1024 / 1024).toFixed(1)} MB — trying PNG export instead.`,
    );
  } else {
    console.log("  Inkscape SVG export unavailable or failed.");
  }

  if (tryInkscapeExport(tools, inputPath, pngPath, "png", exportSize)) {
    return {
      outputFormat: "png",
      outputPath: pngPath,
      dimensions: parsePngDimensions(pngPath),
      conversionMethod: "inkscape-png",
    };
  }

  if (tryMagickExport(tools, inputPath, pngPath, exportSize)) {
    return {
      outputFormat: "png",
      outputPath: pngPath,
      dimensions: parsePngDimensions(pngPath),
      conversionMethod: "imagemagick",
    };
  }

  if (!hasFlag("allow-preview-fallback")) {
    throw new Error(
      `Could not convert ${basename(inputPath)} at full quality. Ghostscript is required for EPS.\n` +
        `Run: npm run setup:ghostscript && npm run convert:designed\n` +
        `Or pass --allow-preview-fallback to use low-quality embedded previews (not recommended).`,
    );
  }

  console.warn(
    "  LOW QUALITY: using embedded XMP preview — install Ghostscript for full export.",
  );
  const preview = extractXmpPreview(inputPath, slug);
  if (!preview) {
    throw new Error(
      `Could not convert ${basename(inputPath)}. Install Ghostscript (https://ghostscript.com) or run npm run setup:ghostscript.`,
    );
  }

  return {
    outputFormat: preview.outputPath.endsWith(".jpg") ? "jpg" : "png",
    outputPath: preview.outputPath,
    dimensions: preview.dimensions,
    conversionMethod: "xmp-preview",
  };
}

function coverLayerPlacement(
  assetWidth: number,
  assetHeight: number,
): { x: number; y: number; width: number; height: number } {
  const scaleX = REF_CANVAS.width / assetWidth;
  const scaleY = REF_CANVAS.height / assetHeight;
  const uniform = Math.max(scaleX, scaleY);
  const width = assetWidth * uniform;
  const height = assetHeight * uniform;
  return {
    x: (REF_CANVAS.width - width) / 2,
    y: (REF_CANVAS.height - height) / 2,
    width,
    height,
  };
}

function stickerDimensions(
  assetWidth: number,
  assetHeight: number,
  stickerSize: number,
): { width: number; height: number } {
  const aspect = assetWidth / assetHeight;
  if (aspect >= 1) {
    return { width: stickerSize, height: Math.round(stickerSize / aspect) };
  }
  return { width: Math.round(stickerSize * aspect), height: stickerSize };
}

function escapeString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function writeGeneratedFiles(entries: ManifestEntry[], meta: DesignedMeta): void {
  const templates = entries.map((entry) => {
    const metaEntry = meta[entry.slug] ?? {};
    const title = metaEntry.title ?? titleFromSlug(entry.slug);
    const description =
      metaEntry.description ?? `طرح آماده ${title} — مناسب کاور گوشی`;
    const tags = metaEntry.tags ?? ["طراحی آماده"];
    const placement = coverLayerPlacement(entry.width, entry.height);
    const publicSrc = `/${entry.outputPath.replace(/\\/g, "/").replace(/^public\//, "")}`;

    return {
      id: `designed-${entry.slug}`,
      slug: entry.slug,
      title,
      description,
      thumbnail: publicSrc,
      tags,
      publicSrc,
      placement,
    };
  });

  const templateTs = `// AUTO-GENERATED by scripts/convert-designed-eps.ts — do not edit manually.
import { DEFAULT_REFERENCE_CANVAS, type CaseTemplate } from "@/lib/design/types";

export const DESIGNED_TEMPLATES: CaseTemplate[] = [
${templates
  .map(
    (t) => `  {
    id: "${escapeString(t.id)}",
    slug: "${escapeString(t.slug)}",
    title: "${escapeString(t.title)}",
    description: "${escapeString(t.description)}",
    thumbnail: "${escapeString(t.thumbnail)}",
    tags: [${t.tags.map((tag) => `"${escapeString(tag)}"`).join(", ")}],
    referenceCanvas: DEFAULT_REFERENCE_CANVAS,
    layers: [
      {
        id: "designed-layer-${escapeString(t.slug)}",
        type: "image",
        src: "${escapeString(t.publicSrc)}",
        width: ${t.placement.width},
        height: ${t.placement.height},
        isSticker: false,
        name: "${escapeString(t.title)}",
        visible: true,
        x: ${t.placement.x},
        y: ${t.placement.y},
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
    ],
  }`,
  )
  .join(",\n")}
];
`;

  const stickerItems = entries.map((entry) => {
    const metaEntry = meta[entry.slug] ?? {};
    const title = metaEntry.title ?? titleFromSlug(entry.slug);
    const stickerSize = metaEntry.stickerSize ?? DEFAULT_STICKER_SIZE;
    const dims = stickerDimensions(entry.width, entry.height, stickerSize);
    const publicSrc = `/${entry.outputPath.replace(/\\/g, "/").replace(/^public\//, "")}`;

    return {
      id: `designed-${entry.slug}`,
      name: title,
      src: publicSrc,
      width: dims.width,
      height: dims.height,
    };
  });

  const stickersTs = `// AUTO-GENERATED by scripts/convert-designed-eps.ts — do not edit manually.
import type { StickerPack } from "./types";

export const DESIGNED_STICKER_PACK: StickerPack = {
  id: "designed",
  category: "طراحی آماده",
  name: "طراحی‌های آماده",
  stickers: [
${stickerItems
  .map(
    (s) => `    {
      id: "${escapeString(s.id)}",
      name: "${escapeString(s.name)}",
      src: "${escapeString(s.src)}",
      width: ${s.width},
      height: ${s.height},
    }`,
  )
  .join(",\n")}
  ],
};
`;

  writeFileSync(TEMPLATES_OUT, templateTs, "utf8");
  writeFileSync(STICKERS_OUT, stickersTs, "utf8");
}

function writeEmptyGeneratedFiles(): void {
  writeFileSync(
    TEMPLATES_OUT,
    `// AUTO-GENERATED by scripts/convert-designed-eps.ts — do not edit manually.
import type { CaseTemplate } from "@/lib/design/types";

export const DESIGNED_TEMPLATES: CaseTemplate[] = [];
`,
    "utf8",
  );

  writeFileSync(
    STICKERS_OUT,
    `// AUTO-GENERATED by scripts/convert-designed-eps.ts — do not edit manually.
import type { StickerPack } from "./types";

export const DESIGNED_STICKER_PACK: StickerPack = {
  id: "designed",
  category: "طراحی آماده",
  name: "طراحی‌های آماده",
  stickers: [],
};
`,
    "utf8",
  );
}

function main(): void {
  const tools = resolveTools();
  const meta = readMeta();

  const epsFiles = readdirSync(DESIGNED_DIR)
    .filter((name) => name.toLowerCase().endsWith(".eps"))
    .sort();

  if (epsFiles.length === 0) {
    console.log("No .eps files found in public/designed/. Writing empty catalogs.");
    writeEmptyGeneratedFiles();
    writeFileSync(MANIFEST_PATH, JSON.stringify({ entries: [] }, null, 2), "utf8");
    return;
  }

  console.log("Conversion tools:");
  console.log(`  Inkscape: ${tools.inkscape ?? "not found"}`);
  console.log(`  ImageMagick: ${tools.magick ?? "not found"}`);
  console.log(`  Ghostscript: ${tools.ghostscriptBin ?? "not found"}`);

  const manifest: ManifestEntry[] = [];

  for (const epsFile of epsFiles) {
    const slug = slugFromFilename(epsFile);
    const inputPath = join(DESIGNED_DIR, epsFile);

    console.log(`\nConverting ${epsFile}...`);
    const converted = convertEpsFile(tools, inputPath, slug);

    manifest.push({
      slug,
      sourceEps: epsFile,
      outputFormat: converted.outputFormat,
      outputPath: `designed/${basename(converted.outputPath)}`,
      width: converted.dimensions.width,
      height: converted.dimensions.height,
      convertedAt: new Date().toISOString(),
      conversionMethod: converted.conversionMethod,
    });

    console.log(
      `  → ${basename(converted.outputPath)} (${converted.dimensions.width}×${converted.dimensions.height}, ${converted.outputFormat}, ${converted.conversionMethod})`,
    );
  }

  writeFileSync(MANIFEST_PATH, JSON.stringify({ entries: manifest }, null, 2), "utf8");
  writeGeneratedFiles(
    manifest.map((entry) => ({
      ...entry,
      outputPath: join("public", entry.outputPath),
    })),
    meta,
  );

  console.log(`\nWrote ${manifest.length} design(s) to:`);
  console.log(`  ${TEMPLATES_OUT}`);
  console.log(`  ${STICKERS_OUT}`);
  console.log(`  ${MANIFEST_PATH}`);
}

main();
