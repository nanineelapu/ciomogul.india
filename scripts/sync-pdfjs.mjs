// Copies the pdf.js worker and support files into /public from the exact pdf.js
// that react-pdf uses. Run after upgrading react-pdf: npm run sync:pdfjs
// A version mismatch between the worker and react-pdf stops the reader working.
import { cpSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nested = path.join(root, "node_modules/react-pdf/node_modules/pdfjs-dist");
const src = existsSync(nested) ? nested : path.join(root, "node_modules/pdfjs-dist");
const out = path.join(root, "public/pdfjs");

mkdirSync(out, { recursive: true });
cpSync(path.join(src, "build/pdf.worker.min.mjs"), path.join(root, "public/pdf.worker.min.mjs"));
for (const dir of ["cmaps", "standard_fonts", "wasm", "iccs"]) {
  cpSync(path.join(src, dir), path.join(out, dir), { recursive: true });
}
console.log("pdf.js", JSON.parse(readFileSync(path.join(src, "package.json"), "utf8")).version, "copied to public/");
