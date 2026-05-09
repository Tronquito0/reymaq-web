import { ExternalLink, Star } from "lucide-react";
import { googleReviewPlaceholders } from "../data/commerceData";
import { siteData } from "../data/siteData";
import SectionHeader from "./SectionHeader";

export default function GoogleReviews() {
  return (
    <section id="resenas" className="section bg-graphite text-white">
      <div className="container">
        <SectionHeader
          eyebrow="Reseñas Google"
          title="Confianza lista para mostrar opiniones reales"
          description="Componente preparado para integrar Google Maps / Google Business Profile cuando tengas el Place ID o el widget definido."
          dark
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {googleReviewPlaceholders.map((review) => (
            <article key={review.author} className="review-card">
              <div className="flex gap-1 text-reyred" aria-label={`${review.rating} estrellas`}>
                {Array.from({ length: review.rating }).map((_, index) => (
                  <Star key={index} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-white/70">{review.text}</p>
              <strong className="mt-5 block font-display text-lg text-white">{review.author}</strong>
            </article>
          ))}
        </div>
        <div className="mt-8 border border-white/10 bg-white/[0.055] p-5">
          <p className="text-sm leading-6 text-white/68">
            Placeholder técnico: `googlePlaceId` está en `src/data/siteData.js` como {siteData.googlePlaceId}.
            Cuando esté disponible, se puede conectar API, widget externo o embed de Google Maps.
          </p>
          <a href={siteData.googleReviewsUrl} className="mt-4 inline-flex items-center gap-2 text-sm font-black text-white">
            Ver perfil de Google cuando esté listo
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
