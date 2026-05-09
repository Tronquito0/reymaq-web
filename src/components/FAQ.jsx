import { HelpCircle } from "lucide-react";
import { faqItems } from "../data/siteData";
import SectionHeader from "./SectionHeader";

export default function FAQ() {
  return (
    <section className="section bg-white">
      <div className="container">
        <SectionHeader
          eyebrow="Preguntas frecuentes"
          title="Información clara antes de consultar"
          description="Un bloque útil para reducir dudas, ordenar consultas y preparar políticas de cambios, garantías, pagos y retiro."
        />
        <div className="mx-auto grid max-w-4xl gap-3">
          {faqItems.map((item) => (
            <details key={item.question} className="faq-item">
              <summary>
                <HelpCircle size={20} />
                {item.question}
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
