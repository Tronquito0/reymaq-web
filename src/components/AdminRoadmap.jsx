import { featureMatrix, adminRoadmap } from "../data/commerceData";
import SectionHeader from "./SectionHeader";

export default function AdminRoadmap() {
  return (
    <section className="section bg-warm">
      <div className="container">
        <SectionHeader
          eyebrow="Base escalable"
          title="Preparado para crecer hacia e-commerce y gestión interna"
          description="Estas funciones ya tienen lugar en la arquitectura para sumar panel, CRM, stock, precios, analytics y campañas."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {featureMatrix.map(({ title, detail, icon: Icon }) => (
              <article key={title} className="feature-mini">
                <Icon className="text-reyred" size={24} />
                <h3>{title}</h3>
                <p>{detail}</p>
              </article>
            ))}
          </div>
          <div className="admin-panel">
            <p className="eyebrow mb-4">Panel futuro</p>
            <h3 className="font-display text-3xl font-black uppercase text-white">
              Administración lista para la próxima etapa
            </h3>
            <div className="mt-6 grid gap-3">
              {adminRoadmap.map(({ title, status, icon: Icon }) => (
                <div key={title} className="admin-row">
                  <Icon size={22} />
                  <span>{title}</span>
                  <strong>{status}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
