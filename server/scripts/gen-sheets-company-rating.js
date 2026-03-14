const fs = require("fs");
const path = require("path");
const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "extracted-company-rating.json"), "utf8")
);
function esc(s) {
  if (typeof s === "number") return String(s);
  return '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n") + '"';
}
const lines = [
  "// Company-rating workbook: 4 sheets (input_data, result, score_table, safety_indicators)",
  "// Extracted from template-company-rating.xlsx",
  "",
  "export const sheetsDataCompanyRating: Record<string, { [cell: string]: string | number }> = {",
];
for (const [sheetName, cells] of Object.entries(data)) {
  lines.push("  " + sheetName + ": {");
  for (const [cell, val] of Object.entries(cells)) {
    const v = typeof val === "string" ? esc(val) : val;
    lines.push("    " + cell + ": " + v + ",");
  }
  lines.push("  },");
}
lines.push("};");
fs.writeFileSync(path.join(__dirname, "sheets-company-rating.ts"), lines.join("\n"), "utf8");
console.log("Written sheets-company-rating.ts");
