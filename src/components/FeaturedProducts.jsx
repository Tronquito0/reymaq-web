import { MessageCircle } from "lucide-react";
import { products } from "../data/products";
import { createWhatsAppUrl } from "../data/siteData";
import SectionHeader from "./SectionHeader";

export default function FeaturedProducts() {
  return (
    <section id="productos" className="section bg-white">
      <div className="container">
        <SectionHeader
          eyebrow="Productos destacados"
          title="Catálogo preparado para consultar disponibilidad"
          description="Productos de ejemplo listos para reemplazar, ampliar o conectar a un catálogo administrable con stock y precios."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <article key={product.name} className="product-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-steel">
                    {product.category}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-black text-graphite">
                    {product.name}
                  </h3>
                </div>
                <span className="tag">{product.tag}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-steel">{product.description}</p>
              <a
                href={createWhatsAppUrl(
                  `Hola ReyMaq, quiero consultar disponibilidad de ${product.name}.`
                )}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary mt-6 w-full justify-center"
              >
                <MessageCircle size={18} />
                Consultar disponibilidad
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
