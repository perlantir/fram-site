import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DECK = "/tmp/deck_extracted/ppt/media";
const OUTPUT = path.join(__dirname, "../public/images");

async function main() {
  // FRAM 01 — cedar, horizontal paneling
  // image4.png (1349x1166) = landscape interior → hero (4:3)
  await sharp(path.join(DECK, "image4.png"))
    .resize(830, 640, { fit: "cover", position: "centre" })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(path.join(OUTPUT, "fram-01-hero.jpg"));
  console.log("✓ fram-01-hero.jpg (1349x1166 → 830x640)");

  // image2.png (1024x1536) = portrait close-up with marine sconce → card (4:5)
  await sharp(path.join(DECK, "image2.png"))
    .resize(800, 1000, { fit: "cover", position: "centre" })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(OUTPUT, "fram-01-hero-card.jpg"));
  console.log("✓ fram-01-hero-card.jpg (1024x1536 → 800x1000)");

  // FRAM 02 — aspen/thermowood, vertical paneling, LED
  // image5.png (1360x1157) = landscape interior → hero (4:3)
  await sharp(path.join(DECK, "image5.png"))
    .resize(830, 640, { fit: "cover", position: "centre" })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(path.join(OUTPUT, "fram-02-hero.jpg"));
  console.log("✓ fram-02-hero.jpg (1360x1157 → 830x640)");

  // image3.png (985x1597) = portrait close-up with LED strip → card (4:5)
  await sharp(path.join(DECK, "image3.png"))
    .resize(800, 1000, { fit: "cover", position: "centre" })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(OUTPUT, "fram-02-hero-card.jpg"));
  console.log("✓ fram-02-hero-card.jpg (985x1597 → 800x1000)");

  // Floor plan drawing → homepage architectural illustration
  // image6.png (1391x1131) — cleaner than the unnamed (3).png version
  await sharp(path.join(DECK, "image6.png"))
    .resize(1600, null, { fit: "inside" })
    .png({ compressionLevel: 7 })
    .toFile(path.join(OUTPUT, "home-design-illustration.png"));
  console.log("✓ home-design-illustration.png (1391x1131 → 1600w max)");

  // Floor plan → product plan view (same image works for both models for now)
  await sharp(path.join(DECK, "image6.png"))
    .resize(900, null, { fit: "inside" })
    .png({ compressionLevel: 7 })
    .toFile(path.join(OUTPUT, "plan-view.png"));
  console.log("✓ plan-view.png");
}

main().catch((e) => { console.error(e); process.exit(1); });
