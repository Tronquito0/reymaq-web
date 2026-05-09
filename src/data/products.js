export const stockLabels = {
  available: "Disponible",
  consult: "Consultar stock",
  preorder: "Bajo pedido",
  low: "Últimas unidades"
};

export const products = [
  {
    id: "amoladoras",
    name: "Amoladoras",
    category: "Herramientas eléctricas",
    description: "Para cortes, desbaste y trabajos exigentes de obra o taller.",
    tag: "Más consultado",
    stockStatus: "consult",
    useCase: "Obra y taller",
    brand: "Varias marcas",
    technical: ["Consultar potencia", "Discos compatibles", "Uso profesional o domiciliario"]
  },
  {
    id: "taladros",
    name: "Taladros",
    category: "Herramientas eléctricas",
    description: "Modelos para uso profesional, mantenimiento y hogar.",
    tag: "Para obra",
    stockStatus: "available",
    useCase: "Instalación",
    brand: "Varias marcas",
    technical: ["Con cable o inalámbricos", "Percutor según disponibilidad", "Accesorios opcionales"]
  },
  {
    id: "cajas-herramientas",
    name: "Cajas de herramientas",
    category: "Ferretería general",
    description: "Organización resistente para llevar y cuidar herramientas.",
    tag: "Ideal taller",
    stockStatus: "consult",
    useCase: "Organización",
    brand: "Varias marcas",
    technical: ["Medidas a consultar", "Plásticas o metálicas", "Uso taller y hogar"]
  },
  {
    id: "discos-corte",
    name: "Discos de corte",
    category: "Insumos para obra",
    description: "Consumibles para metal, mampostería y uso frecuente.",
    tag: "Consultar stock",
    stockStatus: "low",
    useCase: "Consumibles",
    brand: "Varias marcas",
    technical: ["Medidas varias", "Metal o mampostería", "Venta por unidad o cantidad"]
  },
  {
    id: "soldadoras",
    name: "Soldadoras",
    category: "Máquinas",
    description: "Equipos para herrería, reparación y trabajos de producción.",
    tag: "Nuevo ingreso",
    stockStatus: "preorder",
    useCase: "Herrería",
    brand: "Varias marcas",
    technical: ["Tipo inverter a consultar", "Potencia según uso", "Accesorios disponibles"]
  },
  {
    id: "compresores",
    name: "Compresores",
    category: "Máquinas",
    description: "Soluciones para inflado, pintura, limpieza y herramientas neumáticas.",
    tag: "Ideal taller",
    stockStatus: "consult",
    useCase: "Taller",
    brand: "Varias marcas",
    technical: ["Litros a consultar", "Uso domiciliario o taller", "Accesorios neumáticos"]
  },
  {
    id: "pinturas",
    name: "Pinturas",
    category: "Pinturas",
    description: "Terminaciones para interior, exterior, protección y renovación.",
    tag: "Consultar stock",
    stockStatus: "available",
    useCase: "Terminaciones",
    brand: "Varias marcas",
    technical: ["Interior o exterior", "Colores a consultar", "Complementos disponibles"]
  },
  {
    id: "lamparas-iluminacion",
    name: "Lámparas e iluminación",
    category: "Iluminación",
    description: "Productos para viviendas, comercios, obra y mantenimiento.",
    tag: "Más consultado",
    stockStatus: "available",
    useCase: "Hogar y comercio",
    brand: "Varias marcas",
    technical: ["Potencias varias", "Luz cálida o fría", "Accesorios eléctricos"]
  },
  {
    id: "cables-insumos-electricos",
    name: "Cables e insumos eléctricos",
    category: "Electricidad",
    description: "Elementos para instalaciones, reparaciones y reposición rápida.",
    tag: "Para obra",
    stockStatus: "consult",
    useCase: "Instalaciones",
    brand: "Varias marcas",
    technical: ["Medidas a consultar", "Accesorios eléctricos", "Venta por cantidad"]
  },
  {
    id: "productos-sanitarios",
    name: "Productos sanitarios",
    category: "Sanitarios",
    description: "Accesorios y componentes para instalación y reparación.",
    tag: "Consultar stock",
    stockStatus: "consult",
    useCase: "Reparaciones",
    brand: "Varias marcas",
    technical: ["Repuestos y accesorios", "Instalación sanitaria", "Medidas varias"]
  },
  {
    id: "llaves-tubo",
    name: "Llaves tubo",
    category: "Herramientas manuales",
    description: "Herramientas precisas para mecánica, taller y mantenimiento.",
    tag: "Ideal taller",
    stockStatus: "available",
    useCase: "Mecánica",
    brand: "Varias marcas",
    technical: ["Medidas varias", "Kits o unidades", "Uso profesional y particular"]
  },
  {
    id: "extensiones-insumos",
    name: "Extensiones e insumos",
    category: "Electricidad",
    description: "Elementos esenciales para trabajar cómodo y resolver rápido.",
    tag: "Para obra",
    stockStatus: "consult",
    useCase: "Obra y hogar",
    brand: "Varias marcas",
    technical: ["Largos a consultar", "Zapatillas y fichas", "Uso interior o exterior"]
  }
];
