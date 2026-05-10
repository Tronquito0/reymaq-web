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
    title: "Kit pintura rapida",
    description: "Rodillos, pinceles, cintas, lijas, pintura y accesorios.",
    items: ["Pinturas", "Rodillos", "Cinta", "Lijas"]
  },
  {
    title: "Base electricidad",
    description: "Cables, fichas, termicas, lamparas, extensiones y accesorios.",
    items: ["Cables", "Fichas", "Lamparas", "Extensiones"]
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
    description: "Espacio listo para destacar maquinas, herramientas o insumos recien llegados.",
    label: "Novedades"
  },
  {
    title: "Mas consultados",
    description: "Productos con alta demanda para obra, taller, electricidad y mantenimiento.",
    label: "Rotacion"
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
  "Atencion prioritaria por WhatsApp",
  "Preparado para precios especiales por volumen",
  "Historial de consultas en futura cuenta cliente",
  "Reposicion para talleres, comercios y empresas"
];

export const adminRoadmap = [
  { title: "Catalogo administrable", status: "Demo activo", icon: Database },
  { title: "Gestion de stock", status: "Demo activo", icon: PackageCheck },
  { title: "CRM de consultas", status: "Demo activo", icon: Headphones },
  { title: "Panel para promociones", status: "Demo activo", icon: BadgePercent },
  { title: "Reportes de ventas", status: "Demo activo", icon: BarChart3 },
  { title: "Login empleados", status: "Preparado", icon: UserRoundCheck }
];

export const featureMatrix = [
  { title: "Buscador de catalogo", detail: "Buscar por producto, categoria o uso.", icon: Search },
  { title: "Ficha de producto", detail: "Detalle tecnico, uso recomendado y consulta directa.", icon: FileText },
  { title: "Stock consultable", detail: "Estados listos para conectar con inventario.", icon: PackageCheck },
  { title: "Retiro en local", detail: "Reserva por WhatsApp y retiro en Corrientes.", icon: Truck },
  { title: "Carrito de cotizacion", detail: "Lista de productos enviada por WhatsApp.", icon: ShoppingCart },
  { title: "Clientes Pro", detail: "Flujo pensado para profesionales y empresas.", icon: ShieldCheck },
  { title: "Cuenta frecuente", detail: "Base para historial y recompra futura.", icon: Repeat },
  { title: "Listas rapidas", detail: "Kits por rubro para consultas recurrentes.", icon: ClipboardList },
  { title: "Pagos y financiacion", detail: "Espacio preparado para medios de pago.", icon: CreditCard },
  { title: "Resenas Google", detail: "Componente listo para integrar Google Maps.", icon: Star }
];

export const googleReviewPlaceholders = [
  {
    author: "Cliente de mostrador",
    rating: 5,
    text: "Buena atencion, asesoramiento directo y productos para resolver compras de ferreteria, electricidad y obra."
  },
  {
    author: "Profesional local",
    rating: 5,
    text: "Ideal para consultar disponibilidad, pedir alternativas y coordinar retiro en el local."
  },
  {
    author: "Compra para taller",
    rating: 5,
    text: "Catalogo y WhatsApp ayudan a armar listas de compra antes de pasar por el negocio."
  }
];
