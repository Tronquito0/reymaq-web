import {
  BadgePercent,
  BarChart3,
  Boxes,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  FileText,
  Headphones,
  History,
  KeyRound,
  Lock,
  Plus,
  ScanLine,
  ShieldCheck,
  TriangleAlert,
  UsersRound,
  Wrench
} from "lucide-react";
import { useState } from "react";
import { crmInquiries, employees, promoItems, salesMetrics } from "../data/adminData";
import AttendancePanel from "./AttendancePanel";
import BusinessFinancePanel from "./BusinessFinancePanel";
import DailyCashPanel from "./DailyCashPanel";
import EmployeeAccessPanel from "./EmployeeAccessPanel";
import {
  AuditPanel,
  CustomerAccountsPanel,
  OwnerDashboardPanel,
  QuotesPanel,
  RepairsPanel,
  RolesPanel,
  SmartStockPanel,
  TasksPanel
} from "./OperationsPanels";
import ProductAdminPanel from "./ProductAdminPanel";
import SectionHeader from "./SectionHeader";
import SupplierReceiptPanel from "./SupplierReceiptPanel";

const tabs = [
  { id: "owner-dashboard", label: "Duenio", icon: BriefcaseBusiness },
  { id: "stock", label: "Stock", icon: Boxes },
  { id: "stock-alerts", label: "Alertas", icon: TriangleAlert },
  { id: "supplier-receipts", label: "Remitos", icon: ScanLine },
  { id: "quotes", label: "Cotizaciones", icon: FileText },
  { id: "accounts", label: "Ctas ctes", icon: CreditCard },
  { id: "repairs", label: "Reparaciones", icon: Wrench },
  { id: "tasks", label: "Tareas", icon: ClipboardList },
  { id: "daily-cash", label: "Carga diaria", icon: ClipboardCheck },
  { id: "finance", label: "Finanzas", icon: CircleDollarSign },
  { id: "attendance", label: "Presentismo", icon: CheckCircle2 },
  { id: "crm", label: "CRM", icon: Headphones },
  { id: "promos", label: "Promos", icon: BadgePercent },
  { id: "reports", label: "Reportes", icon: BarChart3 },
  { id: "audit", label: "Auditoria", icon: History },
  { id: "access", label: "Accesos", icon: KeyRound },
  { id: "employees", label: "Empleados", icon: UsersRound },
  { id: "roles", label: "Roles", icon: ShieldCheck }
];

export default function BusinessControlCenter() {
  const [activeTab, setActiveTab] = useState("owner-dashboard");
  const [inquiries, setInquiries] = useState(crmInquiries);
  const [promos, setPromos] = useState(promoItems);

  const updateInquiryStatus = (id, status) => {
    setInquiries((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const addPromo = () => {
    setPromos((current) => [
      {
        title: "Nueva promocion",
        channel: "Web",
        status: "Borrador",
        detail: "Editar productos, vigencia, imagen y condiciones."
      },
      ...current
    ]);
  };

  return (
    <section id="gestion" className="section bg-graphite text-white">
      <div className="admin-container">
        <SectionHeader
          eyebrow="Control del negocio"
          title="Panel operativo ReyMaq"
          description="Panel conectado a Supabase para controlar productos, precios, stock, consultas, promociones, reportes y usuarios."
          dark
        />

        <div className="control-shell">
          <div className="control-topbar">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center bg-reyred">
                <ShieldCheck size={22} />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-reyred">Admin conectado</p>
                <h3 className="font-display text-2xl font-black">Gestion integral</h3>
              </div>
            </div>
            <div className="flex items-center gap-2 border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-black text-white/75">
              <Lock size={17} />
              Login con Supabase Auth
            </div>
          </div>

          <div className="control-tabs" role="tablist" aria-label="Panel de gestion">
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
            {activeTab === "owner-dashboard" && <OwnerDashboardPanel />}

            {activeTab === "stock" && <ProductAdminPanel />}

            {activeTab === "stock-alerts" && <SmartStockPanel />}

            {activeTab === "supplier-receipts" && <SupplierReceiptPanel />}

            {activeTab === "quotes" && <QuotesPanel />}

            {activeTab === "accounts" && <CustomerAccountsPanel />}

            {activeTab === "repairs" && <RepairsPanel />}

            {activeTab === "tasks" && <TasksPanel />}

            {activeTab === "daily-cash" && <DailyCashPanel />}

            {activeTab === "finance" && <BusinessFinancePanel />}

            {activeTab === "attendance" && <AttendancePanel />}

            {activeTab === "crm" && (
              <div className="grid gap-4">
                {inquiries.map((item) => (
                  <article key={item.id} className="crm-row">
                    <div>
                      <span>{item.id} - {item.source}</span>
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
                  Crear promocion
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

            {activeTab === "audit" && <AuditPanel />}

            {activeTab === "access" && <EmployeeAccessPanel />}

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

            {activeTab === "roles" && <RolesPanel />}
          </div>
        </div>
      </div>
    </section>
  );
}
