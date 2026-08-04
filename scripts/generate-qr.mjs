// JEAD QR Code Generator
// Usage: node scripts/generate-qr.mjs https://your-deployed-url.vercel.app
//
// Generates qr/jead-qr.png and qr/jead-qr.svg pointing to the given URL.
// Run this AFTER deployment, once you know the real public URL.

import QRCode from "qrcode";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "qr");

const url = process.argv[2];

if (!url) {
  console.error(
    "\n[JEAD QR Generator] URLを指定してください。\n" +
      "例: node scripts/generate-qr.mjs https://jead-portal.vercel.app\n"
  );
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

const pngPath = path.join(outDir, "jead-qr.png");
const svgPath = path.join(outDir, "jead-qr.svg");

await QRCode.toFile(pngPath, url, {
  type: "png",
  width: 1024,
  margin: 2,
  color: { dark: "#1b2a4a", light: "#ffffff" },
});

const svgString = await QRCode.toString(url, {
  type: "svg",
  margin: 2,
  color: { dark: "#1b2a4a", light: "#ffffff" },
});
writeFileSync(svgPath, svgString, "utf8");

console.log(`\n[JEAD QR Generator] 生成完了`);
console.log(`  URL : ${url}`);
console.log(`  PNG : ${pngPath}`);
console.log(`  SVG : ${svgPath}\n`);
