export const WHATSAPP_NUMBER = "5490000000000";

export const siteData = {
  name: "ReyMaq",
  tagline: "Herramientas, máquinas e insumos para laburar en serio",
  description:
    "En ReyMaq encontrás productos para obra, taller, hogar e industria, con atención rápida, asesoramiento claro y local físico en Corrientes Capital.",
  address: "Teniente Ibáñez 878, Corrientes Capital",
  mapsQuery: "Teniente Ibáñez 878, Corrientes Capital, Corrientes, Argentina",
  instagram: "https://www.instagram.com/reymaq_ctess/",
  facebook: "#facebook-proximo",
  whatsappNumber: WHATSAPP_NUMBER,
  whatsappBaseMessage: "Hola ReyMaq, quiero consultar por un producto",
  email: "consultas@reymaq.com.ar",
  phone: "Próximo a definir",
  hours: "Horarios: próximo a definir",
  legal: "© 2026 ReyMaq. Todos los derechos reservados.",
  googleReviewsUrl: "#google-reviews-proximo",
  googlePlaceId: "GOOGLE_PLACE_ID_PROXIMO",
  googleMapsEmbedUrl: "",
  analytics: {
    googleAnalyticsId: "",
    metaPixelId: ""
  }
};

export const navItems = [
  { label: "Inicio", href: "#inicio" },
  { label: "Catálogo", href: "#catalogo" },
  { label: "Profesionales", href: "#profesionales" },
  { label: "Cotizar", href: "#cotizar" },
  { label: "Reseñas", href: "#resenas" },
  { label: "Ubicación", href: "#ubicacion" }
];

export const trustItems = [
  "Atención rápida",
  "Productos para profesionales y particulares",
  "Buen surtido",
  "Asesoramiento personalizado",
  "Retiro en local",
  "Ubicación estratégica en Corrientes Capital"
];

export const professionalClients = [
  "Albañiles",
  "Electricistas",
  "Pintores",
  "Herreros",
  "Mecánicos",
  "Técnicos",
  "Empresas",
  "Particulares",
  "Talleres",
  "Comercios"
];

export const whyChooseUs = [
  "Atención directa y práctica",
  "Recomendaciones según el uso real",
  "Productos para distintos presupuestos",
  "Compra simple por WhatsApp",
  "Local físico en Corrientes Capital",
  "Variedad para obra, taller, hogar e industria"
];

export const paymentOptions = [
  "Efectivo",
  "Transferencia",
  "Tarjetas",
  "Cuotas a confirmar",
  "Compras para empresas",
  "Facturación a definir"
];

export const pickupSteps = [
  "Consultás producto, cantidad y disponibilidad.",
  "Te confirmamos stock, alternativa o pedido especial.",
  "Reservás y retirás por el local de Teniente Ibáñez 878."
];

export const faqItems = [
  {
    question: "¿Puedo consultar stock antes de ir al local?",
    answer:
      "Sí. La web está preparada para consultar productos por WhatsApp y confirmar disponibilidad antes de acercarte."
  },
  {
    question: "¿Venden a profesionales y empresas?",
    answer:
      "Sí. ReyMaq trabaja con particulares, talleres, técnicos, comercios, empresas y profesionales de obra."
  },
  {
    question: "¿Puedo pedir una cotización con varios productos?",
    answer:
      "Sí. El catálogo permite armar una lista de consulta y enviarla completa por WhatsApp."
  },
  {
    question: "¿Tienen retiro en local?",
    answer:
      "La estructura ya está preparada para reservas con retiro en el local de Corrientes Capital."
  },
  {
    question: "¿Los precios están publicados?",
    answer:
      "Esta primera versión prioriza consultas y disponibilidad. La arquitectura permite agregar precios, stock y promociones luego."
  }
];

export function createWhatsAppUrl(message = siteData.whatsappBaseMessage) {
  return `https://wa.me/${siteData.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function createMapsUrl() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteData.mapsQuery)}`;
}
