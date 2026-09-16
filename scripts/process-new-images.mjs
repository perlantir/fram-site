import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INPUT = "/Users/perlantir/Documents/Sauna/Images";
const OUTPUT = path.join(__dirname, "../public/images");

async function main() {
  // FRAM 01 hero (4:3 landscape for product detail page)
  await sharp(path.join(INPUT, "unnamed.jpg"))
    .resize(830, 640, { fit: "cover", position: "centre" })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(OUTPUT, "fram-01-hero.jpg"));
  console.log("✓ fram-01-hero.jpg");

  // FRAM 01 card (4:5 portrait for saunas index)
  await sharp(path.join(INPUT, "unnamed.jpg"))
    .resize(800, 1000, { fit: "cover", position: "centre" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(OUTPUT, "fram-01-hero-card.jpg"));
  console.log("✓ fram-01-hero-card.jpg");

  // FRAM 02 hero
  await sharp(path.join(INPUT, "unnamed (1).jpg"))
    .resize(830, 640, { fit: "cover", position: "centre" })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(OUTPUT, "fram-02-hero.jpg"));
  console.log("✓ fram-02-hero.jpg");

  // FRAM 02 card
  await sharp(path.join(INPUT, "unnamed (1).jpg"))
    .resize(800, 1000, { fit: "cover", position: "centre" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(OUTPUT, "fram-02-hero-card.jpg"));
  console.log("✓ fram-02-hero-card.jpg");

  // Architectural plan drawing for homepage (warmer off-white background version)
  await sharp(path.join(INPUT, "unnamed (3).png"))
    .resize(1400, null, { fit: "inside", withoutEnlargement: false })
    .png({ compressionLevel: 7 })
    .toFile(path.join(OUTPUT, "home-design-illustration.png"));
  console.log("✓ home-design-illustration.png");
}

main().catch((e) => { console.error(e); process.exit(1); });
