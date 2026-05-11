import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FileText,
  History,
  MessageCircle,
  ShieldCheck,
  Star,
  Wrench
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  auditEvents,
  customerAccounts,
  internalTasks,
  ownerDashboard,
  quotePipeline,
  repairOrders,
  rolePermissions,
  smartStockAlerts
} from "../data/adminData";

const money = (value) =>
  Number(value || 0).toLocaleString("es-AR", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "ARS"
  });

const statusClass = (status) =>
  status.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

function PanelTitle({ icon: Icon, kicker, title, detail }) {
  return (
    <div className="ops-panel-title">
      <span>
        <Icon size={20} />
      </span>
      <div>
        <p>{kicker}</p>
        <h3>{title}</h3>
        {detail && <small>{detail}</small>}
      </div>
    </div>
  );
}

export function OwnerDashboardPanel() {
  return (
    <div className="grid gap-5">
      <PanelTitle
        icon={ShieldCheck}
        kicker="Vista de duenio"
        title="En 20 segundos sabes como esta ReyMaq"
        detail="Ventas, caja, margen, clientes, deudas y stock valorizado."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {ownerDashboard.today.map((metric) => (
          <article key={metric.label} className="metric-card">
            <span>Hoy - {metric.label}</span>
            <strong>{metric.value}</strong>
            <p>{metric.trend}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {ownerDashboard.month.map((metric) => (
          <article key={metric.label} className="control-card ops-kpi-card">
            <span>Este mes</span>
            <h4>{metric.value}</h4>
            <p>{metric.label}</p>
            <small>{metric.trend}</small>
          </article>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <QuickRank title="Productos top" items={ownerDashboard.topProducts} icon={Star} />
        <QuickRank title="Clientes top" items={ownerDashboard.topCustomers} icon={CreditCard} />
        <QuickRank title="Categorias fuertes" items={ownerDashboard.categories} icon={ClipboardList} />
      </div>
    </div>
  );
}

function QuickRank({ title, items, icon: Icon }) {
  return (
    <article className="control-card">
      <h4 className="flex items-center gap-2">
        <Icon className="text-reyred" size={20} />
        {title}
      </h4>
      <div className="ops-list">
        {items.map((item, index) => (
          <div key={item}>
            <strong>{index + 1}. {item}</strong>
            <span>Dato listo para conectar a ventas reales.</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export function SmartStockPanel() {
  return (
    <div className="grid gap-5">
      <PanelTitle
        icon={AlertTriangle}
        kicker="Alertas inteligentes"
        title="Stock que piensa antes de que falte plata"
        detail="Detecta bajo stock, productos quietos, margen bajo y costos que subieron."
      />
      <div className="ops-table">
        <div className="ops-table-row ops-table-head stock-alert-grid">
          <span>Producto</span>
          <span>Stock</span>
          <span>Estado</span>
          <span>Senal</span>
          <span>Accion</span>
        </div>
        {smartStockAlerts.map((item) => (
          <div key={item.product} className="ops-table-row stock-alert-grid">
            <strong>{item.product}</strong>
            <span>{item.stock}</span>
            <span className={`ops-status ops-status-${item.severity}`}>{item.status}</span>
            <span>{item.signal}</span>
            <button type="button">{item.action}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuotesPanel() {
  const [quotes, setQuotes] = useState(quotePipeline);
  const [draft, setDraft] = useState({
    customer: "",
    products: "",
    quantity: 1,
    discount: 0,
    amount: ""
  });

  const metrics = useMemo(() => {
    const total = quotes.length;
    const closed = quotes.filter((quote) => quote.status === "Aceptado").length;
    const openMoney = quotes
      .filter((quote) => ["Pendiente", "Vencido"].includes(quote.status))
      .reduce((sum, quote) => sum + quote.amount, 0);
    return { total, closed, openMoney };
  }, [quotes]);

  const addQuote = (event) => {
    event.preventDefault();
    if (!draft.customer || !draft.products || !draft.amount) return;
    const amount = Math.round(Number(draft.amount) * (1 - Number(draft.discount || 0) / 100));
    setQuotes((current) => [
      {
        id: `COT-${1043 + current.length}`,
        customer: draft.customer,
        products: `${draft.products} x${draft.quantity}`,
        amount,
        discount: Number(draft.discount || 0),
        status: "Pendiente"
      },
      ...current
    ]);
    setDraft({ customer: "", products: "", quantity: 1, discount: 0, amount: "" });
  };

  return (
    <div className="grid gap-5">
      <PanelTitle
        icon={FileText}
        kicker="Cotizaciones"
        title="Presupuestos rapidos para obra, talleres y clientes frecuentes"
        detail="Carga cliente, productos, descuento, total, estado y salida directa a WhatsApp."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <article className="metric-card">
          <span>Cotizaciones</span>
          <strong>{metrics.total}</strong>
          <p>En el tablero</p>
        </article>
        <article className="metric-card">
          <span>Cerradas</span>
          <strong>{metrics.closed}</strong>
          <p>{metrics.total ? Math.round((metrics.closed / metrics.total) * 100) : 0}% conversion</p>
        </article>
        <article className="metric-card">
          <span>Plata en el aire</span>
          <strong>{money(metrics.openMoney)}</strong>
          <p>Pendiente o vencida</p>
        </article>
      </div>

      <form onSubmit={addQuote} className="ops-form">
        <label className="field field-dark">
          Cliente
          <input value={draft.customer} onChange={(event) => setDraft({ ...draft, customer: event.target.value })} />
        </label>
        <label className="field field-dark">
          Productos
          <input value={draft.products} onChange={(event) => setDraft({ ...draft, products: event.target.value })} />
        </label>
        <label className="field field-dark">
          Cantidad
          <input type="number" value={draft.quantity} onChange={(event) => setDraft({ ...draft, quantity: event.target.value })} />
        </label>
        <label className="field field-dark">
          Descuento %
          <input type="number" value={draft.discount} onChange={(event) => setDraft({ ...draft, discount: event.target.value })} />
        </label>
        <label className="field field-dark">
          Total
          <input type="number" value={draft.amount} onChange={(event) => setDraft({ ...draft, amount: event.target.value })} />
        </label>
        <button type="submit" className="btn btn-primary">Crear</button>
      </form>

      <div className="ops-table">
        <div className="ops-table-row ops-table-head quote-grid">
          <span>ID</span>
          <span>Cliente</span>
          <span>Productos</span>
          <span>Total</span>
          <span>Estado</span>
          <span>WhatsApp</span>
        </div>
        {quotes.map((quote) => {
          const text = `Hola, te paso la cotizacion ${quote.id}: ${quote.products}. Total ${money(quote.amount)}.`;
          return (
            <div key={quote.id} className="ops-table-row quote-grid">
              <strong>{quote.id}</strong>
              <span>{quote.customer}</span>
              <span>{quote.products}</span>
              <span>{money(quote.amount)}</span>
              <select
                value={quote.status}
                onChange={(event) =>
                  setQuotes((current) =>
                    current.map((item) => (item.id === quote.id ? { ...item, status: event.target.value } : item))
                  )
                }
              >
                <option>Pendiente</option>
                <option>Aceptado</option>
                <option>Rechazado</option>
                <option>Vencido</option>
              </select>
              <a href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">
                <MessageCircle size={16} />
                Enviar
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CustomerAccountsPanel() {
  return (
    <SimpleTablePanel
      icon={CreditCard}
      kicker="Cuentas corrientes"
      title="Clientes que compran fiado bajo control"
      detail="Deuda actual, ultimo pago, limite, historial y bloqueo comercial."
      gridClass="account-grid"
      heads={["Cliente", "Deuda", "Ultimo pago", "Limite", "Historial", "Estado"]}
      rows={customerAccounts.map((account) => [
        account.customer,
        money(account.debt),
        account.lastPayment,
        money(account.creditLimit),
        account.history,
        account.status
      ])}
      alert="Juan Perez debe $84.500 hace 23 dias."
    />
  );
}

export function RepairsPanel() {
  return (
    <div className="grid gap-5">
      <PanelTitle
        icon={Wrench}
        kicker="Reparaciones"
        title="Ordenes de service con estado, sena y entrega"
        detail="Deja registro profesional de maquina, problema, repuestos, mano de obra y fotos."
      />
      <div className="grid gap-4 xl:grid-cols-3">
        {repairOrders.map((order) => (
          <article key={order.id} className="control-card repair-card">
            <div className="flex items-start justify-between gap-3">
              <span className="tag">{order.id}</span>
              <small>{order.dueDate}</small>
            </div>
            <h4>{order.machine}</h4>
            <p>{order.customer}</p>
            <span className={`ops-status ops-status-${statusClass(order.status)}`}>{order.status}</span>
            <div className="ops-list">
              <div><strong>Problema</strong><span>{order.problem}</span></div>
              <div><strong>Repuestos</strong><span>{money(order.partsCost)}</span></div>
              <div><strong>Mano de obra</strong><span>{money(order.labor)}</span></div>
              <div><strong>Total / sena</strong><span>{money(order.partsCost + order.labor)} / {money(order.deposit)}</span></div>
            </div>
            <button type="button" className="btn btn-outline-light mt-4">
              <CalendarClock size={18} />
              Actualizar estado
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

export function TasksPanel() {
  const [tasks, setTasks] = useState(internalTasks);

  return (
    <div className="grid gap-5">
      <PanelTitle
        icon={ClipboardList}
        kicker="Tareas internas"
        title="La ferreteria manejada como negocio, no como incendio"
        detail="Reponer, llamar, publicar, revisar precios, cargar productos y cobrar deudas."
      />
      <div className="grid gap-3">
        {tasks.map((task) => (
          <article key={task.task} className="task-row">
            <div>
              <strong>{task.task}</strong>
              <span>{task.owner} - Prioridad {task.priority}</span>
            </div>
            <select
              value={task.status}
              onChange={(event) =>
                setTasks((current) =>
                  current.map((item) => (item.task === task.task ? { ...item, status: event.target.value } : item))
                )
              }
            >
              <option>Pendiente</option>
              <option>En proceso</option>
              <option>Hecha</option>
            </select>
          </article>
        ))}
      </div>
    </div>
  );
}

export function AuditPanel() {
  return (
    <SimpleTablePanel
      icon={History}
      kicker="Auditoria"
      title="Registro de cambios sensibles"
      detail="Precio, stock, descuentos y movimientos importantes con empleado y fecha."
      gridClass="audit-grid"
      heads={["Empleado", "Accion", "Detalle", "Fecha"]}
      rows={auditEvents.map((event) => [event.employee, event.action, event.detail, event.date])}
    />
  );
}

export function RolesPanel() {
  return (
    <div className="grid gap-5">
      <PanelTitle
        icon={ShieldCheck}
        kicker="Roles y permisos"
        title="Cada persona ve lo que necesita para trabajar"
        detail="El vendedor no ve ganancias completas ni puede borrar productos."
      />
      <div className="grid gap-4 xl:grid-cols-5">
        {rolePermissions.map((role) => (
          <article key={role.role} className="control-card role-card">
            <CheckCircle2 className="text-reyred" size={24} />
            <h4>{role.role}</h4>
            <p>{role.access}</p>
            <strong>Puede</strong>
            <div className="ops-chip-list">
              {role.allowed.map((item) => <span key={item}>{item}</span>)}
            </div>
            {role.blocked.length > 0 && (
              <>
                <strong>Bloqueado</strong>
                <div className="ops-chip-list is-blocked">
                  {role.blocked.map((item) => <span key={item}>{item}</span>)}
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function SimpleTablePanel({ icon, kicker, title, detail, gridClass, heads, rows, alert }) {
  return (
    <div className="grid gap-5">
      <PanelTitle icon={icon} kicker={kicker} title={title} detail={detail} />
      {alert && (
        <div className="ops-alert">
          <AlertTriangle size={18} />
          {alert}
        </div>
      )}
      <div className="ops-table">
        <div className={`ops-table-row ops-table-head ${gridClass}`}>
          {heads.map((head) => <span key={head}>{head}</span>)}
        </div>
        {rows.map((row) => (
          <div key={row.join("-")} className={`ops-table-row ${gridClass}`}>
            {row.map((cell, index) =>
              index === 0 ? <strong key={cell}>{cell}</strong> : <span key={`${cell}-${index}`}>{cell}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
