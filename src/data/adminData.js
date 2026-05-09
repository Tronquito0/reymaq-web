export const stockItems = [
  {
    sku: "RM-AMO-001",
    product: "Amoladora 115 mm",
    category: "Herramientas eléctricas",
    stock: 8,
    minStock: 4,
    status: "Disponible"
  },
  {
    sku: "RM-TAL-002",
    product: "Taladro percutor",
    category: "Herramientas eléctricas",
    stock: 3,
    minStock: 5,
    status: "Bajo stock"
  },
  {
    sku: "RM-DIS-003",
    product: "Discos de corte",
    category: "Insumos para obra",
    stock: 42,
    minStock: 20,
    status: "Disponible"
  },
  {
    sku: "RM-PIN-004",
    product: "Pintura interior",
    category: "Pinturas",
    stock: 0,
    minStock: 6,
    status: "Reponer"
  }
];

export const crmInquiries = [
  {
    id: "CRM-1001",
    customer: "Cliente particular",
    need: "Consultar taladro y mechas",
    source: "WhatsApp",
    status: "Nuevo",
    priority: "Media"
  },
  {
    id: "CRM-1002",
    customer: "Taller mecánico",
    need: "Cotizar llaves tubo y compresor",
    source: "Formulario",
    status: "En seguimiento",
    priority: "Alta"
  },
  {
    id: "CRM-1003",
    customer: "Empresa local",
    need: "Reposición mensual de insumos",
    source: "Cliente Pro",
    status: "Cotizado",
    priority: "Alta"
  }
];

export const promoItems = [
  {
    title: "Combo pintura",
    channel: "Web + Instagram",
    status: "Activo",
    detail: "Pintura, rodillo, cinta y lija."
  },
  {
    title: "Herramientas para obra",
    channel: "Web",
    status: "Borrador",
    detail: "Amoladora, discos y accesorios."
  },
  {
    title: "Electricidad básica",
    channel: "WhatsApp",
    status: "Programado",
    detail: "Cables, fichas, lámparas y extensiones."
  }
];

export const salesMetrics = [
  { label: "Consultas del mes", value: "128", trend: "+18%" },
  { label: "Cotizaciones enviadas", value: "46", trend: "+11%" },
  { label: "Productos con bajo stock", value: "7", trend: "Atender" },
  { label: "Promos activas", value: "3", trend: "Ok" }
];

export const employees = [
  {
    name: "Dueño / Administrador",
    role: "Control total",
    access: "Admin",
    status: "Activo"
  },
  {
    name: "Vendedor mostrador",
    role: "Consultas y stock",
    access: "Ventas",
    status: "Invitación pendiente"
  },
  {
    name: "Marketing",
    role: "Promos y redes",
    access: "Marketing",
    status: "Futuro"
  }
];
