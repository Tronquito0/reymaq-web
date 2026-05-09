import { Send } from "lucide-react";
import { useState } from "react";
import { categories } from "../data/categories";
import { createWhatsAppUrl } from "../data/siteData";
import SectionHeader from "./SectionHeader";

const initialState = {
  clientType: "Particular",
  name: "",
  phone: "",
  need: "",
  category: "",
  deadline: "",
  details: ""
};

export default function AdvancedQuote() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("idle");

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus("loading");

    const message = [
      "Hola ReyMaq, quiero pedir una cotización.",
      `Tipo de cliente: ${form.clientType}`,
      form.name && `Nombre: ${form.name}`,
      form.phone && `Teléfono: ${form.phone}`,
      form.need && `Necesidad: ${form.need}`,
      form.category && `Categoría: ${form.category}`,
      form.deadline && `Plazo: ${form.deadline}`,
      form.details && `Detalle: ${form.details}`
    ]
      .filter(Boolean)
      .join("\n");

    window.setTimeout(() => {
      setStatus("success");
      window.open(createWhatsAppUrl(message), "_blank", "noopener,noreferrer");
      setForm(initialState);
    }, 400);
  };

  return (
    <section id="cotizar" className="section bg-warm">
      <div className="container">
        <SectionHeader
          eyebrow="Cotización avanzada"
          title="Pedí presupuesto para obra, taller, empresa o mantenimiento"
          description="Preparado para conectar después con CRM, Google Sheets, n8n, base de datos o panel de gestión de consultas."
        />
        <form onSubmit={handleSubmit} className="mx-auto grid max-w-5xl gap-4 border border-black/10 bg-white p-5 shadow-hard sm:p-7">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="field">
              Tipo de cliente
              <select name="clientType" value={form.clientType} onChange={updateField}>
                <option>Particular</option>
                <option>Profesional</option>
                <option>Empresa</option>
                <option>Taller</option>
                <option>Comercio</option>
              </select>
            </label>
            <label className="field">
              Nombre
              <input name="name" value={form.name} onChange={updateField} required placeholder="Tu nombre" />
            </label>
            <label className="field">
              Teléfono
              <input name="phone" value={form.phone} onChange={updateField} required placeholder="Tu teléfono" />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="field">
              Qué necesitás
              <input name="need" value={form.need} onChange={updateField} placeholder="Ej: herramientas para obra" />
            </label>
            <label className="field">
              Categoría
              <select name="category" value={form.category} onChange={updateField}>
                <option value="">Seleccionar</option>
                {categories.map((category) => (
                  <option key={category.title}>{category.title}</option>
                ))}
              </select>
            </label>
            <label className="field">
              Plazo
              <input name="deadline" value={form.deadline} onChange={updateField} placeholder="Ej: esta semana" />
            </label>
          </div>
          <label className="field">
            Detalle de la cotización
            <textarea name="details" value={form.details} onChange={updateField} rows="5" placeholder="Agregá cantidades, medidas, uso, marcas preferidas o presupuesto estimado." />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-h-6 text-sm font-bold text-steel" role="status">
              {status === "loading" && "Preparando cotización..."}
              {status === "success" && "Cotización preparada. Te abrimos WhatsApp para enviarla."}
            </p>
            <button type="submit" className="btn btn-primary justify-center">
              <Send size={18} />
              Enviar cotización
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
