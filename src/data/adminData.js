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

export const ownerDashboard = {
  today: [
    { label: "Ventas del dia", value: "$684.200", trend: "38 comprobantes" },
    { label: "Ganancia estimada", value: "$184.700", trend: "27% margen bruto" },
    { label: "Ticket promedio", value: "$18.005", trend: "+9% vs ayer" },
    { label: "Caja actual", value: "$421.300", trend: "$12.500 por rendir" }
  ],
  month: [
    { label: "Facturacion", value: "$14.8M", trend: "+16% vs mes anterior" },
    { label: "Ganancia bruta", value: "$4.1M", trend: "Stock y costos al dia" },
    { label: "Deudas por cobrar", value: "$1.24M", trend: "9 clientes con saldo" },
    { label: "Stock valorizado", value: "$22.6M", trend: "Costo cargado" }
  ],
  topProducts: ["Disco corte 115 mm", "Tubo Lusqtoff 108 pzs", "Cable taller 2.5 mm"],
  topCustomers: ["Constructora Norte", "Taller El Rayo", "Juan Perez"],
  categories: ["Herramientas electricas", "Insumos para obra", "Electricidad"]
};

export const smartStockAlerts = [
  {
    product: "Disco corte 115 mm",
    stock: 3,
    status: "Bajo stock",
    signal: "Venta alta y stock menor al minimo",
    action: "Comprar",
    severity: "danger"
  },
  {
    product: "Tubo Lusqtoff 108 pzs",
    stock: 1,
    status: "Producto estrella",
    signal: "Sale todas las semanas",
    action: "Promocionar y reponer",
    severity: "success"
  },
  {
    product: "Mecha copa 32 mm",
    stock: 14,
    status: "Sin ventas",
    signal: "60 dias sin movimiento",
    action: "Liquidar",
    severity: "warning"
  },
  {
    product: "Amoladora 750W",
    stock: 6,
    status: "Margen bajo",
    signal: "12% de ganancia",
    action: "Revisar precio",
    severity: "warning"
  },
  {
    product: "Compresor 25L",
    stock: 2,
    status: "Costo subio",
    signal: "Proveedor aumento 18%",
    action: "Actualizar venta",
    severity: "danger"
  }
];

export const quotePipeline = [
  {
    id: "COT-1042",
    customer: "Carlos Benitez",
    products: "Cable, fichas, termicas",
    amount: 248500,
    discount: 8,
    status: "Pendiente"
  },
  {
    id: "COT-1041",
    customer: "Constructora Norte",
    products: "Discos, amoladora, guantes",
    amount: 684000,
    discount: 5,
    status: "Aceptado"
  },
  {
    id: "COT-1038",
    customer: "Taller El Rayo",
    products: "Llaves tubo y compresor",
    amount: 431900,
    discount: 0,
    status: "Vencido"
  }
];

export const customerAccounts = [
  {
    customer: "Juan Perez",
    debt: 84500,
    lastPayment: "Hace 23 dias",
    creditLimit: 120000,
    history: "8 compras",
    status: "Atrasado"
  },
  {
    customer: "Constructora Norte",
    debt: 392000,
    lastPayment: "Hace 6 dias",
    creditLimit: 900000,
    history: "24 compras",
    status: "Al dia"
  },
  {
    customer: "Taller El Rayo",
    debt: 178300,
    lastPayment: "Hace 41 dias",
    creditLimit: 160000,
    history: "13 compras",
    status: "Bloqueado"
  }
];

export const repairOrders = [
  {
    id: "REP-220",
    customer: "Miguel Acosta",
    machine: "Rotomartillo Bosch GBH 2-26",
    problem: "No percute y hace ruido en caja",
    status: "Diagnosticando",
    partsCost: 38500,
    labor: 26000,
    deposit: 15000,
    dueDate: "14/05/2026"
  },
  {
    id: "REP-219",
    customer: "Laura Gomez",
    machine: "Hidrolavadora Lusqtoff",
    problem: "Pierde agua por acople",
    status: "Esperando repuesto",
    partsCost: 18200,
    labor: 21000,
    deposit: 10000,
    dueDate: "16/05/2026"
  },
  {
    id: "REP-218",
    customer: "Taller El Rayo",
    machine: "Amoladora DeWalt 750W",
    problem: "Cambio de carbones",
    status: "Listo",
    partsCost: 9200,
    labor: 18000,
    deposit: 0,
    dueDate: "Hoy"
  }
];

export const internalTasks = [
  { task: "Reponer gondola de discos", owner: "Vendedor", priority: "Alta", status: "Pendiente" },
  { task: "Llamar proveedor por compresores", owner: "Duenio", priority: "Alta", status: "En proceso" },
  { task: "Publicar promo de tubos", owner: "Marketing", priority: "Media", status: "Pendiente" },
  { task: "Revisar precios de electricidad", owner: "Admin", priority: "Media", status: "Hecha" },
  { task: "Cobrar deuda a Juan Perez", owner: "Duenio", priority: "Alta", status: "Pendiente" }
];

export const auditEvents = [
  {
    employee: "Marcos",
    action: "Cambio precio",
    detail: "Amoladora 750W de $37.000 a $32.000",
    date: "11/05/2026 16:42"
  },
  {
    employee: "Admin",
    action: "Modifico stock",
    detail: "Disco corte 115 mm de 9 a 3 unidades",
    date: "11/05/2026 15:10"
  },
  {
    employee: "Sofia",
    action: "Aplico descuento",
    detail: "Cotizacion COT-1042 con 8%",
    date: "11/05/2026 12:28"
  },
  {
    employee: "Admin",
    action: "Creo producto",
    detail: "Tubo Lusqtoff 108 pzs",
    date: "10/05/2026 18:05"
  }
];

export const rolePermissions = [
  {
    role: "Duenio",
    access: "Acceso total",
    allowed: ["Finanzas", "Ganancias", "Borrar productos", "Auditoria", "Roles"],
    blocked: []
  },
  {
    role: "Admin",
    access: "Operacion completa",
    allowed: ["Productos", "Stock", "Clientes", "Ventas", "Cotizaciones"],
    blocked: ["Borrar auditoria"]
  },
  {
    role: "Vendedor",
    access: "Mostrador",
    allowed: ["Ventas", "Cotizaciones", "Clientes"],
    blocked: ["Ganancias", "Finanzas completas", "Borrar productos"]
  },
  {
    role: "Empleado",
    access: "Tareas y stock limitado",
    allowed: ["Tareas", "Carga diaria", "Stock limitado"],
    blocked: ["Costos", "Margenes", "Finanzas"]
  },
  {
    role: "Solo lectura",
    access: "Reportes",
    allowed: ["Ver reportes"],
    blocked: ["Editar", "Borrar", "Descuentos"]
  }
];
