import { CheckCircle2, CircleDollarSign, RefreshCcw, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getFinanceData, today, upsertDailySale } from "../lib/finance";

const money = (value) => `$${Number(value || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

const emptySale = {
  sale_date: today(),
  cash_amount: "",
  transfer_amount: "",
  card_amount: "",
  account_amount: "",
  other_income: "",
  cost_estimate: "",
  salary_expense: "",
  other_expense: "",
  expense_notes: "",
  notes: ""
};

export default function DailyCashPanel() {
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState(emptySale);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getFinanceData();
      setSales(data.sales);
      const todaySale = data.sales.find((sale) => sale.sale_date === today());
      if (todaySale) {
        setForm({
          sale_date: todaySale.sale_date,
          cash_amount: todaySale.cash_amount || "",
          transfer_amount: todaySale.transfer_amount || "",
          card_amount: todaySale.card_amount || "",
          account_amount: todaySale.account_amount || "",
          other_income: todaySale.other_income || "",
          cost_estimate: todaySale.cost_estimate || "",
          salary_expense: todaySale.salary_expense || "",
          other_expense: todaySale.other_expense || "",
          expense_notes: todaySale.expense_notes || "",
          notes: todaySale.notes || ""
        });
      }
    } catch (error) {
      setNotice(`No se pudo cargar caja diaria: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const totals = useMemo(() => {
    const income =
      Number(form.cash_amount || 0) +
      Number(form.transfer_amount || 0) +
      Number(form.card_amount || 0) +
      Number(form.account_amount || 0) +
      Number(form.other_income || 0);
    const expenses = Number(form.salary_expense || 0) + Number(form.other_expense || 0);
    return { income, expenses, net: income - expenses };
  }, [form]);

  const submit = async (event) => {
    event.preventDefault();
    setNotice("");
    const saved = await upsertDailySale(form);
    setSales((current) => [saved, ...current.filter((sale) => sale.sale_date !== saved.sale_date)]);
    setNotice("Caja diaria guardada correctamente.");
  };

  return (
    <div className="daily-cash-panel">
      <div className="finance-top">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-reyred">Carga diaria</p>
          <h3>Ventas, ingresos y egresos del dia</h3>
        </div>
        <button type="button" onClick={refresh} className="btn btn-outline-light">
          <RefreshCcw size={18} />
          Actualizar
        </button>
      </div>

      {notice && <p className="admin-notice">{notice}</p>}

      <div className="grid gap-4 md:grid-cols-3">
        <article className="metric-card"><span>Ingresos del dia</span><strong>{money(totals.income)}</strong><p>ventas + otros ingresos</p></article>
        <article className="metric-card"><span>Egresos del dia</span><strong>{money(totals.expenses)}</strong><p>sueldos + gastos</p></article>
        <article className="metric-card"><span>Neto caja</span><strong>{money(totals.net)}</strong><p>{sales.some((sale) => sale.sale_date === today()) ? "Hoy cargado" : "Falta cargar hoy"}</p></article>
      </div>

      <div className="daily-cash-layout">
        <form onSubmit={submit} className="control-card">
          <h4><CircleDollarSign size={20} /> Cierre del dia</h4>
          <label className="field field-dark">Fecha<input type="date" value={form.sale_date} onChange={(event) => setForm({ ...form, sale_date: event.target.value })} /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="field field-dark">Efectivo<input type="number" value={form.cash_amount} onChange={(event) => setForm({ ...form, cash_amount: event.target.value })} /></label>
            <label className="field field-dark">Transferencia<input type="number" value={form.transfer_amount} onChange={(event) => setForm({ ...form, transfer_amount: event.target.value })} /></label>
            <label className="field field-dark">Tarjeta<input type="number" value={form.card_amount} onChange={(event) => setForm({ ...form, card_amount: event.target.value })} /></label>
            <label className="field field-dark">Cuenta corriente<input type="number" value={form.account_amount} onChange={(event) => setForm({ ...form, account_amount: event.target.value })} /></label>
            <label className="field field-dark">Otros ingresos<input type="number" value={form.other_income} onChange={(event) => setForm({ ...form, other_income: event.target.value })} /></label>
            <label className="field field-dark">Costo estimado<input type="number" value={form.cost_estimate} onChange={(event) => setForm({ ...form, cost_estimate: event.target.value })} /></label>
            <label className="field field-dark">Sueldos del dia<input type="number" value={form.salary_expense} onChange={(event) => setForm({ ...form, salary_expense: event.target.value })} /></label>
            <label className="field field-dark">Otros egresos<input type="number" value={form.other_expense} onChange={(event) => setForm({ ...form, other_expense: event.target.value })} /></label>
          </div>
          <label className="field field-dark">Detalle egresos<textarea value={form.expense_notes} onChange={(event) => setForm({ ...form, expense_notes: event.target.value })} /></label>
          <label className="field field-dark">Observaciones<textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
          <button className="btn btn-primary justify-center" type="submit">
            <Save size={18} />
            Guardar cierre
          </button>
        </form>

        <section className="control-card">
          <h4><CheckCircle2 size={20} /> Ultimos cierres</h4>
          <div className="finance-list">
            {loading && <p className="text-sm text-white/60">Cargando...</p>}
            {!loading && sales.slice(0, 10).map((sale) => {
              const income =
                Number(sale.cash_amount || 0) +
                Number(sale.transfer_amount || 0) +
                Number(sale.card_amount || 0) +
                Number(sale.account_amount || 0) +
                Number(sale.other_income || 0);
              const expenses = Number(sale.salary_expense || 0) + Number(sale.other_expense || 0);
              return (
                <div key={sale.id}>
                  <strong>{sale.sale_date}</strong>
                  <span>Ingresos {money(income)} - egresos {money(expenses)} - neto {money(income - expenses)}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
