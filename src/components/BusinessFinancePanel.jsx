import { Bot, CalendarClock, CircleDollarSign, HandCoins, Plus, RefreshCcw, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  createPurchase,
  createSupplier,
  createSupplierPayment,
  currentMonth,
  getFinanceData,
  today,
  upsertMonthlyCost,
  upsertDailySale
} from "../lib/finance";

const money = (value) => `$${Number(value || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

const emptySupplier = { name: "", contact: "", phone: "", notes: "" };
const emptyPurchase = {
  supplier_id: "",
  purchase_date: today(),
  description: "",
  total_amount: "",
  paid_amount: "",
  payment_type: "current_account",
  due_date: today()
};
const emptyPayment = { purchase_id: "", payment_date: today(), amount: "", method: "cash", notes: "" };
const emptySale = {
  sale_date: today(),
  cash_amount: "",
  transfer_amount: "",
  card_amount: "",
  account_amount: "",
  cost_estimate: "",
  notes: ""
};
const emptyMonthlyCost = {
  month: currentMonth(),
  rent_amount: "",
  salaries_amount: "",
  services_amount: "",
  taxes_amount: "",
  debt_payments_amount: "",
  other_fixed_costs: "",
  target_margin_percent: "35",
  notes: ""
};

export default function BusinessFinancePanel() {
  const [data, setData] = useState({ suppliers: [], purchases: [], payments: [], sales: [], monthlyCosts: [] });
  const [supplierForm, setSupplierForm] = useState(emptySupplier);
  const [purchaseForm, setPurchaseForm] = useState(emptyPurchase);
  const [paymentForm, setPaymentForm] = useState(emptyPayment);
  const [saleForm, setSaleForm] = useState(emptySale);
  const [monthlyCostForm, setMonthlyCostForm] = useState(emptyMonthlyCost);
  const [accountFilter, setAccountFilter] = useState("open");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [quickPayments, setQuickPayments] = useState({});
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    setNotice("");
    try {
      const nextData = await getFinanceData();
      setData(nextData);
      setPurchaseForm((current) => ({ ...current, supplier_id: current.supplier_id || nextData.suppliers[0]?.id || "" }));
      setPaymentForm((current) => ({ ...current, purchase_id: current.purchase_id || nextData.purchases[0]?.id || "" }));
      const monthCost = nextData.monthlyCosts.find((item) => item.month === currentMonth()) || nextData.monthlyCosts[0];
      if (monthCost) {
        setMonthlyCostForm({
          month: monthCost.month,
          rent_amount: monthCost.rent_amount || "",
          salaries_amount: monthCost.salaries_amount || "",
          services_amount: monthCost.services_amount || "",
          taxes_amount: monthCost.taxes_amount || "",
          debt_payments_amount: monthCost.debt_payments_amount || "",
          other_fixed_costs: monthCost.other_fixed_costs || "",
          target_margin_percent: monthCost.target_margin_percent || "35",
          notes: monthCost.notes || ""
        });
      }
    } catch (error) {
      setNotice(`Finanzas no esta inicializado: ejecuta supabase/business-finance.sql. Detalle: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const openPurchases = data.purchases.filter((purchase) => purchase.status !== "paid");
  const todayDate = today();

  const getPurchaseBalance = (purchase) =>
    Math.max(0, Number(purchase.total_amount || 0) - Number(purchase.paid_amount || 0));

  const getPurchaseStatus = (purchase) => {
    const balance = getPurchaseBalance(purchase);
    if (balance <= 0 || purchase.status === "paid") return "paid";
    if (purchase.due_date && purchase.due_date < todayDate) return "overdue";
    if (purchase.due_date) {
      const due = new Date(`${purchase.due_date}T00:00:00`);
      const now = new Date(`${todayDate}T00:00:00`);
      const days = Math.ceil((due - now) / 86400000);
      if (days <= 7) return "due-soon";
    }
    if (Number(purchase.paid_amount || 0) > 0) return "partial";
    return "open";
  };

  const filteredPurchases = useMemo(() => {
    return data.purchases.filter((purchase) => {
      const status = getPurchaseStatus(purchase);
      const matchesSupplier = supplierFilter === "all" || purchase.supplier_id === supplierFilter;
      const matchesStatus =
        accountFilter === "all" ||
        (accountFilter === "open" && status !== "paid") ||
        accountFilter === status;
      return matchesSupplier && matchesStatus;
    });
  }, [accountFilter, data.purchases, supplierFilter]);

  const supplierSummary = useMemo(() => {
    return data.suppliers
      .map((supplier) => {
        const purchases = data.purchases.filter((purchase) => purchase.supplier_id === supplier.id);
        const total = purchases.reduce((sum, purchase) => sum + Number(purchase.total_amount || 0), 0);
        const paid = purchases.reduce((sum, purchase) => sum + Number(purchase.paid_amount || 0), 0);
        return { supplier, total, paid, balance: total - paid, purchases: purchases.length };
      })
      .filter((item) => item.purchases > 0 || item.balance > 0)
      .sort((a, b) => b.balance - a.balance);
  }, [data.purchases, data.suppliers]);

  const metrics = useMemo(() => {
    const totalSales = data.sales.reduce(
      (sum, sale) =>
        sum +
        Number(sale.cash_amount || 0) +
        Number(sale.transfer_amount || 0) +
        Number(sale.card_amount || 0) +
        Number(sale.account_amount || 0) +
        Number(sale.other_income || 0),
      0
    );
    const totalCosts = data.sales.reduce((sum, sale) => sum + Number(sale.cost_estimate || 0), 0);
    const dailyExpenses = data.sales.reduce((sum, sale) => sum + Number(sale.salary_expense || 0) + Number(sale.other_expense || 0), 0);
    const missingCash = data.sales.reduce((sum, sale) => sum + Math.min(0, Number(sale.cash_difference || 0)), 0);
    const activeMonthCost = data.monthlyCosts.find((item) => item.month === monthlyCostForm.month);
    const monthlyFixedCosts = activeMonthCost
      ? Number(activeMonthCost.rent_amount || 0) +
        Number(activeMonthCost.salaries_amount || 0) +
        Number(activeMonthCost.services_amount || 0) +
        Number(activeMonthCost.taxes_amount || 0) +
        Number(activeMonthCost.debt_payments_amount || 0) +
        Number(activeMonthCost.other_fixed_costs || 0)
      : 0;
    const targetMargin = Number(activeMonthCost?.target_margin_percent || monthlyCostForm.target_margin_percent || 35);
    const breakEvenMonthlySales = targetMargin > 0 ? monthlyFixedCosts / (targetMargin / 100) : 0;
    const breakEvenDailySales = breakEvenMonthlySales / 30;
    const debt = openPurchases.reduce(
      (sum, purchase) => sum + Math.max(0, Number(purchase.total_amount || 0) - Number(purchase.paid_amount || 0)),
      0
    );
    const averageDailySale = data.sales.length ? totalSales / data.sales.length : 0;
    const grossProfit = totalSales - totalCosts - dailyExpenses;
    const margin = totalSales ? (grossProfit / totalSales) * 100 : 0;
    return { totalSales, totalCosts, dailyExpenses, missingCash, debt, averageDailySale, grossProfit, margin, monthlyFixedCosts, breakEvenMonthlySales, breakEvenDailySales, targetMargin };
  }, [data.monthlyCosts, data.sales, monthlyCostForm.month, monthlyCostForm.target_margin_percent, openPurchases]);

  const insights = useMemo(() => {
    const items = [];
    const overdue = data.purchases.filter((purchase) => getPurchaseStatus(purchase) === "overdue");
    const dueSoon = data.purchases.filter((purchase) => getPurchaseStatus(purchase) === "due-soon");
    if (overdue.length) {
      items.push(`Tenes ${overdue.length} cuentas vencidas por ${money(overdue.reduce((sum, purchase) => sum + getPurchaseBalance(purchase), 0))}. Prioridad alta: saldar o renegociar.`);
    }
    if (dueSoon.length) {
      items.push(`Vencen ${dueSoon.length} cuentas en los proximos 7 dias por ${money(dueSoon.reduce((sum, purchase) => sum + getPurchaseBalance(purchase), 0))}. Reservaria caja para eso.`);
    }
    if (metrics.debt > metrics.averageDailySale * 7 && metrics.averageDailySale > 0) {
      items.push("La deuda con proveedores supera una semana promedio de ventas. Priorizaria saldar vencimientos antes de comprar fuerte.");
    }
    if (metrics.margin < 25 && metrics.totalSales > 0) {
      items.push("El margen bruto estimado esta bajo. Revisaria precios de venta y productos con mayor rotacion antes de invertir.");
    }
    if (metrics.averageDailySale > 0) {
      items.push(`Con venta diaria promedio de ${money(metrics.averageDailySale)}, una compra prudente seria reinvertir entre ${money(metrics.averageDailySale * 2)} y ${money(metrics.averageDailySale * 4)} segun stock.`);
    }
    if (metrics.breakEvenDailySales > 0) {
      const gap = metrics.averageDailySale - metrics.breakEvenDailySales;
      items.push(gap >= 0
        ? `Estas por encima del break even diario por ${money(gap)} promedio. Podrias separar una parte para reposicion o bajar deuda.`
        : `Te faltan ${money(Math.abs(gap))} por dia para cubrir el break even estimado. Revisaria margen, gastos fijos o ticket promedio.`);
    }
    if (metrics.missingCash < 0) {
      items.push(`Hay faltantes de caja acumulados por ${money(Math.abs(metrics.missingCash))}. Conviene revisar cierres con diferencia negativa.`);
    }
    if (openPurchases.length > 0) {
      items.push("Hay cuentas corrientes abiertas. Conviene registrar pagos parciales para saber caja real disponible.");
    }
    if (items.length === 0) {
      items.push("Carga ventas y compras para que el asistente empiece a recomendar compras, pagos y reposicion.");
    }
    return items;
  }, [data.purchases, metrics, openPurchases.length]);

  const submitSupplier = async (event) => {
    event.preventDefault();
    if (!supplierForm.name.trim()) return;
    const supplier = await createSupplier(supplierForm);
    setData((current) => ({ ...current, suppliers: [...current.suppliers, supplier].sort((a, b) => a.name.localeCompare(b.name)) }));
    setSupplierForm(emptySupplier);
  };

  const submitPurchase = async (event) => {
    event.preventDefault();
    if (!purchaseForm.supplier_id || !purchaseForm.total_amount) return;
    const purchase = await createPurchase(purchaseForm);
    setData((current) => ({ ...current, purchases: [purchase, ...current.purchases] }));
    setPurchaseForm({ ...emptyPurchase, supplier_id: purchaseForm.supplier_id });
  };

  const submitPayment = async (event) => {
    event.preventDefault();
    const purchase = data.purchases.find((item) => item.id === paymentForm.purchase_id);
    if (!purchase || !paymentForm.amount) return;
    const updated = await createSupplierPayment(purchase, paymentForm);
    setData((current) => ({
      ...current,
      purchases: current.purchases.map((item) => (item.id === updated.id ? updated : item))
    }));
    setPaymentForm({ ...emptyPayment, purchase_id: updated.id });
  };

  const submitQuickPayment = async (purchase) => {
    const amount = quickPayments[purchase.id];
    if (!amount) return;
    const updated = await createSupplierPayment(purchase, {
      payment_date: today(),
      amount,
      method: "cash",
      notes: "Pago rapido"
    });
    setData((current) => ({
      ...current,
      purchases: current.purchases.map((item) => (item.id === updated.id ? updated : item))
    }));
    setQuickPayments((current) => ({ ...current, [purchase.id]: "" }));
  };

  const submitSale = async (event) => {
    event.preventDefault();
    const sale = await upsertDailySale(saleForm);
    setData((current) => ({
      ...current,
      sales: [sale, ...current.sales.filter((item) => item.id !== sale.id && item.sale_date !== sale.sale_date)]
    }));
    setSaleForm({ ...emptySale, sale_date: today() });
  };

  const submitMonthlyCost = async (event) => {
    event.preventDefault();
    const saved = await upsertMonthlyCost(monthlyCostForm);
    setData((current) => ({
      ...current,
      monthlyCosts: [saved, ...current.monthlyCosts.filter((item) => item.month !== saved.month)]
    }));
  };

  return (
    <div className="finance-panel">
      <div className="finance-top">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-reyred">Metricas del negocio</p>
          <h3>Ventas, proveedores y caja</h3>
        </div>
        <button type="button" onClick={refresh} className="btn btn-outline-light">
          <RefreshCcw size={18} />
          Actualizar
        </button>
      </div>

      {notice && <p className="admin-notice">{notice}</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="metric-card"><span>Ventas cargadas</span><strong>{money(metrics.totalSales)}</strong><p>{money(metrics.averageDailySale)} promedio diario</p></article>
        <article className="metric-card"><span>Ganancia bruta</span><strong>{money(metrics.grossProfit)}</strong><p>{metrics.margin.toFixed(1)}% margen estimado</p></article>
        <article className="metric-card"><span>Deuda proveedores</span><strong>{money(metrics.debt)}</strong><p>{openPurchases.length} cuentas abiertas</p></article>
        <article className="metric-card"><span>Break even diario</span><strong>{money(metrics.breakEvenDailySales)}</strong><p>Faltantes caja {money(Math.abs(metrics.missingCash))}</p></article>
      </div>

      <div className="finance-grid">
        <form onSubmit={submitSale} className="control-card">
          <h4><CircleDollarSign size={20} /> Venta del dia</h4>
          <label className="field field-dark">Fecha<input type="date" value={saleForm.sale_date} onChange={(event) => setSaleForm({ ...saleForm, sale_date: event.target.value })} /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="field field-dark">Efectivo<input type="number" value={saleForm.cash_amount} onChange={(event) => setSaleForm({ ...saleForm, cash_amount: event.target.value })} /></label>
            <label className="field field-dark">Transferencia<input type="number" value={saleForm.transfer_amount} onChange={(event) => setSaleForm({ ...saleForm, transfer_amount: event.target.value })} /></label>
            <label className="field field-dark">Tarjeta<input type="number" value={saleForm.card_amount} onChange={(event) => setSaleForm({ ...saleForm, card_amount: event.target.value })} /></label>
            <label className="field field-dark">Cuenta corriente<input type="number" value={saleForm.account_amount} onChange={(event) => setSaleForm({ ...saleForm, account_amount: event.target.value })} /></label>
          </div>
          <label className="field field-dark">Costo estimado<input type="number" value={saleForm.cost_estimate} onChange={(event) => setSaleForm({ ...saleForm, cost_estimate: event.target.value })} /></label>
          <button className="btn btn-primary justify-center" type="submit"><Plus size={18} />Guardar venta</button>
        </form>

        <form onSubmit={submitSupplier} className="control-card">
          <h4><Truck size={20} /> Proveedor</h4>
          <label className="field field-dark">Nombre<input value={supplierForm.name} onChange={(event) => setSupplierForm({ ...supplierForm, name: event.target.value })} /></label>
          <label className="field field-dark">Contacto<input value={supplierForm.contact} onChange={(event) => setSupplierForm({ ...supplierForm, contact: event.target.value })} /></label>
          <label className="field field-dark">Telefono<input value={supplierForm.phone} onChange={(event) => setSupplierForm({ ...supplierForm, phone: event.target.value })} /></label>
          <button className="btn btn-primary justify-center" type="submit"><Plus size={18} />Agregar proveedor</button>
        </form>

        <form onSubmit={submitPurchase} className="control-card">
          <h4><HandCoins size={20} /> Compra a proveedor</h4>
          <label className="field field-dark">Proveedor<select value={purchaseForm.supplier_id} onChange={(event) => setPurchaseForm({ ...purchaseForm, supplier_id: event.target.value })}>{data.suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}</select></label>
          <label className="field field-dark">Descripcion<input value={purchaseForm.description} onChange={(event) => setPurchaseForm({ ...purchaseForm, description: event.target.value })} /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="field field-dark">Total<input type="number" value={purchaseForm.total_amount} onChange={(event) => setPurchaseForm({ ...purchaseForm, total_amount: event.target.value })} /></label>
            <label className="field field-dark">Pagado<input type="number" value={purchaseForm.paid_amount} onChange={(event) => setPurchaseForm({ ...purchaseForm, paid_amount: event.target.value })} /></label>
          </div>
          <label className="field field-dark">Vence<input type="date" value={purchaseForm.due_date} onChange={(event) => setPurchaseForm({ ...purchaseForm, due_date: event.target.value })} /></label>
          <button className="btn btn-primary justify-center" type="submit"><Plus size={18} />Registrar compra</button>
        </form>

        <form onSubmit={submitPayment} className="control-card">
          <h4><CalendarClock size={20} /> Saldar cuenta</h4>
          <label className="field field-dark">Compra<select value={paymentForm.purchase_id} onChange={(event) => setPaymentForm({ ...paymentForm, purchase_id: event.target.value })}>{openPurchases.map((purchase) => <option key={purchase.id} value={purchase.id}>{purchase.suppliers?.name || "Proveedor"} - saldo {money(Number(purchase.total_amount) - Number(purchase.paid_amount))}</option>)}</select></label>
          <label className="field field-dark">Monto<input type="number" value={paymentForm.amount} onChange={(event) => setPaymentForm({ ...paymentForm, amount: event.target.value })} /></label>
          <button className="btn btn-primary justify-center" type="submit"><Plus size={18} />Registrar pago</button>
        </form>
      </div>

      <form onSubmit={submitMonthlyCost} className="control-card">
        <h4><CircleDollarSign size={20} /> Costos fijos y break even</h4>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="field field-dark">Mes<input type="month" value={monthlyCostForm.month} onChange={(event) => setMonthlyCostForm({ ...monthlyCostForm, month: event.target.value })} /></label>
          <label className="field field-dark">Alquiler<input type="number" value={monthlyCostForm.rent_amount} onChange={(event) => setMonthlyCostForm({ ...monthlyCostForm, rent_amount: event.target.value })} /></label>
          <label className="field field-dark">Sueldos mensuales<input type="number" value={monthlyCostForm.salaries_amount} onChange={(event) => setMonthlyCostForm({ ...monthlyCostForm, salaries_amount: event.target.value })} /></label>
          <label className="field field-dark">Servicios<input type="number" value={monthlyCostForm.services_amount} onChange={(event) => setMonthlyCostForm({ ...monthlyCostForm, services_amount: event.target.value })} /></label>
          <label className="field field-dark">Impuestos<input type="number" value={monthlyCostForm.taxes_amount} onChange={(event) => setMonthlyCostForm({ ...monthlyCostForm, taxes_amount: event.target.value })} /></label>
          <label className="field field-dark">Pagos deuda<input type="number" value={monthlyCostForm.debt_payments_amount} onChange={(event) => setMonthlyCostForm({ ...monthlyCostForm, debt_payments_amount: event.target.value })} /></label>
          <label className="field field-dark">Otros fijos<input type="number" value={monthlyCostForm.other_fixed_costs} onChange={(event) => setMonthlyCostForm({ ...monthlyCostForm, other_fixed_costs: event.target.value })} /></label>
          <label className="field field-dark">Margen objetivo %<input type="number" value={monthlyCostForm.target_margin_percent} onChange={(event) => setMonthlyCostForm({ ...monthlyCostForm, target_margin_percent: event.target.value })} /></label>
        </div>
        <div className="break-even-box">
          <span>Costos fijos: {money(metrics.monthlyFixedCosts)}</span>
          <span>Venta mensual objetivo: {money(metrics.breakEvenMonthlySales)}</span>
          <strong>Venta diaria objetivo: {money(metrics.breakEvenDailySales)}</strong>
        </div>
        <button className="btn btn-primary justify-center" type="submit"><Plus size={18} />Guardar costos</button>
      </form>

      <div className="finance-grid-secondary">
        <section className="control-card">
          <h4><Bot size={20} /> Asistente contador</h4>
          <div className="assistant-notes">
            {insights.map((insight) => <p key={insight}>{insight}</p>)}
          </div>
        </section>
        <section className="control-card">
          <h4>Resumen por proveedor</h4>
          <div className="finance-list">
            {supplierSummary.slice(0, 8).map((item) => (
              <div key={item.supplier.id}>
                <strong>{item.supplier.name}</strong>
                <span>Comprado {money(item.total)} - pagado {money(item.paid)} - saldo {money(item.balance)}</span>
              </div>
            ))}
            {!supplierSummary.length && <p className="text-sm text-white/60">Todavia no hay compras registradas.</p>}
          </div>
        </section>
      </div>

      <section className="control-card">
        <div className="finance-table-top">
          <h4>Cuentas corrientes y vencimientos</h4>
          <div className="finance-filters">
            {[
              ["open", "Abiertas"],
              ["overdue", "Vencidas"],
              ["due-soon", "Vencen 7 dias"],
              ["partial", "Parciales"],
              ["paid", "Pagadas"],
              ["all", "Todas"]
            ].map(([id, label]) => (
              <button key={id} type="button" className={accountFilter === id ? "is-active" : ""} onClick={() => setAccountFilter(id)}>
                {label}
              </button>
            ))}
            <select value={supplierFilter} onChange={(event) => setSupplierFilter(event.target.value)}>
              <option value="all">Todos los proveedores</option>
              {data.suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="finance-table">
          <div className="finance-table-row finance-table-head">
            <span>Fecha</span>
            <span>Proveedor</span>
            <span>Detalle</span>
            <span>Total</span>
            <span>Pagado</span>
            <span>Saldo</span>
            <span>Vence</span>
            <span>Pago rapido</span>
          </div>
          {filteredPurchases.map((purchase) => {
            const balance = getPurchaseBalance(purchase);
            const status = getPurchaseStatus(purchase);
            return (
              <div key={purchase.id} className={`finance-table-row status-${status}`}>
                <span>{purchase.purchase_date}</span>
                <strong>{purchase.suppliers?.name || "Proveedor"}</strong>
                <span>{purchase.description || "-"}</span>
                <span>{money(purchase.total_amount)}</span>
                <span>{money(purchase.paid_amount)}</span>
                <strong>{money(balance)}</strong>
                <span>{purchase.due_date || "-"}</span>
                <div className="finance-quick-pay">
                  <input
                    type="number"
                    value={quickPayments[purchase.id] || ""}
                    placeholder="Monto"
                    onChange={(event) => setQuickPayments((current) => ({ ...current, [purchase.id]: event.target.value }))}
                  />
                  <button type="button" onClick={() => submitQuickPayment(purchase)}>Pagar</button>
                </div>
              </div>
            );
          })}
          {!filteredPurchases.length && <div className="inventory-empty">No hay movimientos para ese filtro.</div>}
        </div>
      </section>
    </div>
  );
}
