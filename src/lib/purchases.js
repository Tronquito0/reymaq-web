import { createProduct, getAdminProducts, updateProduct } from "./products";
import { supabase } from "./supabase";

const moneyNumber = (value) => Number(String(value || "0").replace(/\./g, "").replace(",", "."));

export const normalizeReceiptLine = (line) => {
  const clean = line.replace(/\s+/g, " ").trim();
  if (!clean) return null;

  const numbers = clean.match(/(?:\d+[.,]?\d*)/g) || [];
  const unitCost = moneyNumber(numbers.at(-1));
  const quantity = numbers.length > 1 ? moneyNumber(numbers[0]) : 1;
  const productName = clean
    .replace(/^\d+[.,]?\d*\s*[xX]?\s*/, "")
    .replace(/\$?\s*\d+[.,]?\d*\s*$/g, "")
    .trim();

  if (!productName || !unitCost) return null;

  return {
    productName,
    quantity,
    unitCost,
    marginPercent: 35,
    salePrice: Math.round(unitCost * 1.35),
    action: "create",
    productId: "",
    category: "General"
  };
};

export const analyzeReceiptText = (text) =>
  text
    .split(/\r?\n/)
    .map(normalizeReceiptLine)
    .filter(Boolean);

export const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const analyzeReceiptImage = async ({ imageDataUrl, textHint }) => {
  const { data, error } = await supabase.functions.invoke("analyze-receipt", {
    body: { imageDataUrl, textHint }
  });

  if (error) throw error;
  return data;
};

export const uploadReceiptImage = async (file) => {
  const extension = file.name.split(".").pop() || "jpg";
  const path = `receipts/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("supplier-receipts").upload(path, file, {
    cacheControl: "3600",
    upsert: false
  });

  if (error) throw error;

  const { data } = supabase.storage.from("supplier-receipts").getPublicUrl(path);
  return data.publicUrl;
};

export const upsertSupplier = async ({ name, phone }) => {
  const supplierName = name || "Proveedor sin nombre";
  const { data: existing, error: findError } = await supabase
    .from("suppliers")
    .select("*")
    .ilike("name", supplierName)
    .maybeSingle();

  if (findError) throw findError;
  if (existing) return existing;

  const { data, error } = await supabase
    .from("suppliers")
    .insert({ name: supplierName, phone: phone || null })
    .select("*")
    .single();

  if (error) throw error;
  return data;
};

export const saveSupplierPurchase = async ({ supplier, receipt, items, imageUrl, rawText }) => {
  const supplierRow = await upsertSupplier(supplier);
  const total = items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitCost || 0), 0);

  const { data: purchase, error } = await supabase
    .from("supplier_purchases")
    .insert({
      supplier_id: supplierRow.id,
      supplier_name: supplierRow.name,
      receipt_number: receipt.number || null,
      receipt_date: receipt.date || null,
      image_url: imageUrl || null,
      raw_text: rawText || "",
      total,
      status: "applied"
    })
    .select("*")
    .single();

  if (error) throw error;

  const purchaseItems = items.map((item) => ({
    purchase_id: purchase.id,
    product_id: item.productId || null,
    detected_name: item.productName,
    quantity: Number(item.quantity || 0),
    unit_cost: Number(item.unitCost || 0),
    margin_percent: Number(item.marginPercent || 0),
    sale_price: Number(item.salePrice || 0),
    action: item.action
  }));

  const { error: itemsError } = await supabase.from("supplier_purchase_items").insert(purchaseItems);
  if (itemsError) throw itemsError;

  return purchase;
};

export const applyPurchaseToStock = async ({ supplier, receipt, items, imageUrl, rawText }) => {
  const products = await getAdminProducts();
  const applied = [];

  for (const item of items.filter((entry) => entry.action !== "ignore")) {
    const quantity = Number(item.quantity || 0);
    const unitCost = Number(item.unitCost || 0);
    const salePrice = Number(item.salePrice || Math.round(unitCost * (1 + Number(item.marginPercent || 0) / 100)));
    const existing =
      products.find((product) => product.id === item.productId) ||
      products.find((product) => product.name.toLowerCase() === item.productName.toLowerCase());

    if (existing && item.action !== "create") {
      const next = {
        ...existing,
        costPrice: unitCost,
        salePrice,
        cashPrice: salePrice,
        wholesalePrice: Math.round(salePrice * 0.9),
        stockQuantity: Number(existing.stockQuantity || 0) + quantity,
        stockStatus: quantity > 0 ? "available" : existing.stockStatus
      };
      applied.push(await updateProduct(next));
    } else {
      applied.push(
        await createProduct({
          name: item.productName,
          category: item.category || "General",
          costPrice: unitCost,
          salePrice,
          cashPrice: salePrice,
          wholesalePrice: Math.round(salePrice * 0.9),
          stockQuantity: quantity,
          stockStatus: "available",
          isActive: true
        })
      );
    }
  }

  const purchase = await saveSupplierPurchase({ supplier, receipt, items, imageUrl, rawText });
  return { purchase, applied };
};
