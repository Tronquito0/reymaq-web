import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { createWhatsAppUrl, navItems, siteData } from "../data/siteData";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-graphite/95 shadow-lg backdrop-blur">
      <div className="container flex h-20 items-center justify-between">
        <a href="#inicio" className="group flex items-center gap-3" aria-label="Ir al inicio">
          <span className="grid size-11 place-items-center border border-reyred bg-reyred text-lg font-black text-white shadow-redglow">
            RM
          </span>
          <span>
            <span className="block font-display text-xl font-black tracking-wide text-white">
              {siteData.name}
            </span>
            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              Corrientes Capital
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegación principal">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={createWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            <MessageCircle size={18} />
            Consultar por WhatsApp
          </a>
        </div>

        <button
          className="inline-grid size-11 place-items-center border border-white/15 text-white lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-carbon px-5 pb-6 pt-2 lg:hidden">
          <nav className="container grid gap-1" aria-label="Navegación mobile">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-4 text-sm font-bold text-white/80"
              >
                {item.label}
              </a>
            ))}
            <a
              href={createWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary mt-4 w-full justify-center"
            >
              <MessageCircle size={18} />
              Consultar por WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
