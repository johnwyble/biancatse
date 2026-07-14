/*
 * build.js — copies site files into /dist and optimizes images.
 * Images are resized by descriptive prefix and converted to WebP where possible.
 * Requires: sharp (installed via npm install). Falls back to a plain copy if sharp is missing.
 */
const fs = require("fs");
const path = require("path");

const SRC = __dirname;
const DIST = path.join(SRC, "dist");
const IMG_SRC = path.join(SRC, "images");
const IMG_DIST = path.join(DIST, "images");

// max width by filename prefix
const SIZE_RULES = [
  { test: /hero/i, max: 1920 },
  { test: /about/i, max: 900 },
  { test: /endorser/i, max: 250 },
  { test: /logo/i, max: 400 }
];
const defaultMax = 1200;

function rmrf(p) {
  if (!fs.existsSync(p)) return;
  try {
    fs.rmSync(p, { recursive: true, force: true });
  } catch (e) {
    // Some synced filesystems (e.g. Dropbox) block unlink; fall back to overwriting in place.
    console.warn("Note: could not fully clear " + p + " (" + e.code + "); files will be overwritten instead.");
  }
}
function ensure(p) { fs.mkdirSync(p, { recursive: true }); }

function copyPassthrough() {
  const files = ["index.html", "site-config.json", "_redirects"];
  files.forEach(f => {
    const s = path.join(SRC, f);
    if (fs.existsSync(s)) fs.copyFileSync(s, path.join(DIST, f));
  });
}

async function optimizeImages() {
  ensure(IMG_DIST);
  if (!fs.existsSync(IMG_SRC)) return;
  let sharp = null;
  try { sharp = require("sharp"); } catch (e) { sharp = null; }
  const files = fs.readdirSync(IMG_SRC).filter(f => !f.startsWith("."));
  for (const f of files) {
    const src = path.join(IMG_SRC, f);
    if (!fs.statSync(src).isFile()) continue;
    const ext = path.extname(f).toLowerCase();
    const isRaster = [".jpg", ".jpeg", ".png"].includes(ext);
    if (!sharp || !isRaster) { fs.copyFileSync(src, path.join(IMG_DIST, f)); continue; }
    const rule = SIZE_RULES.find(r => r.test.test(f));
    const max = rule ? rule.max : defaultMax;
    // Resize + compress, preserving the ORIGINAL filename and format so config paths stay valid.
    // PNGs keep transparency (used for logos); JPEGs re-encode with mozjpeg.
    try {
      const pipe = sharp(src).resize({ width: max, withoutEnlargement: true });
      if (ext === ".png") {
        await pipe.png({ compressionLevel: 9, palette: true }).toFile(path.join(IMG_DIST, f));
      } else {
        await pipe.jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(IMG_DIST, f));
      }
    } catch (e) {
      fs.copyFileSync(src, path.join(IMG_DIST, f));
    }
  }
}

(async () => {
  rmrf(DIST);
  ensure(DIST);
  copyPassthrough();
  await optimizeImages();
  console.log("Build complete → dist/");
})();
