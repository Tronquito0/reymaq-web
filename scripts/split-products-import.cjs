const fs = require("fs");
const path = require("path");

const inputPath = path.join(process.cwd(), "supabase", "products-import.sql");
const outputDir = path.join(process.cwd(), "supabase", "import-chunks");
const chunkSize = Number(process.argv[2] || 300);

const sql = fs.readFileSync(inputPath, "utf8");
const valuesIndex = sql.indexOf("values");
const conflictIndex = sql.indexOf("on conflict");

if (valuesIndex === -1 || conflictIndex === -1) {
  throw new Error("Invalid products import SQL.");
}

const header = sql.slice(0, valuesIndex + "values".length);
const body = sql.slice(valuesIndex + "values".length, conflictIndex).trim().replace(/;$/, "");
const footer = sql.slice(conflictIndex);
const rows = [];
let depth = 0;
let start = 0;

for (let index = 0; index < body.length; index += 1) {
  const char = body[index];
  if (char === "(") depth += 1;
  if (char === ")") depth -= 1;

  if (depth === 0 && char === "," && body[index + 1] === "\n") {
    rows.push(body.slice(start, index).trim());
    start = index + 2;
  }
}

rows.push(body.slice(start).trim());

fs.mkdirSync(outputDir, { recursive: true });

for (let index = 0; index < rows.length; index += chunkSize) {
  const part = rows.slice(index, index + chunkSize);
  const number = String(index / chunkSize + 1).padStart(2, "0");
  const outputPath = path.join(outputDir, `products-import-${number}.sql`);
  fs.writeFileSync(outputPath, `${header}\n${part.join(",\n")}\n${footer}`);
}

console.log(`Created ${Math.ceil(rows.length / chunkSize)} chunks with ${rows.length} products.`);
