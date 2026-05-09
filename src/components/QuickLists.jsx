import { ClipboardList, MessageCircle } from "lucide-react";
import { quickLists } from "../data/commerceData";
import { createWhatsAppUrl } from "../data/siteData";
import SectionHeader from "./SectionHeader";

export default function QuickLists() {
  return (
    <section className="section bg-warm">
      <div className="container">
        <SectionHeader
          eyebrow="Listas rápidas"
          title="Kits pensados para pedir más rápido"
          description="Preparado para futuras listas guardadas, recompra frecuente y armado de pedidos por rubro."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {quickLists.map((list) => (
            <article key={list.title} className="category-card">
              <ClipboardList className="text-reyred" size={32} />
              <h3 className="mt-5 font-display text-2xl font-black text-graphite">{list.title}</h3>
              <p className="mt-3 text-sm leading-6 text-steel">{list.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {list.items.map((item) => (
                  <span key={item} className="soft-badge">
                    {item}
                  </span>
                ))}
              </div>
              <a
                href={createWhatsAppUrl(`Hola ReyMaq, quiero consultar por ${list.title}.`)}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-black text-reyred"
              >
                <MessageCircle size={17} />
                Consultar kit
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
