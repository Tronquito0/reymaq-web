import { Bot, CalendarClock, CircleDollarSign, HandCoins, Plus, RefreshCcw, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  createPurchase,
  createSupplier,
  createSupplierPayment,
  getFinanceData,
  today,
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

export default function BusinessFinancePanel() {
  const [data, setData] = useState({ suppliers: [], purchases: [], payments: [], sales: [] });
  const [supplierForm, setSupplierForm] = useState(emptySupplier);
  const [purchaseForm, setPurchaseForm] = useState(emptyPurchase);
  const [paymentForm, setPaymentForm] = useState(emptyPayment);
  const [saleForm, setSaleForm] = useState(emptySale);
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

  const metrics = useMemo(() => {
    const totalSales = data.sales.reduce(
      (sum, sale) =>
        sum +
        Number(sale.cash_amount || 0) +
        Number(sale.transfer_amount || 0) +
        Number(sale.card_amount || 0) +
        Number(sale.account_amount || 0),
      0
    );
    const totalCosts = data.sales.reduce((sum, sale) => sum + Number(sale.cost_estimate || 0), 0);
    const debt = openPurchases.reduce(
      (sum, purchase) => sum + Math.max(0, Number(purchase.total_amount || 0) - Number(purchase.paid_amount || 0)),
      0
    );
    const averageDailySale = data.sales.length ? totalSales / data.sales.length : 0;
    const grossProfit = totalSales - totalCosts;
    const margin = totalSales ? (grossProfit / totalSales) * 100 : 0;
    return { totalSales, totalCosts, debt, averageDailySale, grossProfit, margin };
  }, [data.sales, openPurchases]);

  const insights = useMemo(() => {
    const items = [];
    if (metrics.debt > metrics.averageDailySale * 7 && metrics.averageDailySale > 0) {
      items.push("La deuda con proveedores supera una semana promedio de ventas. Priorizaria saldar vencimientos antes de comprar fuerte.");
    }
    if (metrics.margin < 25 && metrics.totalSales > 0) {
      items.push("El margen bruto estimado esta bajo. Revisaria precios de venta y productos con mayor rotacion antes de invertir.");
    }
    if (metrics.averageDailySale > 0) {
      items.push(`Con venta diaria promedio de ${money(metrics.averageDailySale)}, una compra prudente seria reinvertir entre ${money(metrics.averageDailySale * 2)} y ${money(metrics.averageDailySale * 4)} segun stock.`);
    }
    if (openPurchases.length > 0) {
      items.push("Hay cuentas corrientes abiertas. Conviene registrar pagos parciales para saber caja real disponible.");
    }
    if (items.length === 0) {
      items.push("Carga ventas y compras para que el asistente empiece a recomendar compras, pagos y reposicion.");
    }
    return items;
  }, [metrics, openPurchases.length]);

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

  const submitSale = async (event) => {
    event.preventDefault();
    const sale = await upsertDailySale(saleForm);
    setData((current) => ({
      ...current,
      sales: [sale, ...current.sales.filter((item) => item.id !== sale.id && item.sale_date !== sale.sale_date)]
    }));
    setSaleForm({ ...emptySale, sale_date: today() });
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
        <article className="metric-card"><span>Proveedores</span><strong>{data.suppliers.length}</strong><p>{data.purchases.length} compras registradas</p></article>
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

      <div className="finance-grid-secondary">
        <section className="control-card">
          <h4><Bot size={20} /> Asistente contador</h4>
          <div className="assistant-notes">
            {insights.map((insight) => <p key={insight}>{insight}</p>)}
          </div>
        </section>
        <section className="control-card">
          <h4>Cuentas abiertas</h4>
          <div className="finance-list">
            {openPurchases.slice(0, 8).map((purchase) => (
              <div key={purchase.id}>
                <strong>{purchase.suppliers?.name || "Proveedor"}</strong>
                <span>{purchase.description || "Compra"} - vence {purchase.due_date || "sin fecha"} - saldo {money(Number(purchase.total_amount) - Number(purchase.paid_amount))}</span>
              </div>
            ))}
            {!openPurchases.length && <p className="text-sm text-white/60">No hay cuentas abiertas.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
