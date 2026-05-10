import { supabase } from "./supabase";

export const today = () => new Date().toISOString().slice(0, 10);
export const currentMonth = () => new Date().toISOString().slice(0, 7);

const number = (value) => Number(value || 0);

export const getPreviousClosingCash = (sales, date) => {
  const previousSale = [...sales]
    .filter((sale) => sale.sale_date < date)
    .sort((a, b) => b.sale_date.localeCompare(a.sale_date))[0];
  return number(previousSale?.closing_cash);
};

export const getFinanceData = async () => {
  const [suppliers, purchases, payments, sales, monthlyCosts] = await Promise.all([
    supabase.from("suppliers").select("*").order("name", { ascending: true }),
    supabase.from("supplier_purchases").select("*, suppliers(name)").order("purchase_date", { ascending: false }).limit(80),
    supabase.from("supplier_payments").select("*").order("payment_date", { ascending: false }).limit(120),
    supabase.from("daily_sales").select("*").order("sale_date", { ascending: false }).limit(60),
    supabase.from("monthly_costs").select("*").order("month", { ascending: false }).limit(12)
  ]);

  const error = suppliers.error || purchases.error || payments.error || sales.error || monthlyCosts.error;
  if (error) throw error;

  return {
    suppliers: suppliers.data || [],
    purchases: purchases.data || [],
    payments: payments.data || [],
    sales: sales.data || [],
    monthlyCosts: monthlyCosts.data || []
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
    other_income: number(sale.other_income),
    cost_estimate: number(sale.cost_estimate),
    salary_expense: number(sale.salary_expense),
    other_expense: number(sale.other_expense),
    opening_cash: number(sale.opening_cash),
    notified_cash_withdrawals: number(sale.notified_cash_withdrawals),
    expected_cash: number(sale.expected_cash),
    counted_cash: number(sale.counted_cash),
    cash_difference: number(sale.cash_difference),
    closing_cash: number(sale.closing_cash)
  };

  const { data, error } = await supabase
    .from("daily_sales")
    .upsert(payload, { onConflict: "sale_date" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
};

export const upsertMonthlyCost = async (cost) => {
  const payload = {
    ...cost,
    rent_amount: number(cost.rent_amount),
    salaries_amount: number(cost.salaries_amount),
    services_amount: number(cost.services_amount),
    taxes_amount: number(cost.taxes_amount),
    debt_payments_amount: number(cost.debt_payments_amount),
    other_fixed_costs: number(cost.other_fixed_costs),
    target_margin_percent: number(cost.target_margin_percent || 35)
  };

  const { data, error } = await supabase
    .from("monthly_costs")
    .upsert(payload, { onConflict: "month" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
};
