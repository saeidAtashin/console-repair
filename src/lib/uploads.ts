import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "repair");
const PRODUCT_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

async function saveImage(file: File, dir: string, publicPrefix: string): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("INVALID_IMAGE_TYPE");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("IMAGE_TOO_LARGE");
  }

  await mkdir(dir, { recursive: true });

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  const filepath = path.join(dir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filepath, buffer);

  return `${publicPrefix}/${filename}`;
}

export async function saveRepairImage(file: File): Promise<string> {
  return saveImage(file, UPLOAD_DIR, "/uploads/repair");
}

export async function saveProductImage(file: File): Promise<string> {
  return saveImage(file, PRODUCT_UPLOAD_DIR, "/uploads/products");
}
