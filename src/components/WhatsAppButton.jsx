import { MessageCircle } from "lucide-react";
import { createWhatsAppUrl } from "../data/siteData";

export default function WhatsAppButton() {
  return (
    <a
      href={createWhatsAppUrl()}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-[#22c55e] px-4 py-3 text-sm font-black text-white shadow-2xl transition hover:-translate-y-0.5 hover:bg-[#16a34a] focus:outline-none focus:ring-4 focus:ring-[#22c55e]/30"
      aria-label="Consultar por WhatsApp"
    >
      <MessageCircle size={21} />
      <span className="hidden sm:inline">Consultanos</span>
    </a>
  );
}
