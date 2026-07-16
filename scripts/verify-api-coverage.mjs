#!/usr/bin/env node
/**
 * verify-api-coverage.mjs
 *
 * Compares every exported symbol from mockApi.ts against the documented
 * endpoints in docs/api-specification.md (Appendix B table).
 *
 * Exit code 0 = 100% coverage  |  Exit code 1 = gaps found
 *
 * Usage:
 *   node scripts/verify-api-coverage.mjs
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ─── 1. Extract exported symbols from mockApi.ts ────────────────────────
const mockApiPath = resolve(ROOT, "src/shared/utils/mockApi.ts");
const mockApiSrc = readFileSync(mockApiPath, "utf-8");

// Match: export function foo(  |  export const foo  |  export async function foo(
const exportRegex = /export\s+(?:async\s+)?(?:function|const|let|var)\s+(\w+)/g;
const mockExports = new Set();
let m;
while ((m = exportRegex.exec(mockApiSrc)) !== null) {
  mockExports.add(m[1]);
}

// ─── 2. Extract mapped symbols from api-specification.md Appendix B ─────
const specPath = resolve(ROOT, "docs/api-specification.md");
const specSrc = readFileSync(specPath, "utf-8");

// Find lines inside the Appendix B table that start with | `symbolName()`
// Pattern: | `symbolName()` | or | `symbolName` (const) |
const tableRowRegex = /\|\s*`(\w+)\(\)`\s*\||\|\s*`(\w+)`\s*\(const\)\s*\|/g;
const documentedSymbols = new Set();
while ((m = tableRowRegex.exec(specSrc)) !== null) {
  const sym = m[1] || m[2];
  if (sym) documentedSymbols.add(sym);
}

// Also catch compound entries like `getAGV1Status()` / `getAGV2Status()`
const compoundRegex =
  /\|\s*`(\w+)\(\)`\s*\/\s*`(\w+)\(\)`\s*\|/g;
while ((m = compoundRegex.exec(specSrc)) !== null) {
  documentedSymbols.add(m[1]);
  documentedSymbols.add(m[2]);
}

// ─── 3. Compare ─────────────────────────────────────────────────────────
const undocumented = [...mockExports].filter((s) => !documentedSymbols.has(s));
const phantom = [...documentedSymbols].filter((s) => !mockExports.has(s));

// ─── 4. Report ──────────────────────────────────────────────────────────
console.log("╔════════════════════════════════════════════════════════════╗");
console.log("║   API Coverage Verification: mockApi.ts ↔ api-spec.md    ║");
console.log("╚════════════════════════════════════════════════════════════╝");
console.log();
console.log(`  mockApi.ts exports:          ${mockExports.size}`);
console.log(`  Documented in Appendix B:    ${documentedSymbols.size}`);
console.log();

if (undocumented.length === 0 && phantom.length === 0) {
  console.log("  ✅ 100% coverage — all exports are documented.\n");
  process.exit(0);
} else {
  if (undocumented.length > 0) {
    console.log(`  ❌ ${undocumented.length} export(s) NOT in api-specification.md:`);
    undocumented.forEach((s) => console.log(`     - ${s}`));
    console.log();
  }
  if (phantom.length > 0) {
    console.log(
      `  ⚠️  ${phantom.length} symbol(s) in spec but NOT exported from mockApi.ts:`
    );
    phantom.forEach((s) => console.log(`     - ${s}`));
    console.log();
  }
  process.exit(1);
}
