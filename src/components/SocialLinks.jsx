import { Facebook, Instagram } from "lucide-react";
import { siteData } from "../data/siteData";

export default function SocialLinks() {
  return (
    <section className="bg-graphite py-12 text-white">
      <div className="container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="eyebrow mb-3">Redes y novedades</p>
          <h2 className="font-display text-3xl font-black uppercase">Seguinos para ver ingresos y productos destacados.</h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={siteData.instagram} target="_blank" rel="noreferrer" className="btn btn-light">
            <Instagram size={18} />
            Instagram
          </a>
          <a href={siteData.facebook} className="btn btn-ghost" aria-disabled="true">
            <Facebook size={18} />
            Facebook próximo
          </a>
        </div>
      </div>
    </section>
  );
}
