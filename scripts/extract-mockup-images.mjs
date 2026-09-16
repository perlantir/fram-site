import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const src = resolve(root, "..", "Full website mockup");
const out = resolve(root, "public", "images");

await mkdir(out, { recursive: true });

// Product page mockups are 1536x1024 landscape. The product photo occupies the
// right ~55% of the frame, top ~78%. Slight per-image tuning based on where
// the sauna sits within each mockup.
const productJobs = [
  {
    in: "1ee33941-0590-4d37-af05-104e295165a6.png",
    name: "fram-01-hero",
    crop: { left: 680, top: 90, width: 830, height: 640 },
  },
  {
    in: "ba5847ab-8b6e-4150-bb23-4d8c0205ddb7.png",
    name: "fram-02-hero",
    crop: { left: 680, top: 90, width: 830, height: 640 },
  },
  {
    in: "PNG image.png",
    name: "fram-03-hero",
    crop: { left: 680, top: 90, width: 830, height: 640 },
  },
];

for (const j of productJobs) {
  const dest = resolve(out, `${j.name}.jpg`);
  await sharp(resolve(src, j.in))
    .extract(j.crop)
    .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(dest);
  const meta = await sharp(dest).metadata();
  console.log(`✓ ${j.name}.jpg  ${meta.width}x${meta.height}`);
}

// Homepage mockup is 1024x1536 portrait. The "Design" section illustration
// (floor plan) sits roughly between y=440 and y=1100, spanning most of the width.
await sharp(resolve(src, "ef2fadf3-aa02-42d1-9be3-013808c3bde0.png"))
  .extract({ left: 60, top: 440, width: 920, height: 720 })
  .png({ quality: 92 })
  .toFile(resolve(out, "home-design-illustration.png"));
console.log(`✓ home-design-illustration.png`);

// Also make a smaller card version for the /saunas index page.
for (const j of productJobs) {
  const dest = resolve(out, `${j.name}-card.jpg`);
  await sharp(resolve(src, j.in))
    .extract(j.crop)
    .resize({ width: 800, height: 1000, fit: "cover", position: "center" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(dest);
  console.log(`✓ ${j.name}-card.jpg`);
}

console.log("done");
