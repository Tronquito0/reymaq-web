import {
  BadgePercent,
  BarChart3,
  ClipboardList,
  CreditCard,
  Database,
  FileText,
  Headphones,
  PackageCheck,
  Repeat,
  Search,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  UserRoundCheck
} from "lucide-react";

export const quickLists = [
  {
    title: "Kit pintura rápida",
    description: "Rodillos, pinceles, cintas, lijas, pintura y accesorios.",
    items: ["Pinturas", "Rodillos", "Cinta", "Lijas"]
  },
  {
    title: "Base electricidad",
    description: "Cables, fichas, térmicas, lámparas, extensiones y accesorios.",
    items: ["Cables", "Fichas", "Lámparas", "Extensiones"]
  },
  {
    title: "Obra y mantenimiento",
    description: "Discos, herramientas, insumos y consumibles para avanzar.",
    items: ["Discos", "Taladros", "Amoladoras", "Insumos"]
  }
];

export const promotions = [
  {
    title: "Nuevo ingreso",
    description: "Espacio listo para destacar máquinas, herramientas o insumos recién llegados.",
    label: "Novedades"
  },
  {
    title: "Más consultados",
    description: "Productos con alta demanda para obra, taller, electricidad y mantenimiento.",
    label: "Rotación"
  },
  {
    title: "Combos por rubro",
    description: "Preparado para armar combos de pintura, electricidad, sanitarios o taller.",
    label: "Promos"
  }
];

export const proBenefits = [
  "Cotizaciones con varios productos",
  "Listas repetidas para compras frecuentes",
  "Atención prioritaria por WhatsApp",
  "Preparado para precios especiales por volumen",
  "Historial de consultas en futura cuenta cliente",
  "Reposición para talleres, comercios y empresas"
];

export const adminRoadmap = [
  { title: "Catálogo administrable", status: "Demo activo", icon: Database },
  { title: "Gestión de stock", status: "Demo activo", icon: PackageCheck },
  { title: "CRM de consultas", status: "Demo activo", icon: Headphones },
  { title: "Panel para promociones", status: "Demo activo", icon: BadgePercent },
  { title: "Reportes de ventas", status: "Demo activo", icon: BarChart3 },
  { title: "Login empleados", status: "Preparado", icon: UserRoundCheck }
];

export const featureMatrix = [
  { title: "Buscador de catálogo", detail: "Buscar por producto, categoría o uso.", icon: Search },
  { title: "Ficha de producto", detail: "Detalle técnico, uso recomendado y consulta directa.", icon: FileText },
  { title: "Stock consultable", detail: "Estados listos para conectar con inventario.", icon: PackageCheck },
  { title: "Retiro en local", detail: "Reserva por WhatsApp y retiro en Corrientes.", icon: Truck },
  { title: "Carrito de cotización", detail: "Lista de productos enviada por WhatsApp.", icon: ShoppingCart },
  { title: "Clientes Pro", detail: "Flujo pensado para profesionales y empresas.", icon: ShieldCheck },
  { title: "Cuenta frecuente", detail: "Base para historial y recompra futura.", icon: Repeat },
  { title: "Listas rápidas", detail: "Kits por rubro para consultas recurrentes.", icon: ClipboardList },
  { title: "Pagos y financiación", detail: "Espacio preparado para medios de pago.", icon: CreditCard },
  { title: "Reseñas Google", detail: "Componente listo para integrar Google Maps.", icon: Star }
];

export const googleReviewPlaceholders = [
  {
    author: "Cliente de ReyMaq",
    rating: 5,
    text: "Espacio preparado para mostrar reseñas reales de Google Maps cuando se conecte la integración."
  },
  {
    author: "Profesional local",
    rating: 5,
    text: "Acá se podrán destacar opiniones sobre atención, disponibilidad, asesoramiento y retiro en local."
  },
  {
    author: "Compra para taller",
    rating: 5,
    text: "El bloque ya contempla estrellas, texto, autor y enlace hacia el perfil de Google."
  }
];
