import { supabase } from "./supabase";

export const stockLabels = {
  available: "Disponible",
  consult: "Consultar stock",
  preorder: "Bajo pedido",
  low: "Ultimas unidades",
  out: "Sin stock"
};

export const toProduct = (row) => ({
  id: row.id || row.slug,
  slug: row.slug,
  sku: row.sku || "",
  name: row.name || "",
  category: row.category || "General",
  description: row.description || "",
  tag: row.tag || "Consultar stock",
  stockStatus: row.stock_status || "consult",
  useCase: row.use_case || "",
  brand: row.brand || "Varias marcas",
  technical: Array.isArray(row.technical) ? row.technical : [],
  costPrice: Number(row.cost_price || 0),
  salePrice: Number(row.sale_price || row.price || 0),
  cashPrice: Number(row.cash_price || row.sale_price || row.price || 0),
  wholesalePrice: Number(row.wholesale_price || 0),
  card3MarkupPercent: Number(row.card_3_markup_percent ?? 35),
  stockQuantity: Number(row.stock_quantity || 0),
  minStockQuantity: Number(row.min_stock_quantity || 0),
  imageUrl: row.image_url || "",
  isFeatured: Boolean(row.is_featured),
  isActive: Boolean(row.is_active),
  sortOrder: Number(row.sort_order || 0)
});

export const toProductUpdate = (product) => ({
  name: product.name,
  category: product.category,
  description: product.description,
  tag: product.tag,
  stock_status: product.stockStatus,
  use_case: product.useCase,
  brand: product.brand,
  technical: product.technical || [],
  cost_price: Number(product.costPrice || 0),
  sale_price: Number(product.salePrice || 0),
  cash_price: Number(product.cashPrice || 0),
  wholesale_price: Number(product.wholesalePrice || 0),
  card_3_markup_percent: Number(product.card3MarkupPercent || 35),
  stock_quantity: Number(product.stockQuantity || 0),
  min_stock_quantity: Number(product.minStockQuantity || 0),
  image_url: product.imageUrl || null,
  is_featured: Boolean(product.isFeatured),
  is_active: Boolean(product.isActive),
  sort_order: Number(product.sortOrder || 0)
});

const fetchProductsPage = async ({ page, pageSize, onlyActive }) => {
  const from = page * pageSize;
  const to = from + pageSize - 1;
  let query = supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true })
    .range(from, to);

  if (onlyActive) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
};

const fetchAllProducts = async ({ onlyActive = false, pageSize = 1000 } = {}) => {
  const rows = [];
  let page = 0;

  while (true) {
    const chunk = await fetchProductsPage({ page, pageSize, onlyActive });
    rows.push(...chunk);

    if (chunk.length < pageSize) break;
    page += 1;
  }

  return rows.map(toProduct);
};

export const getPublicProducts = () => fetchAllProducts({ onlyActive: true });

export const getAdminProducts = () => fetchAllProducts({ onlyActive: false });

export const updateProduct = async (product) => {
  const { data, error } = await supabase
    .from("products")
    .update(toProductUpdate(product))
    .eq("id", product.id)
    .select("*")
    .single();

  if (error) throw error;
  return toProduct(data);
};

export const createProduct = async (product) => {
  const baseName = product.name || "Producto nuevo";
  const slugBase = baseName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);

  const { data, error } = await supabase
    .from("products")
    .insert({
      slug: `${slugBase || "producto"}-${Date.now().toString().slice(-6)}`,
      name: baseName,
      category: product.category || "General",
      description: product.description || "",
      tag: product.tag || "Consultar stock",
      stock_status: product.stockStatus || "available",
      use_case: product.useCase || "",
      brand: product.brand || "Varias marcas",
      technical: product.technical || [],
      sku: product.sku || null,
      cost_price: Number(product.costPrice || 0),
      sale_price: Number(product.salePrice || 0),
      cash_price: Number(product.cashPrice || product.salePrice || 0),
      wholesale_price: Number(product.wholesalePrice || 0),
      card_3_markup_percent: Number(product.card3MarkupPercent || 35),
      stock_quantity: Number(product.stockQuantity || 0),
      min_stock_quantity: Number(product.minStockQuantity || 0),
      image_url: product.imageUrl || null,
      is_featured: Boolean(product.isFeatured),
      is_active: product.isActive ?? true,
      sort_order: Number(product.sortOrder || 0)
    })
    .select("*")
    .single();

  if (error) throw error;
  return toProduct(data);
};
