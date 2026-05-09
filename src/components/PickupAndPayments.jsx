import { CheckCircle2, CreditCard, MapPin, Truck } from "lucide-react";
import { createMapsUrl, paymentOptions, pickupSteps, siteData } from "../data/siteData";

export default function PickupAndPayments() {
  return (
    <section className="section bg-white">
      <div className="container grid gap-6 lg:grid-cols-2">
        <article className="feature-panel">
          <Truck className="text-reyred" size={36} />
          <h2 className="mt-5 font-display text-3xl font-black uppercase text-graphite">
            Reserva y retiro en local
          </h2>
          <p className="mt-4 leading-7 text-steel">
            Flujo preparado para operar como las grandes tiendas: consultar disponibilidad, reservar
            y retirar en el local sin perder tiempo.
          </p>
          <div className="mt-6 grid gap-3">
            {pickupSteps.map((step, index) => (
              <div key={step} className="flex gap-3 border border-black/10 bg-warm p-4">
                <span className="grid size-8 shrink-0 place-items-center bg-reyred text-sm font-black text-white">
                  {index + 1}
                </span>
                <p className="text-sm font-bold leading-6 text-graphite">{step}</p>
              </div>
            ))}
          </div>
          <a href={createMapsUrl()} target="_blank" rel="noreferrer" className="btn btn-primary mt-6">
            <MapPin size={18} />
            Ver local
          </a>
        </article>

        <article className="feature-panel">
          <CreditCard className="text-reyred" size={36} />
          <h2 className="mt-5 font-display text-3xl font-black uppercase text-graphite">
            Medios de pago y compras
          </h2>
          <p className="mt-4 leading-7 text-steel">
            Espacio listo para publicar medios de pago, cuotas, condiciones para empresas y opciones
            de facturación cuando ReyMaq lo defina.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {paymentOptions.map((option) => (
              <div key={option} className="flex items-center gap-3 text-sm font-black text-graphite">
                <CheckCircle2 className="text-reyred" size={19} />
                {option}
              </div>
            ))}
          </div>
          <p className="mt-6 border-l-4 border-reyred bg-warm px-4 py-3 text-sm font-bold text-steel">
            Teléfono: {siteData.phone}. Los datos comerciales quedan centralizados para actualizarlos sin tocar componentes.
          </p>
        </article>
      </div>
    </section>
  );
}
