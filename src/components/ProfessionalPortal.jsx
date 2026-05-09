import { MessageCircle, ShieldCheck, UserRoundCheck } from "lucide-react";
import { proBenefits } from "../data/commerceData";
import { createWhatsAppUrl } from "../data/siteData";

export default function ProfessionalPortal() {
  return (
    <section id="profesionales" className="section bg-graphite text-white">
      <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="eyebrow mb-4">Clientes Pro y empresas</p>
          <h2 className="section-title text-white">Compras frecuentes, cotizaciones y reposición sin vueltas</h2>
          <p className="mt-5 leading-8 text-white/70">
            Un espacio preparado para clientes profesionales: albañiles, técnicos, talleres, comercios,
            empresas y mantenimiento. Más adelante puede convertirse en cuenta cliente con historial,
            precios por volumen y listas repetidas.
          </p>
          <a
            href={createWhatsAppUrl("Hola ReyMaq, quiero consultar como cliente profesional o empresa.")}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary mt-8"
          >
            <MessageCircle size={18} />
            Pedir atención Pro
          </a>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {proBenefits.map((benefit, index) => (
            <div key={benefit} className="pro-card">
              {index % 2 === 0 ? <ShieldCheck size={24} /> : <UserRoundCheck size={24} />}
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
