import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FileDown,
  FileText,
  History,
  MessageCircle,
  Plus,
  Printer,
  ShieldCheck,
  Star,
  Trash2,
  Wrench
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import {
  applyQuoteStockMovement,
  createQuote,
  getAuditEvents,
  getCustomerAccounts,
  getInternalTasks,
  getQuotes,
  getRepairOrders,
  updateQuoteStatus,
  updateTaskStatus
} from "../lib/operations";
import { getAdminProducts } from "../lib/products";

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
  const [products, setProducts] = useState([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState(quotePipeline[0]?.id || "");
  const [notice, setNotice] = useState("");
  const [draft, setDraft] = useState({
    customer: "",
    customerPhone: "",
    discount: 0,
    notes: "",
    items: [{ productId: "", product: "", quantity: 1, unitPrice: "", discount: 0 }]
  });

  useEffect(() => {
    getQuotes()
      .then((items) => {
        if (!items.length) return;
        setQuotes(items);
        setSelectedQuoteId(items[0].id);
        setNotice("Cotizaciones conectadas a Supabase.");
      })
      .catch(() => setNotice("Modo demo: crea las tablas de Supabase para guardar cotizaciones reales."));
  }, []);

  useEffect(() => {
    getAdminProducts()
      .then(setProducts)
      .catch(() => setNotice("No pude cargar el stock para seleccionar productos."));
  }, []);

  const metrics = useMemo(() => {
    const total = quotes.length;
    const closed = quotes.filter((quote) => ["Aceptado", "Pagado"].includes(quote.status)).length;
    const openMoney = quotes
      .filter((quote) => ["Pendiente", "Vencido"].includes(quote.status))
      .reduce((sum, quote) => sum + quote.amount, 0);
    return { total, closed, openMoney };
  }, [quotes]);

  const selectedQuote = quotes.find((quote) => quote.id === selectedQuoteId) || quotes[0];
  const draftSubtotal = draft.items.reduce(
    (sum, item) => sum + Number(item.unitPrice || 0) * Number(item.quantity || 0),
    0
  );
  const draftTotal = Math.max(0, Math.round(draftSubtotal * (1 - Number(draft.discount || 0) / 100)));

  const patchDraftItem = (index, patch) => {
    setDraft((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item))
    }));
  };

  const addDraftItem = () => {
    setDraft((current) => ({
      ...current,
      items: [...current.items, { productId: "", product: "", quantity: 1, unitPrice: "", discount: 0 }]
    }));
  };

  const removeDraftItem = (index) => {
    setDraft((current) => ({
      ...current,
      items: current.items.length === 1 ? current.items : current.items.filter((_item, itemIndex) => itemIndex !== index)
    }));
  };

  const addQuote = async (event) => {
    event.preventDefault();
    const cleanItems = draft.items.filter((item) => item.product && Number(item.quantity) > 0);
    if (!draft.customer || !cleanItems.length) return;

    const localQuote = {
      id: `COT-${1043 + quotes.length}`,
      customer: draft.customer,
      customerPhone: draft.customerPhone,
      products: cleanItems.map((item) => `${item.product} x${item.quantity}`).join(", "),
      items: cleanItems.map((item) => {
        const subtotal = Number(item.unitPrice || 0) * Number(item.quantity || 0);
        return {
          ...item,
          productId: item.productId || "",
          unitPrice: Number(item.unitPrice || 0),
          quantity: Number(item.quantity || 0),
          discount: Number(item.discount || 0),
          total: Math.max(0, Math.round(subtotal * (1 - Number(item.discount || 0) / 100)))
        };
      }),
      subtotal: draftSubtotal,
      amount: draftTotal,
      discount: Number(draft.discount || 0),
      notes: draft.notes,
      status: "Pendiente"
    };

    try {
      const saved = await createQuote({
        customer: draft.customer,
        customerPhone: draft.customerPhone,
        items: cleanItems,
        discount: draft.discount,
        notes: draft.notes
      });
      setQuotes((current) => [saved, ...current]);
      setSelectedQuoteId(saved.id);
      setNotice("Cotizacion guardada en Supabase.");
    } catch (_error) {
      setQuotes((current) => [localQuote, ...current]);
      setSelectedQuoteId(localQuote.id);
      setNotice("Cotizacion creada en modo demo. Crea las tablas para guardarla en Supabase.");
    }

    setDraft({
      customer: "",
      customerPhone: "",
      discount: 0,
      notes: "",
      items: [{ productId: "", product: "", quantity: 1, unitPrice: "", discount: 0 }]
    });
  };

  const setQuoteStatus = async (quote, status) => {
    setQuotes((current) => current.map((item) => (item.id === quote.id ? { ...item, status } : item)));
    if (!quote.dbId) return;
    try {
      await updateQuoteStatus(quote.dbId, status);
    } catch (_error) {
      setNotice("No se pudo actualizar en Supabase. Revisa la tabla quotes.");
    }
  };

  const selectProductForItem = (index, productId) => {
    const product = products.find((item) => item.id === productId);
    if (!product) {
      patchDraftItem(index, { productId: "", product: "", unitPrice: "" });
      return;
    }

    patchDraftItem(index, {
      productId: product.id,
      product: product.name,
      unitPrice: product.salePrice || product.cashPrice || 0
    });
  };

  const markQuotePaid = async (quote) => {
    try {
      const paidQuote = await applyQuoteStockMovement(quote);
      setQuotes((current) => current.map((item) => (item.id === quote.id ? paidQuote : item)));
      setNotice("Cotizacion marcada como pagada y stock descontado.");
    } catch (error) {
      setNotice(`No pude descontar stock: ${error.message}`);
    }
  };

  const printQuote = (quote) => {
    setSelectedQuoteId(quote.id);
    setTimeout(() => window.print(), 80);
  };

  return (
    <div className="grid gap-5">
      <PanelTitle
        icon={FileText}
        kicker="Cotizaciones"
        title="Presupuestos rapidos para obra, talleres y clientes frecuentes"
        detail="Carga cliente, productos, descuento, total, estado y salida directa a WhatsApp."
      />
      {notice && <p className="admin-notice">{notice}</p>}

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
          WhatsApp
          <input value={draft.customerPhone} onChange={(event) => setDraft({ ...draft, customerPhone: event.target.value })} />
        </label>
        <label className="field field-dark">
          Descuento general %
          <input type="number" value={draft.discount} onChange={(event) => setDraft({ ...draft, discount: event.target.value })} />
        </label>
        <label className="field field-dark">
          Notas
          <input value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} />
        </label>
        <div className="quote-draft-total">
          <span>Total</span>
          <strong>{money(draftTotal)}</strong>
        </div>
        <button type="submit" className="btn btn-primary">Crear</button>
      </form>

      <div className="quote-items-builder">
        {draft.items.map((item, index) => (
          <div key={`draft-item-${index}`} className="quote-item-row">
            <label className="field field-dark">
              Producto de stock
              <select value={item.productId} onChange={(event) => selectProductForItem(index, event.target.value)}>
                <option value="">Escribir manualmente</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - stock {product.stockQuantity} - ${product.salePrice}
                  </option>
                ))}
              </select>
            </label>
            <label className="field field-dark">
              Producto
              <input value={item.product} onChange={(event) => patchDraftItem(index, { product: event.target.value, productId: "" })} />
            </label>
            <label className="field field-dark">
              Cantidad
              <input type="number" value={item.quantity} onChange={(event) => patchDraftItem(index, { quantity: event.target.value })} />
            </label>
            <label className="field field-dark">
              Precio unitario
              <input type="number" value={item.unitPrice} onChange={(event) => patchDraftItem(index, { unitPrice: event.target.value })} />
            </label>
            <label className="field field-dark">
              Desc. item %
              <input type="number" value={item.discount} onChange={(event) => patchDraftItem(index, { discount: event.target.value })} />
            </label>
            <button type="button" onClick={() => removeDraftItem(index)} className="icon-action" aria-label="Quitar producto">
              <Trash2 size={17} />
            </button>
          </div>
        ))}
        <button type="button" onClick={addDraftItem} className="btn btn-outline-light w-fit">
          <Plus size={18} />
          Agregar producto
        </button>
      </div>

      {selectedQuote && (
        <div className="quote-preview-shell">
          <div className="quote-preview-actions">
            <div>
              <span>Vista imprimible</span>
              <strong>{selectedQuote.id} - {selectedQuote.customer}</strong>
            </div>
            <button type="button" onClick={() => printQuote(selectedQuote)} className="btn btn-light">
              <Printer size={18} />
              Imprimir / PDF
            </button>
          </div>
          <QuoteDocument quote={selectedQuote} />
        </div>
      )}

      <div className="ops-table">
        <div className="ops-table-row ops-table-head quote-grid">
          <span>ID</span>
          <span>Cliente</span>
          <span>Productos</span>
          <span>Total</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>
        {quotes.map((quote) => {
          const text = `Hola, te paso la cotizacion ${quote.id}: ${quote.products}. Total ${money(quote.amount)}.`;
          return (
            <div key={quote.id} className={`ops-table-row quote-grid ${selectedQuote?.id === quote.id ? "is-selected" : ""}`}>
              <button type="button" onClick={() => setSelectedQuoteId(quote.id)}>{quote.id}</button>
              <span>{quote.customer}</span>
              <span>{quote.products}</span>
              <span>{money(quote.amount)}</span>
              <select
                value={quote.status}
                onChange={(event) => {
                  const nextStatus = event.target.value;
                  if (nextStatus === "Pagado") {
                    markQuotePaid(quote);
                    return;
                  }
                  setQuoteStatus(quote, nextStatus);
                }}
              >
                <option>Pendiente</option>
                <option>Aceptado</option>
                <option>Pagado</option>
                <option>Rechazado</option>
                <option>Vencido</option>
              </select>
              <div className="quote-actions">
                <a href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">
                  <MessageCircle size={16} />
                  Enviar
                </a>
                <button type="button" onClick={() => printQuote(quote)}>
                  <FileDown size={16} />
                  PDF
                </button>
                <button type="button" onClick={() => markQuotePaid(quote)} disabled={quote.stockApplied}>
                  {quote.stockApplied ? "Stock OK" : "Pagado"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setNotice("ARCA preparado: falta cargar CUIT, punto de venta y certificado WSAA para emitir CAE real.")
                  }
                >
                  ARCA
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuoteDocument({ quote }) {
  const items = quote.items?.length
    ? quote.items
    : [{ product: quote.products, quantity: 1, unitPrice: quote.amount, discount: quote.discount || 0, total: quote.amount }];
  const subtotal = quote.subtotal || items.reduce((sum, item) => sum + Number(item.unitPrice || 0) * Number(item.quantity || 0), 0);
  const total = quote.amount || subtotal;

  return (
    <article className="quote-document" id="quote-print-area">
      <header className="quote-document-head">
        <div className="quote-brand">
          <div className="quote-logo-placeholder">RM</div>
          <div>
            <strong>ReyMaq</strong>
            <span>Ferreteria, herramientas y maquinas</span>
          </div>
        </div>
        <div className="quote-document-meta">
          <span>Presupuesto</span>
          <strong>{quote.id}</strong>
          <small>{new Date().toLocaleDateString("es-AR")}</small>
        </div>
      </header>

      <section className="quote-client-box">
        <div>
          <span>Cliente</span>
          <strong>{quote.customer}</strong>
          {quote.customerPhone && <small>WhatsApp: {quote.customerPhone}</small>}
        </div>
        <div>
          <span>Estado</span>
          <strong>{quote.status}</strong>
          <small>Validez sugerida: 7 dias</small>
        </div>
      </section>

      <div className="quote-print-table">
        <div className="quote-print-row quote-print-head">
          <span>Producto</span>
          <span>Cant.</span>
          <span>Unitario</span>
          <span>Desc.</span>
          <span>Total</span>
        </div>
        {items.map((item, index) => {
          const lineSubtotal = Number(item.unitPrice || 0) * Number(item.quantity || 0);
          const lineTotal = item.total || Math.max(0, Math.round(lineSubtotal * (1 - Number(item.discount || 0) / 100)));
          return (
            <div key={`${item.product}-${index}`} className="quote-print-row">
              <strong>{item.product}</strong>
              <span>{item.quantity}</span>
              <span>{money(item.unitPrice)}</span>
              <span>{Number(item.discount || 0)}%</span>
              <span>{money(lineTotal)}</span>
            </div>
          );
        })}
      </div>

      <footer className="quote-document-footer">
        <p>{quote.notes || "Precios sujetos a disponibilidad de stock y confirmacion al momento de la compra."}</p>
        <div>
          <span>Subtotal {money(subtotal)}</span>
          <span>Descuento {Number(quote.discount || 0)}%</span>
          <strong>Total {money(total)}</strong>
        </div>
      </footer>
    </article>
  );
}

export function CustomerAccountsPanel() {
  const [accounts, setAccounts] = useState(customerAccounts);

  useEffect(() => {
    getCustomerAccounts()
      .then((items) => {
        if (items.length) setAccounts(items);
      })
      .catch(() => {});
  }, []);

  return (
    <SimpleTablePanel
      icon={CreditCard}
      kicker="Cuentas corrientes"
      title="Clientes que compran fiado bajo control"
      detail="Deuda actual, ultimo pago, limite, historial y bloqueo comercial."
      gridClass="account-grid"
      heads={["Cliente", "Deuda", "Ultimo pago", "Limite", "Historial", "Estado"]}
      rows={accounts.map((account) => [
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
  const [orders, setOrders] = useState(repairOrders);

  useEffect(() => {
    getRepairOrders()
      .then((items) => {
        if (items.length) setOrders(items);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="grid gap-5">
      <PanelTitle
        icon={Wrench}
        kicker="Reparaciones"
        title="Ordenes de service con estado, sena y entrega"
        detail="Deja registro profesional de maquina, problema, repuestos, mano de obra y fotos."
      />
      <div className="grid gap-4 xl:grid-cols-3">
        {orders.map((order) => (
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

  useEffect(() => {
    getInternalTasks()
      .then((items) => {
        if (items.length) setTasks(items);
      })
      .catch(() => {});
  }, []);

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
              onChange={(event) => {
                const nextStatus = event.target.value;
                setTasks((current) =>
                  current.map((item) => (item.task === task.task ? { ...item, status: nextStatus } : item))
                );
                if (task.dbId) updateTaskStatus(task.dbId, nextStatus).catch(() => {});
              }}
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
  const [events, setEvents] = useState(auditEvents);

  useEffect(() => {
    getAuditEvents()
      .then((items) => {
        if (items.length) setEvents(items);
      })
      .catch(() => {});
  }, []);

  return (
    <SimpleTablePanel
      icon={History}
      kicker="Auditoria"
      title="Registro de cambios sensibles"
      detail="Precio, stock, descuentos y movimientos importantes con empleado y fecha."
      gridClass="audit-grid"
      heads={["Empleado", "Accion", "Detalle", "Fecha"]}
      rows={events.map((event) => [event.employee, event.action, event.detail, event.date])}
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
