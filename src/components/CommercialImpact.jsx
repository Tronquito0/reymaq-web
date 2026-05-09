import { Building2, Home, MessageCircle, Wrench } from "lucide-react";
import { createWhatsAppUrl } from "../data/siteData";

const blocks = [
  {
    title: "Para profesionales",
    description: "Herramientas e insumos para quienes trabajan todos los días y necesitan respuesta rápida.",
    icon: Wrench
  },
  {
    title: "Para empresas",
    description: "Soluciones para compras recurrentes, mantenimiento, obra y reposición.",
    icon: Building2
  },
  {
    title: "Para uso particular",
    description: "Te ayudamos a elegir lo correcto sin vueltas ni compras innecesarias.",
    icon: Home
  }
];

export default function CommercialImpact() {
  return (
    <section className="section relative overflow-hidden bg-graphite text-white">
      <div className="industrial-grid absolute inset-0 opacity-35" />
      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow mx-auto mb-4">Respuesta comercial concreta</p>
          <h2 className="font-display text-[clamp(2rem,5vw,4.3rem)] font-black uppercase leading-tight">
            Equipá tu obra, taller o negocio con productos que responden.
          </h2>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {blocks.map(({ title, description, icon: Icon }) => (
            <article key={title} className="impact-card">
              <Icon className="text-reyred" size={32} />
              <h3 className="mt-5 font-display text-2xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/65">{description}</p>
              <a
                href={createWhatsAppUrl(`Hola ReyMaq, quiero consultar opciones ${title.toLowerCase()}.`)}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-black text-white"
              >
                <MessageCircle size={17} />
                Pedir asesoramiento
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
