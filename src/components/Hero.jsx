import { ArrowRight, MapPin, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { createMapsUrl, createWhatsAppUrl, siteData } from "../data/siteData";

const heroCards = ["Herramientas", "Máquinas", "Pinturas", "Electricidad", "Sanitarios"];

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-graphite pt-28 text-white sm:pt-32">
      <div className="industrial-grid absolute inset-0 opacity-40" />
      <div className="container relative grid min-h-[calc(100svh-5rem)] items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="max-w-3xl">
          <p className="eyebrow mb-5">Proveedor local en Corrientes Capital</p>
          <h1 className="font-display text-[clamp(2.45rem,7vw,5.8rem)] font-black uppercase leading-[0.92]">
            {siteData.tagline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">{siteData.description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={createWhatsAppUrl()} target="_blank" rel="noreferrer" className="btn btn-primary">
              <MessageCircle size={19} />
              Consultar por WhatsApp
            </a>
            <a href="#productos" className="btn btn-light">
              Ver productos
              <ArrowRight size={18} />
            </a>
            <a href={createMapsUrl()} target="_blank" rel="noreferrer" className="btn btn-ghost">
              <MapPin size={18} />
              Cómo llegar
            </a>
          </div>
          <div className="mt-9 grid max-w-xl grid-cols-3 gap-3">
            {[
              ["+10", "categorías"],
              ["Local", "físico"],
              ["Rápida", "atención"]
            ].map(([value, label]) => (
              <div key={label} className="border border-white/10 bg-white/[0.045] p-4">
                <strong className="block font-display text-2xl font-black">{value}</strong>
                <span className="text-xs uppercase tracking-[0.16em] text-white/55">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="machine-panel">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-reyred">
                  Stock consultable
                </span>
                <h2 className="mt-2 font-display text-2xl font-black text-white">
                  Obra, taller, hogar e industria
                </h2>
              </div>
              <ShieldCheck className="text-reyred" size={34} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {heroCards.map((card, index) => (
                <a
                  key={card}
                  href="#categorias"
                  className={`hero-card ${index === 0 ? "sm:col-span-2" : ""}`}
                >
                  <Sparkles size={16} />
                  {card}
                </a>
              ))}
            </div>
            <div className="mt-6 border-l-4 border-reyred bg-white/[0.06] p-5">
              <p className="text-sm leading-6 text-white/70">
                Consultá por WhatsApp y te orientamos según el uso, presupuesto y disponibilidad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
