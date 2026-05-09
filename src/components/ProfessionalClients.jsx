import { MessageCircle } from "lucide-react";
import { createWhatsAppUrl, professionalClients } from "../data/siteData";

export default function ProfessionalClients() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container">
        <div className="industrial-strip grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:p-10">
          <div>
            <p className="eyebrow mb-4">Clientes profesionales</p>
            <h2 className="font-display text-3xl font-black uppercase leading-tight text-white sm:text-4xl">
              Si trabajás todos los días con herramientas, necesitás un proveedor que responda rápido.
            </h2>
            <a
              href={createWhatsAppUrl("Hola ReyMaq, quiero pedir asesoramiento para mi trabajo o negocio.")}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary mt-7"
            >
              <MessageCircle size={18} />
              Pedí asesoramiento
            </a>
          </div>
          <div className="flex flex-wrap gap-3">
            {professionalClients.map((client) => (
              <span key={client} className="client-pill">
                {client}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
