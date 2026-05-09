import { MapPin, Navigation } from "lucide-react";
import { createMapsUrl, siteData } from "../data/siteData";
import SectionHeader from "./SectionHeader";

export default function Location() {
  return (
    <section id="ubicacion" className="section bg-white">
      <div className="container">
        <SectionHeader
          eyebrow="Local físico"
          title="Estamos en Corrientes Capital"
          description="Pasá por el local o consultá antes para coordinar disponibilidad, retiro y asesoramiento."
        />
        <div className="grid overflow-hidden border border-black/10 shadow-hard lg:grid-cols-[1.1fr_0.9fr]">
          <div className="map-placeholder">
            <div className="map-grid" />
            <div className="relative z-10 max-w-md">
              <span className="grid size-14 place-items-center bg-reyred text-white">
                <MapPin size={28} />
              </span>
              <h3 className="mt-5 font-display text-3xl font-black uppercase text-white">
                Teniente Ibáñez 878
              </h3>
              <p className="mt-3 text-white/70">Corrientes Capital, Argentina</p>
            </div>
          </div>
          <div className="bg-warm p-6 sm:p-8 lg:p-10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-reyred">Dirección</p>
            <h3 className="mt-3 font-display text-3xl font-black text-graphite">{siteData.address}</h3>
            <p className="mt-5 leading-7 text-steel">
              Ubicación preparada para integrar un mapa embebido, reseñas, horarios y datos de retiro
              cuando estén definidos.
            </p>
            <a href={createMapsUrl()} target="_blank" rel="noreferrer" className="btn btn-primary mt-8">
              <Navigation size={18} />
              Cómo llegar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
