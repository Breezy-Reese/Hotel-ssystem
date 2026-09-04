// One-time codemod: replaces the `$${expr.toFixed(2)}` dollar-formatting
// pattern with `formatCurrency(expr)` across src/routes and src/components,
// and adds the `formatCurrency` import to any file it touches.
//
// Run once from the frontend project root:
//   node scripts/currency-codemod.js
//
// It's idempotent — safe to run more than once, it skips files that no
// longer match and won't duplicate an import that's already there.

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "src");
const TARGET_DIRS = ["routes", "components"];
const PATTERN = /`\$\$\{([^`]+?)\.toFixed\(2\)\}`/g;
const IMPORT_LINE = 'import { formatCurrency } from "@/lib/currency";';

function walk(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else if (entry.isFile() && (full.endsWith(".tsx") || full.endsWith(".ts"))) cb(full);
  }
}

function addImportIfMissing(content) {
  if (content.includes(IMPORT_LINE)) return content;

  const lines = content.split("\n");
  let lastImportIdx = -1;
  lines.forEach((line, i) => {
    if (line.startsWith("import ")) lastImportIdx = i;
  });

  if (lastImportIdx >= 0) {
    lines.splice(lastImportIdx + 1, 0, IMPORT_LINE);
  } else {
    lines.unshift(IMPORT_LINE, "");
  }
  return lines.join("\n");
}

let filesChanged = 0;
const changedFiles = [];

for (const dirName of TARGET_DIRS) {
  const dirPath = path.join(ROOT, dirName);
  if (!fs.existsSync(dirPath)) continue;

  walk(dirPath, (file) => {
    const original = fs.readFileSync(file, "utf8");

    PATTERN.lastIndex = 0;
    if (!PATTERN.test(original)) return;

    PATTERN.lastIndex = 0;
    const replaced = original.replace(PATTERN, (_match, expr) => `formatCurrency(${expr})`);

    const withImport = addImportIfMissing(replaced);

    if (withImport !== original) {
      fs.writeFileSync(file, withImport, "utf8");
      filesChanged++;
      changedFiles.push(path.relative(ROOT, file));
    }
  });
}

console.log(`Updated ${filesChanged} file(s):`);
changedFiles.forEach((f) => console.log(`  - ${f}`));
console.log(
  "\nNote: this only catches the `$${expr.toFixed(2)}` template-literal pattern. " +
    "Check src/components/mpesa-pay-dialog.tsx and the \"Rate / night ($)\" label " +
    "in rooms.tsx manually — see the chat for exact fixes.",
);