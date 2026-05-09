import { Instagram, MapPin, MessageCircle } from "lucide-react";
import { categories } from "../data/categories";
import { createWhatsAppUrl, navItems, siteData } from "../data/siteData";

export default function Footer() {
  return (
    <footer className="bg-[#070707] py-12 text-white">
      <div className="container grid gap-10 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center bg-reyred font-black">RM</span>
            <span className="font-display text-2xl font-black">{siteData.name}</span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">
            Herramientas, máquinas, insumos y soluciones para obra, taller, hogar e industria en
            Corrientes Capital.
          </p>
          <p className="mt-5 flex gap-2 text-sm text-white/70">
            <MapPin className="shrink-0 text-reyred" size={18} />
            {siteData.address}
          </p>
        </div>
        <div>
          <h3 className="footer-title">Links rápidos</h3>
          <ul className="mt-4 grid gap-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="footer-link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="footer-title">Categorías</h3>
          <ul className="mt-4 grid gap-3">
            {categories.slice(0, 6).map((category) => (
              <li key={category.title}>
                <a href="#categorias" className="footer-link">
                  {category.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="footer-title">Contacto</h3>
          <div className="mt-4 grid gap-3">
            <a href={siteData.instagram} target="_blank" rel="noreferrer" className="footer-link inline-flex items-center gap-2">
              <Instagram size={17} />
              Instagram
            </a>
            <a href={createWhatsAppUrl()} target="_blank" rel="noreferrer" className="footer-link inline-flex items-center gap-2">
              <MessageCircle size={17} />
              WhatsApp placeholder
            </a>
            <span className="footer-link">Facebook: próximo a crear</span>
            <span className="footer-link">{siteData.hours}</span>
          </div>
        </div>
      </div>
      <div className="container mt-10 border-t border-white/10 pt-6 text-sm text-white/45">
        {siteData.legal}
      </div>
    </footer>
  );
}
