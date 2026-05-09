import { Send } from "lucide-react";
import { useState } from "react";
import { categories } from "../data/categories";
import { createWhatsAppUrl } from "../data/siteData";
import SectionHeader from "./SectionHeader";

const initialState = {
  name: "",
  phone: "",
  product: "",
  category: "",
  message: ""
};

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("idle");

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus("loading");

    const message = [
      "Hola ReyMaq, quiero hacer una consulta.",
      form.name && `Nombre: ${form.name}`,
      form.phone && `Teléfono: ${form.phone}`,
      form.product && `Producto: ${form.product}`,
      form.category && `Categoría: ${form.category}`,
      form.message && `Mensaje: ${form.message}`
    ]
      .filter(Boolean)
      .join("\n");

    window.setTimeout(() => {
      console.info("Consulta ReyMaq lista para integrar:", form);
      setStatus("success");
      window.open(createWhatsAppUrl(message), "_blank", "noopener,noreferrer");
      setForm(initialState);
    }, 450);
  };

  return (
    <section id="contacto" className="section bg-warm">
      <div className="container">
        <SectionHeader
          eyebrow="Consulta directa"
          title="Contanos qué necesitás y te orientamos"
          description="Formulario preparado para conectar luego con backend, CRM, WhatsApp API, Google Sheets, base de datos o n8n."
        />
        <form onSubmit={handleSubmit} className="mx-auto grid max-w-4xl gap-4 rounded-sm border border-black/10 bg-white p-5 shadow-hard sm:p-7">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="field">
              Nombre
              <input name="name" value={form.name} onChange={updateField} required placeholder="Tu nombre" />
            </label>
            <label className="field">
              Teléfono
              <input name="phone" value={form.phone} onChange={updateField} required placeholder="Tu teléfono" />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="field">
              Producto que busca
              <input name="product" value={form.product} onChange={updateField} placeholder="Ej: amoladora, pintura, cable" />
            </label>
            <label className="field">
              Categoría de interés
              <select name="category" value={form.category} onChange={updateField}>
                <option value="">Seleccionar categoría</option>
                {categories.map((category) => (
                  <option key={category.title} value={category.title}>
                    {category.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="field">
            Mensaje
            <textarea name="message" value={form.message} onChange={updateField} rows="5" placeholder="Contanos medidas, uso, cantidad o cualquier detalle útil." />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-h-6 text-sm font-bold text-steel" role="status">
              {status === "loading" && "Preparando mensaje..."}
              {status === "success" && "Consulta enviada. Te abrimos WhatsApp para finalizar el envío."}
              {status === "error" && "Error al enviar. Probá nuevamente."}
            </p>
            <button type="submit" className="btn btn-primary justify-center">
              <Send size={18} />
              Enviar consulta
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
