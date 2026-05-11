import { supabase } from "./supabase";

const quoteStatusToDb = {
  Pendiente: "pending",
  Aceptado: "accepted",
  Rechazado: "rejected",
  Vencido: "expired"
};

const quoteStatusFromDb = {
  pending: "Pendiente",
  accepted: "Aceptado",
  rejected: "Rechazado",
  expired: "Vencido"
};

const accountStatusFromDb = {
  current: "Al dia",
  late: "Atrasado",
  blocked: "Bloqueado"
};

const repairStatusFromDb = {
  received: "Recibido",
  diagnosing: "Diagnosticando",
  waiting_part: "Esperando repuesto",
  ready: "Listo",
  delivered: "Entregado"
};

const taskStatusToDb = {
  Pendiente: "pending",
  "En proceso": "in_progress",
  Hecha: "done"
};

const taskStatusFromDb = {
  pending: "Pendiente",
  in_progress: "En proceso",
  done: "Hecha"
};

const priorityFromDb = {
  low: "Baja",
  medium: "Media",
  high: "Alta"
};

export const mapQuoteFromDb = (quote) => ({
  id: quote.quote_number,
  dbId: quote.id,
  customer: quote.customer_name,
  customerPhone: quote.customer_phone || "",
  products: quote.quote_items?.map((item) => `${item.product_name} x${Number(item.quantity)}`).join(", ") || "",
  items:
    quote.quote_items?.map((item) => ({
      product: item.product_name,
      quantity: Number(item.quantity || 0),
      unitPrice: Number(item.unit_price || 0),
      discount: Number(item.discount_percent || 0),
      total: Number(item.line_total || 0)
    })) || [],
  amount: Number(quote.total || 0),
  subtotal: Number(quote.subtotal || 0),
  discount: Number(quote.discount_percent || 0),
  status: quoteStatusFromDb[quote.status] || "Pendiente",
  notes: quote.notes || "",
  createdAt: quote.created_at
});

export const getQuotes = async () => {
  const { data, error } = await supabase
    .from("quotes")
    .select("*, quote_items(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(mapQuoteFromDb);
};

export const createQuote = async ({ customer, customerPhone, items, discount, notes }) => {
  const subtotal = items.reduce((sum, item) => sum + Number(item.unitPrice || 0) * Number(item.quantity || 0), 0);
  const discountAmount = Math.round(subtotal * (Number(discount || 0) / 100));
  const total = Math.max(0, subtotal - discountAmount);
  const quoteNumber = `COT-${Date.now().toString().slice(-6)}`;

  const { data: quote, error } = await supabase
    .from("quotes")
    .insert({
      quote_number: quoteNumber,
      customer_name: customer,
      customer_phone: customerPhone || null,
      subtotal,
      discount_percent: Number(discount || 0),
      discount_amount: discountAmount,
      total,
      notes: notes || "",
      status: "pending"
    })
    .select()
    .single();

  if (error) throw error;

  const quoteItems = items.map((item) => {
    const lineSubtotal = Number(item.unitPrice || 0) * Number(item.quantity || 0);
    const lineDiscount = lineSubtotal * (Number(item.discount || 0) / 100);
    return {
      quote_id: quote.id,
      product_name: item.product,
      quantity: Number(item.quantity || 0),
      unit_price: Number(item.unitPrice || 0),
      discount_percent: Number(item.discount || 0),
      line_total: Math.max(0, Math.round(lineSubtotal - lineDiscount))
    };
  });

  const { data: savedItems, error: itemsError } = await supabase.from("quote_items").insert(quoteItems).select();
  if (itemsError) throw itemsError;

  return mapQuoteFromDb({ ...quote, quote_items: savedItems });
};

export const updateQuoteStatus = async (quoteDbId, status) => {
  const { error } = await supabase
    .from("quotes")
    .update({ status: quoteStatusToDb[status] || "pending" })
    .eq("id", quoteDbId);

  if (error) throw error;
};

export const getCustomerAccounts = async () => {
  const { data, error } = await supabase
    .from("customer_accounts")
    .select("*")
    .order("current_debt", { ascending: false });

  if (error) throw error;
  return data.map((account) => ({
    customer: account.customer_name,
    debt: Number(account.current_debt || 0),
    lastPayment: account.last_payment_at || "Sin pagos",
    creditLimit: Number(account.credit_limit || 0),
    history: account.purchase_history || "Sin historial",
    status: accountStatusFromDb[account.status] || "Al dia"
  }));
};

export const getRepairOrders = async () => {
  const { data, error } = await supabase
    .from("repair_orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map((order) => ({
    id: order.repair_number,
    customer: order.customer_name,
    machine: order.machine,
    problem: order.problem,
    status: repairStatusFromDb[order.status] || "Recibido",
    partsCost: Number(order.parts_cost || 0),
    labor: Number(order.labor_cost || 0),
    deposit: Number(order.deposit || 0),
    dueDate: order.estimated_delivery || "Sin fecha"
  }));
};

export const getInternalTasks = async () => {
  const { data, error } = await supabase
    .from("internal_tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map((task) => ({
    dbId: task.id,
    task: task.title,
    owner: task.owner,
    priority: priorityFromDb[task.priority] || "Media",
    status: taskStatusFromDb[task.status] || "Pendiente"
  }));
};

export const updateTaskStatus = async (taskDbId, status) => {
  const { error } = await supabase
    .from("internal_tasks")
    .update({ status: taskStatusToDb[status] || "pending" })
    .eq("id", taskDbId);

  if (error) throw error;
};

export const getAuditEvents = async () => {
  const { data, error } = await supabase
    .from("audit_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data.map((event) => ({
    employee: event.employee,
    action: event.action,
    detail: event.detail,
    date: new Date(event.created_at).toLocaleString("es-AR")
  }));
};
