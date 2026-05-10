const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const inputPath = process.argv[2] || "C:/Users/Facundito/Downloads/productos/basedeproductos.xls";
const outputPath = process.argv[3] || path.join(process.cwd(), "supabase", "products-import.sql");

const workbook = XLSX.readFile(inputPath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

const normalizeText = (value) => String(value ?? "").trim().replace(/\s+/g, " ");
const normalizeNumber = (value) => {
  if (value === "" || value === null || value === undefined || value === "N/A") return 0;
  const normalized = Number(String(value).replace(",", "."));
  return Number.isFinite(normalized) ? normalized : 0;
};

const slugify = (value) =>
  normalizeText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 90);

const sqlString = (value) => `'${String(value ?? "").replace(/'/g, "''")}'`;
const sqlNumber = (value) => normalizeNumber(value).toFixed(2);
const sqlInteger = (value) => String(Math.round(normalizeNumber(value)));

const products = rows
  .map((row, index) => {
    const sku = normalizeText(row.Codigo);
    const name = normalizeText(row.Descripcion);
    if (!sku || !name) return null;

    const category = normalizeText(row.Departamento) || "General";
    const slug = slugify(`${sku}-${name}`) || `producto-${index + 1}`;
    const costPrice = normalizeNumber(row["Precio Costo"]);
    const salePrice = normalizeNumber(row["Precio Venta"]);
    const wholesalePrice = normalizeNumber(row["Precio Mayoreo"]);
    const stock = row.Inventario === "N/A" ? 0 : normalizeNumber(row.Inventario);
    const minStock = normalizeNumber(row["Inv. Minimo"]);
    const stockStatus = stock > 0 && minStock > 0 && stock <= minStock ? "low" : "consult";

    return {
      slug,
      sku,
      name,
      category,
      description: name,
      tag: "Consultar stock",
      stockStatus,
      useCase: category,
      brand: "Varias marcas",
      technical: [`Codigo: ${sku}`, `Departamento: ${category}`],
      costPrice,
      salePrice,
      cashPrice: salePrice,
      wholesalePrice,
      card3MarkupPercent: 35,
      stock,
      minStock,
      isActive: false
    };
  })
  .filter(Boolean);

const values = products.map((product, index) => {
  const technical = `array[${product.technical.map(sqlString).join(", ")}]::text[]`;
  return `  (${[
    sqlString(product.slug),
    sqlString(product.sku),
    sqlString(product.name),
    sqlString(product.category),
    sqlString(product.description),
    sqlString(product.tag),
    sqlString(product.stockStatus),
    sqlString(product.useCase),
    sqlString(product.brand),
    technical,
    sqlNumber(product.costPrice),
    sqlNumber(product.salePrice),
    sqlNumber(product.cashPrice),
    sqlNumber(product.wholesalePrice),
    sqlNumber(product.card3MarkupPercent),
    sqlInteger(product.stock),
    sqlInteger(product.minStock),
    product.isActive ? "true" : "false",
    index
  ].join(", ")})`;
});

const sql = `insert into public.products (
  slug,
  sku,
  name,
  category,
  description,
  tag,
  stock_status,
  use_case,
  brand,
  technical,
  cost_price,
  sale_price,
  cash_price,
  wholesale_price,
  card_3_markup_percent,
  stock_quantity,
  min_stock_quantity,
  is_active,
  sort_order
)
values
${values.join(",\n")}
on conflict (slug) do update set
  sku = excluded.sku,
  name = excluded.name,
  category = excluded.category,
  description = excluded.description,
  tag = excluded.tag,
  stock_status = excluded.stock_status,
  use_case = excluded.use_case,
  brand = excluded.brand,
  technical = excluded.technical,
  cost_price = excluded.cost_price,
  sale_price = excluded.sale_price,
  cash_price = excluded.cash_price,
  wholesale_price = excluded.wholesale_price,
  card_3_markup_percent = excluded.card_3_markup_percent,
  stock_quantity = excluded.stock_quantity,
  min_stock_quantity = excluded.min_stock_quantity,
  sort_order = excluded.sort_order;
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, sql);

console.log(`Generated ${products.length} products at ${outputPath}`);
