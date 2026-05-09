import { CheckCircle2 } from "lucide-react";
import { trustItems } from "../data/siteData";

export default function TrustBar() {
  return (
    <section className="border-y border-black/10 bg-white">
      <div className="container grid gap-3 py-6 md:grid-cols-2 lg:grid-cols-3">
        {trustItems.map((item) => (
          <div key={item} className="flex items-center gap-3 text-sm font-bold text-graphite">
            <CheckCircle2 className="shrink-0 text-reyred" size={20} />
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
