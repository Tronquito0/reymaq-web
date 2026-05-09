# ReyMaq Web

Web comercial para ReyMaq, creada con React, Vite y Tailwind CSS. Está pensada como una base profesional, rápida y escalable para consultas por WhatsApp, catálogo futuro, CRM, stock y ventas online.

## Instalar

```bash
npm install
```

## Correr en desarrollo

```bash
npm run dev
```

Por defecto Vite queda disponible en `http://localhost:3000`.

## Generar build

```bash
npm run build
```

## Editar datos principales

Los datos comerciales están centralizados en:

- `src/data/siteData.js`
- `src/data/categories.js`
- `src/data/products.js`
- `src/data/commerceData.js`

## Cambiar WhatsApp

En `src/data/siteData.js`, reemplazar:

```js
export const WHATSAPP_NUMBER = "5490000000000";
```

Usar formato internacional sin `+`, espacios ni guiones. Ejemplo Argentina: `5493790000000`.

## Cambiar Instagram, Facebook, dirección y horarios

En `src/data/siteData.js`, editar:

```js
instagram: "https://www.instagram.com/reymaq_ctess/",
facebook: "#facebook-proximo",
address: "Teniente Ibáñez 878, Corrientes Capital",
mapsQuery: "Teniente Ibáñez 878, Corrientes Capital, Corrientes, Argentina",
hours: "Horarios: próximo a definir"
```

## Agregar categorías

Editar `src/data/categories.js` y sumar objetos al array `categories`:

```js
{
  title: "Nueva categoría",
  description: "Descripción corta comercial.",
  icon: Wrench
}
```

Los iconos salen de `lucide-react`.

## Agregar productos

Editar `src/data/products.js` y sumar objetos al array `products`:

```js
{
  name: "Nombre del producto",
  category: "Categoría",
  description: "Descripción breve.",
  tag: "Consultar stock"
}
```

La estructura está preparada para agregar `price`, `stock`, `image`, `sku` o integración con base de datos más adelante.

## Funciones profesionales agregadas

La web ya queda preparada con:

- Catálogo con buscador.
- Filtros por categoría.
- Ficha de producto.
- Estado de stock consultable.
- Carrito de cotización por WhatsApp.
- Retiro en local.
- Sección para profesionales y empresas.
- Base para cuenta cliente frecuente.
- Listas rápidas por rubro.
- Cotización avanzada.
- Promociones y novedades.
- Medios de pago y financiación.
- Preguntas frecuentes.
- Ubicación, horarios y datos del local centralizados.
- Panel futuro para catálogo, stock, CRM, promociones, reportes y empleados.

## Panel de control del negocio

Se agregó un centro de control en:

```js
src/components/BusinessControlCenter.jsx
```

Datos demo editables:

```js
src/data/adminData.js
```

Incluye:

- Gestión de stock con alta rápida de producto.
- Buscador de stock por SKU, producto, categoría o estado.
- CRM de consultas con cambio de estado.
- Panel para crear promociones demo.
- Reportes comerciales base.
- Usuarios/empleados con roles y estados.
- Login visual preparado para reemplazar por autenticación real.

Importante: en esta etapa funciona en frontend con estado local. Para control real del negocio, el siguiente paso es conectarlo a backend y base de datos.

Integraciones recomendadas:

- Supabase o PostgreSQL para productos, stock, consultas y empleados.
- Autenticación con roles: dueño, ventas, marketing y admin.
- n8n o API propia para capturar formularios y WhatsApp.
- Google Sheets como opción inicial simple.
- Meta Pixel y Google Analytics para reportes de campañas.

## Reseñas de Google Maps

La sección de reseñas está creada en `src/components/GoogleReviews.jsx`.

Por ahora usa placeholders definidos en:

```js
src/data/commerceData.js
```

Cuando ReyMaq tenga Google Business Profile listo, editar en `src/data/siteData.js`:

```js
googleReviewsUrl: "#google-reviews-proximo",
googlePlaceId: "GOOGLE_PLACE_ID_PROXIMO",
googleMapsEmbedUrl: ""
```

Después se puede conectar de tres formas:

- Widget externo de reseñas.
- Embed/manual con reseñas seleccionadas.
- API usando Place ID desde un backend para no exponer claves privadas.

## Catálogo, stock y cotización

El catálogo avanzado está en:

```js
src/components/CatalogExperience.jsx
```

Los productos pueden usar estos estados:

```js
available
consult
preorder
low
```

El carrito de cotización arma un mensaje con varios productos y lo envía por WhatsApp.

## Formulario

El formulario hoy prepara el mensaje y abre WhatsApp. También deja un `console.info` como punto de integración. Se puede conectar después con backend, CRM, WhatsApp API, Google Sheets, n8n o base de datos desde `src/components/ContactForm.jsx`.

## Deploy

Para Vercel, Easypanel u otro hosting:

1. Instalar dependencias con `npm install`.
2. Generar build con `npm run build`.
3. Publicar la carpeta `dist`.

Variables o integraciones futuras recomendadas:

- WhatsApp real.
- Google Analytics.
- Meta Pixel.
- Catálogo administrable.
- Gestión de stock y precios.
- CRM de consultas.
- Google Sheets o sistema interno.
