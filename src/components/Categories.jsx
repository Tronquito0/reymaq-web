import { MessageCircle } from "lucide-react";
import { categories } from "../data/categories";
import { createWhatsAppUrl } from "../data/siteData";
import SectionHeader from "./SectionHeader";

export default function Categories() {
  return (
    <section id="categorias" className="section bg-warm">
      <div className="container">
        <SectionHeader
          eyebrow="Categorías principales"
          title="Todo lo que necesitás para resolver rápido"
          description="Un surtido preparado para personas que trabajan, mantienen, instalan, reparan o equipan su casa, obra, comercio o taller."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map(({ title, description, icon: Icon }) => (
            <article key={title} className="category-card">
              <div className="mb-5 flex items-center justify-between">
                <span className="grid size-12 place-items-center bg-reyred/10 text-reyred">
                  <Icon size={24} />
                </span>
                <span className="h-1 w-12 bg-reyred" />
              </div>
              <h3 className="font-display text-xl font-black text-graphite">{title}</h3>
              <p className="mt-3 min-h-16 text-sm leading-6 text-steel">{description}</p>
              <a
                href={createWhatsAppUrl(`Hola ReyMaq, quiero consultar por ${title}.`)}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-black text-reyred"
              >
                <MessageCircle size={17} />
                Consultar
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
