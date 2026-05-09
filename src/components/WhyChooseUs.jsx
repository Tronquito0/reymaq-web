import { ArrowRight, Check } from "lucide-react";
import { createWhatsAppUrl, whyChooseUs } from "../data/siteData";

export default function WhyChooseUs() {
  return (
    <section id="elegirnos" className="section bg-warm">
      <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="eyebrow mb-4">Por qué elegir ReyMaq</p>
          <h2 className="section-title text-graphite">
            Atención clara para comprar bien y no perder tiempo
          </h2>
          <p className="mt-5 text-base leading-8 text-steel">
            Sabemos que cuando necesitás una herramienta, máquina o insumo, no querés perder
            tiempo. Por eso en ReyMaq apuntamos a una atención clara, rápida y práctica: te
            ayudamos a encontrar lo que necesitás para resolver tu trabajo.
          </p>
          <a href={createWhatsAppUrl("Hola ReyMaq, necesito ayuda para elegir un producto.")} target="_blank" rel="noreferrer" className="btn btn-primary mt-8">
            Necesito ayuda para elegir
            <ArrowRight size={18} />
          </a>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {whyChooseUs.map((item) => (
            <div key={item} className="benefit-card">
              <Check className="text-reyred" size={20} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
