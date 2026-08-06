import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, "..", "public");
const avatarsDir = path.join(publicDir, "avatars");
const compressedDir = path.join(avatarsDir, "compressed");

async function compressAll() {
  console.log("Starting Sharp image compression with Progressive Low-to-High preview generation...");

  if (!fs.existsSync(compressedDir)) {
    fs.mkdirSync(compressedDir, { recursive: true });
  }

  const avatarFiles = fs.readdirSync(avatarsDir).filter((file) => {
    return file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg");
  });

  const manifest = {};
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;

  for (const file of avatarFiles) {
    const filePath = path.join(avatarsDir, file);
    const stat = fs.statSync(filePath);
    totalOriginalSize += stat.size;

    const ext = path.extname(file);
    const baseName = path.basename(file, ext);
    const webpFileName = `${baseName}.webp`;
    const lowFileName = `${baseName}-low.webp`;
    const webpPath = path.join(compressedDir, webpFileName);
    const lowPath = path.join(compressedDir, lowFileName);

    // 1. High Quality WebP (400px width for sharp avatar display)
    await sharp(filePath)
      .resize({ width: 400, fit: "cover", withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(webpPath);

    // 2. Low Quality 180p WebP preview (80px width, low quality, lightweight ~1.5 KiB)
    await sharp(filePath)
      .resize({ width: 80, fit: "cover", withoutEnlargement: true })
      .webp({ quality: 30, effort: 4 })
      .toFile(lowPath);

    const compressedStat = fs.statSync(webpPath);
    totalCompressedSize += compressedStat.size;

    // 3. Ultra-tiny base64 blur data URL (~200 bytes) for instant render
    const blurBuffer = await sharp(filePath)
      .resize({ width: 16, fit: "cover" })
      .blur(2)
      .webp({ quality: 20 })
      .toBuffer();

    const base64Blur = `data:image/webp;base64,${blurBuffer.toString("base64")}`;
    manifest[baseName] = {
      webp: `/avatars/compressed/${webpFileName}`,
      low: `/avatars/compressed/${lowFileName}`,
      blur: base64Blur,
      original: `/avatars/${file}`
    };

    console.log(
      `Compressed ${file}: ${(stat.size / 1024).toFixed(1)} KiB -> High: ${(compressedStat.size / 1024).toFixed(1)} KiB | Low: ${(fs.statSync(lowPath).size / 1024).toFixed(1)} KiB`
    );
  }

  // Save manifest file
  fs.writeFileSync(
    path.join(compressedDir, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  // 4. Compress Root Heavy PNGs
  const rootImagesToCompress = ["nextaichat.png", "logo.png", "logo-landspaceq.png"];
  for (const rootImg of rootImagesToCompress) {
    const rootPath = path.join(publicDir, rootImg);
    if (fs.existsSync(rootPath)) {
      const origSize = fs.statSync(rootPath).size;
      totalOriginalSize += origSize;

      const baseName = path.basename(rootImg, path.extname(rootImg));
      const rootWebpPath = path.join(publicDir, `${baseName}.webp`);

      await sharp(rootPath)
        .webp({ quality: 82, effort: 6 })
        .toFile(rootWebpPath);

      const newSize = fs.statSync(rootWebpPath).size;
      totalCompressedSize += newSize;
      console.log(`Compressed Root ${rootImg}: ${(origSize / 1024).toFixed(1)} KiB -> ${(newSize / 1024).toFixed(1)} KiB`);
    }
  }

  const savedKiB = ((totalOriginalSize - totalCompressedSize) / 1024).toFixed(1);
  const reductionPercent = (((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100).toFixed(1);

  console.log("\n==========================================");
  console.log(`SUCCESS! Total Original: ${(totalOriginalSize / 1024).toFixed(1)} KiB`);
  console.log(`Total Compressed High-Res: ${(totalCompressedSize / 1024).toFixed(1)} KiB`);
  console.log(`TOTAL SAVINGS: ${savedKiB} KiB (${reductionPercent}% reduction)`);
  console.log("==========================================\n");
}

compressAll().catch((err) => {
  console.error("Compression error:", err);
  process.exit(1);
});
