import { BadgePercent, MessageCircle } from "lucide-react";
import { promotions } from "../data/commerceData";
import { createWhatsAppUrl } from "../data/siteData";
import SectionHeader from "./SectionHeader";

export default function Promotions() {
  return (
    <section className="section bg-white">
      <div className="container">
        <SectionHeader
          eyebrow="Promos y novedades"
          title="Espacios listos para vender mejor"
          description="Bloques editables para destacar ingresos, ofertas, combos, productos de temporada y liquidaciones."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {promotions.map((promo) => (
            <article key={promo.title} className="promo-card">
              <span className="tag">{promo.label}</span>
              <BadgePercent className="mt-6 text-reyred" size={34} />
              <h3 className="mt-5 font-display text-2xl font-black text-graphite">{promo.title}</h3>
              <p className="mt-3 text-sm leading-6 text-steel">{promo.description}</p>
              <a
                href={createWhatsAppUrl(`Hola ReyMaq, quiero consultar por ${promo.title}.`)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary mt-6"
              >
                <MessageCircle size={18} />
                Consultar
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
