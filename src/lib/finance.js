import { supabase } from "./supabase";

export const today = () => new Date().toISOString().slice(0, 10);

const number = (value) => Number(value || 0);

export const getFinanceData = async () => {
  const [suppliers, purchases, payments, sales] = await Promise.all([
    supabase.from("suppliers").select("*").order("name", { ascending: true }),
    supabase.from("supplier_purchases").select("*, suppliers(name)").order("purchase_date", { ascending: false }).limit(80),
    supabase.from("supplier_payments").select("*").order("payment_date", { ascending: false }).limit(120),
    supabase.from("daily_sales").select("*").order("sale_date", { ascending: false }).limit(60)
  ]);

  const error = suppliers.error || purchases.error || payments.error || sales.error;
  if (error) throw error;

  return {
    suppliers: suppliers.data || [],
    purchases: purchases.data || [],
    payments: payments.data || [],
    sales: sales.data || []
  };
};

export const createSupplier = async (supplier) => {
  const { data, error } = await supabase.from("suppliers").insert(supplier).select("*").single();
  if (error) throw error;
  return data;
};

export const createPurchase = async (purchase) => {
  const paidAmount = number(purchase.paid_amount);
  const totalAmount = number(purchase.total_amount);
  const status = paidAmount >= totalAmount ? "paid" : paidAmount > 0 ? "partial" : "open";
  const { data, error } = await supabase
    .from("supplier_purchases")
    .insert({ ...purchase, total_amount: totalAmount, paid_amount: paidAmount, status })
    .select("*, suppliers(name)")
    .single();
  if (error) throw error;
  return data;
};

export const createSupplierPayment = async (purchase, payment) => {
  const amount = number(payment.amount);
  const nextPaidAmount = number(purchase.paid_amount) + amount;
  const nextStatus = nextPaidAmount >= number(purchase.total_amount) ? "paid" : "partial";

  const { error: paymentError } = await supabase.from("supplier_payments").insert({
    ...payment,
    purchase_id: purchase.id,
    amount
  });
  if (paymentError) throw paymentError;

  const { data, error } = await supabase
    .from("supplier_purchases")
    .update({ paid_amount: nextPaidAmount, status: nextStatus })
    .eq("id", purchase.id)
    .select("*, suppliers(name)")
    .single();
  if (error) throw error;
  return data;
};

export const upsertDailySale = async (sale) => {
  const payload = {
    ...sale,
    cash_amount: number(sale.cash_amount),
    transfer_amount: number(sale.transfer_amount),
    card_amount: number(sale.card_amount),
    account_amount: number(sale.account_amount),
    cost_estimate: number(sale.cost_estimate)
  };

  const { data, error } = await supabase
    .from("daily_sales")
    .upsert(payload, { onConflict: "sale_date" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
};
