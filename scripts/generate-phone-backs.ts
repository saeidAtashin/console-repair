import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { APPLE_PHONE_MODELS } from "../src/lib/cases/apple/models";
import {
  generatePhoneBackSvgString,
  validateModelGeometry,
} from "../src/lib/cases/phone-back";

const outputDir = join(process.cwd(), "public", "cases", "models");

mkdirSync(outputDir, { recursive: true });

let errorCount = 0;

for (const model of APPLE_PHONE_MODELS) {
  const errors = validateModelGeometry(model);
  if (errors.length > 0) {
    console.error(`Validation failed for ${model.slug}:`);
    for (const error of errors) console.error(`  - ${error}`);
    errorCount += errors.length;
    continue;
  }

  const svg = generatePhoneBackSvgString(model);
  const filePath = join(outputDir, `${model.slug}.svg`);
  writeFileSync(filePath, svg, "utf8");
  console.log(`Generated ${filePath}`);
}

if (errorCount > 0) {
  console.error(`Finished with ${errorCount} validation error(s).`);
  process.exit(1);
}

console.log(`Successfully generated ${APPLE_PHONE_MODELS.length} Apple phone back SVGs.`);
