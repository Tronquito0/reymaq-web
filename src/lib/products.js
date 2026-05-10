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

export const getPublicProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;
  return data.map(toProduct);
};

export const getAdminProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;
  return data.map(toProduct);
};

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
