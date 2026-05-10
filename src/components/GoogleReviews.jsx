import { ExternalLink, MessageCircle, Star } from "lucide-react";
import { googleReviewPlaceholders } from "../data/commerceData";
import { createMapsUrl, createWhatsAppUrl, siteData } from "../data/siteData";
import SectionHeader from "./SectionHeader";

export default function GoogleReviews() {
  const reviewsUrl = siteData.googleReviewsUrl.startsWith("#") ? createMapsUrl() : siteData.googleReviewsUrl;
  const writeReviewUrl = siteData.googleWriteReviewUrl.startsWith("#") ? reviewsUrl : siteData.googleWriteReviewUrl;

  return (
    <section id="resenas" className="section bg-graphite text-white">
      <div className="container">
        <SectionHeader
          eyebrow="Reseñas Google"
          title="Opiniones de clientes y atencion local"
          description="Un espacio pensado para mostrar reseñas reales de Google Maps, sumar confianza y llevar a nuevos clientes al perfil del negocio."
          dark
        />

        <div className="reviews-layout">
          <aside className="reviews-score">
            <div className="flex gap-1 text-reyred" aria-label="5 estrellas">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={22} fill="currentColor" />
              ))}
            </div>
            <strong>{siteData.googleRating}</strong>
            <span>{siteData.googleReviewCount}</span>
            <p>Cuando el perfil de Google Business este enlazado, este bloque puede llevar directo a ver opiniones, abrir Maps o pedir una reseña nueva.</p>
            <div className="mt-6 grid gap-3">
              <a href={reviewsUrl} target="_blank" rel="noreferrer" className="btn btn-primary justify-center">
                <ExternalLink size={18} />
                Ver en Google
              </a>
              <a href={writeReviewUrl} target="_blank" rel="noreferrer" className="btn btn-outline-light justify-center">
                <Star size={18} />
                Dejar reseña
              </a>
              <a href={createWhatsAppUrl("Hola ReyMaq, quiero consultar por productos disponibles.")} className="btn btn-outline-light justify-center">
                <MessageCircle size={18} />
                Consultar ahora
              </a>
            </div>
          </aside>

          <div className="grid gap-4">
            {siteData.googleMapsEmbedUrl && (
              <iframe
                src={siteData.googleMapsEmbedUrl}
                className="google-map-embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicacion de ReyMaq en Google Maps"
              />
            )}
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
          </div>
        </div>
      </div>
    </section>
  );
}
