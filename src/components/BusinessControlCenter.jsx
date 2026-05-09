import {
  BadgePercent,
  BarChart3,
  Boxes,
  CheckCircle2,
  ClipboardList,
  Headphones,
  Lock,
  Plus,
  Search,
  ShieldCheck,
  UsersRound
} from "lucide-react";
import { useMemo, useState } from "react";
import { crmInquiries, employees, promoItems, salesMetrics, stockItems } from "../data/adminData";
import { categories } from "../data/categories";
import SectionHeader from "./SectionHeader";

const tabs = [
  { id: "stock", label: "Stock", icon: Boxes },
  { id: "crm", label: "CRM", icon: Headphones },
  { id: "promos", label: "Promos", icon: BadgePercent },
  { id: "reports", label: "Reportes", icon: BarChart3 },
  { id: "employees", label: "Empleados", icon: UsersRound }
];

const initialProduct = {
  product: "",
  category: categories[0]?.title || "General",
  stock: "",
  minStock: ""
};

export default function BusinessControlCenter() {
  const [activeTab, setActiveTab] = useState("stock");
  const [stock, setStock] = useState(stockItems);
  const [inquiries, setInquiries] = useState(crmInquiries);
  const [promos, setPromos] = useState(promoItems);
  const [productForm, setProductForm] = useState(initialProduct);
  const [search, setSearch] = useState("");

  const filteredStock = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return stock;
    return stock.filter((item) =>
      [item.sku, item.product, item.category, item.status].join(" ").toLowerCase().includes(term)
    );
  }, [search, stock]);

  const addStockItem = (event) => {
    event.preventDefault();
    if (!productForm.product.trim()) return;

    const nextStock = Number(productForm.stock || 0);
    const nextMinStock = Number(productForm.minStock || 0);

    setStock((current) => [
      {
        sku: `RM-${String(current.length + 1).padStart(4, "0")}`,
        product: productForm.product,
        category: productForm.category,
        stock: nextStock,
        minStock: nextMinStock,
        status: nextStock === 0 ? "Reponer" : nextStock <= nextMinStock ? "Bajo stock" : "Disponible"
      },
      ...current
    ]);
    setProductForm(initialProduct);
  };

  const updateInquiryStatus = (id, status) => {
    setInquiries((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const addPromo = () => {
    setPromos((current) => [
      {
        title: "Nueva promoción",
        channel: "Web",
        status: "Borrador",
        detail: "Editar productos, vigencia, imagen y condiciones."
      },
      ...current
    ]);
  };

  return (
    <section id="gestion" className="section bg-graphite text-white">
      <div className="container">
        <SectionHeader
          eyebrow="Control del negocio"
          title="Panel operativo ReyMaq"
          description="Primera versión visual y funcional para controlar stock, consultas, promociones, reportes y usuarios. Lista para conectar a backend, login real y base de datos."
          dark
        />

        <div className="control-shell">
          <div className="control-topbar">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center bg-reyred">
                <ShieldCheck size={22} />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-reyred">Modo demo admin</p>
                <h3 className="font-display text-2xl font-black">Gestión integral</h3>
              </div>
            </div>
            <div className="flex items-center gap-2 border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-black text-white/75">
              <Lock size={17} />
              Login real preparado
            </div>
          </div>

          <div className="control-tabs" role="tablist" aria-label="Panel de gestión">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`control-tab ${activeTab === id ? "control-tab-active" : ""}`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>

          <div className="control-content">
            {activeTab === "stock" && (
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <form onSubmit={addStockItem} className="control-card">
                  <h4>Alta rápida de producto</h4>
                  <label className="field field-dark">
                    Producto
                    <input
                      value={productForm.product}
                      onChange={(event) => setProductForm({ ...productForm, product: event.target.value })}
                      placeholder="Ej: Amoladora, cable, pintura"
                    />
                  </label>
                  <label className="field field-dark">
                    Categoría
                    <select
                      value={productForm.category}
                      onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}
                    >
                      {categories.map((category) => (
                        <option key={category.title}>{category.title}</option>
                      ))}
                    </select>
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="field field-dark">
                      Stock
                      <input
                        type="number"
                        min="0"
                        value={productForm.stock}
                        onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })}
                        placeholder="0"
                      />
                    </label>
                    <label className="field field-dark">
                      Mínimo
                      <input
                        type="number"
                        min="0"
                        value={productForm.minStock}
                        onChange={(event) => setProductForm({ ...productForm, minStock: event.target.value })}
                        placeholder="0"
                      />
                    </label>
                  </div>
                  <button type="submit" className="btn btn-primary justify-center">
                    <Plus size={18} />
                    Agregar producto
                  </button>
                </form>

                <div className="control-card">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45" size={18} />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      className="admin-search"
                      placeholder="Buscar producto, SKU o categoría"
                    />
                  </div>
                  <div className="admin-table mt-4">
                    {filteredStock.map((item) => (
                      <div key={item.sku} className="admin-table-row">
                        <div>
                          <strong>{item.product}</strong>
                          <span>{item.sku} · {item.category}</span>
                        </div>
                        <div className="text-right">
                          <strong>{item.stock}</strong>
                          <span className={item.status === "Disponible" ? "ok-text" : "alert-text"}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "crm" && (
              <div className="grid gap-4">
                {inquiries.map((item) => (
                  <article key={item.id} className="crm-row">
                    <div>
                      <span>{item.id} · {item.source}</span>
                      <h4>{item.customer}</h4>
                      <p>{item.need}</p>
                    </div>
                    <select value={item.status} onChange={(event) => updateInquiryStatus(item.id, event.target.value)}>
                      <option>Nuevo</option>
                      <option>En seguimiento</option>
                      <option>Cotizado</option>
                      <option>Ganado</option>
                      <option>Perdido</option>
                    </select>
                  </article>
                ))}
              </div>
            )}

            {activeTab === "promos" && (
              <div>
                <button type="button" onClick={addPromo} className="btn btn-primary mb-5">
                  <Plus size={18} />
                  Crear promoción
                </button>
                <div className="grid gap-4 lg:grid-cols-3">
                  {promos.map((promo, index) => (
                    <article key={`${promo.title}-${index}`} className="control-card">
                      <span className="tag">{promo.status}</span>
                      <h4 className="mt-5">{promo.title}</h4>
                      <p className="mt-3 text-sm leading-6 text-white/65">{promo.detail}</p>
                      <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-reyred">{promo.channel}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reports" && (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {salesMetrics.map((metric) => (
                  <article key={metric.label} className="metric-card">
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                    <p>{metric.trend}</p>
                  </article>
                ))}
              </div>
            )}

            {activeTab === "employees" && (
              <div className="grid gap-4 lg:grid-cols-3">
                {employees.map((employee) => (
                  <article key={employee.name} className="control-card">
                    <UsersRound className="text-reyred" size={28} />
                    <h4 className="mt-5">{employee.name}</h4>
                    <p className="mt-2 text-sm text-white/65">{employee.role}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-white/55">
                        {employee.access}
                      </span>
                      <span className="inline-flex items-center gap-2 text-xs font-black text-reyred">
                        <CheckCircle2 size={15} />
                        {employee.status}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
