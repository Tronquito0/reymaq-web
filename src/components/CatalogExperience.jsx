import { Eye, MessageCircle, Plus, Search, ShoppingCart, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { categories } from "../data/categories";
import { products as fallbackProducts } from "../data/products";
import { createWhatsAppUrl } from "../data/siteData";
import { getPublicProducts, stockLabels } from "../lib/products";
import SectionHeader from "./SectionHeader";

export default function CatalogExperience() {
  const [products, setProducts] = useState(fallbackProducts);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quoteItems, setQuoteItems] = useState([]);

  const allCategories = useMemo(() => {
    const productCategories = products.map((product) => product.category).filter(Boolean);
    return ["Todas", ...new Set([...categories.map((category) => category.title), ...productCategories])];
  }, [products]);

  useEffect(() => {
    let isMounted = true;

    getPublicProducts()
      .then((items) => {
        if (isMounted && items.length) setProducts(items);
      })
      .catch((error) => {
        console.warn("No se pudieron cargar productos desde Supabase.", error);
      })
      .finally(() => {
        if (isMounted) setLoadingProducts(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = activeCategory === "Todas" || product.category === activeCategory;
      const searchable = [product.name, product.category, product.description, product.useCase, product.tag]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [activeCategory, products, query]);

  const addToQuote = (product) => {
    setQuoteItems((current) => {
      if (current.some((item) => item.id === product.id)) return current;
      return [...current, product];
    });
  };

  const removeFromQuote = (productId) => {
    setQuoteItems((current) => current.filter((item) => item.id !== productId));
  };

  const quoteMessage = [
    "Hola ReyMaq, quiero cotizar estos productos:",
    ...quoteItems.map((item) => `- ${item.name} (${item.category})`)
  ].join("\n");

  return (
    <section id="catalogo" className="section bg-white">
      <div className="container">
        <SectionHeader
          eyebrow="Catálogo consultable"
          title="Buscá, filtrá y armá tu consulta"
          description="Base preparada para stock, precios, fichas técnicas, fotos, carrito de cotización y futura administración desde panel."
        />

        <div className="catalog-shell">
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <div>
              <label className="relative block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-steel" size={19} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="catalog-search"
                  placeholder="Buscar por producto, categoría o uso..."
                  aria-label="Buscar productos"
                />
              </label>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`filter-pill ${activeCategory === category ? "filter-pill-active" : ""}`}
                    type="button"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <aside className="quote-box">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-reyred">
                    Cotización
                  </p>
                  <strong className="text-xl font-black text-graphite">{quoteItems.length} productos</strong>
                </div>
                <ShoppingCart className="text-reyred" />
              </div>
              <div className="mt-4 grid gap-2">
                {quoteItems.length === 0 && (
                  <p className="text-sm leading-6 text-steel">Agregá productos y mandá la lista completa por WhatsApp.</p>
                )}
                {quoteItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-2 text-sm font-bold">
                    <span>{item.name}</span>
                    <button type="button" onClick={() => removeFromQuote(item.id)} aria-label={`Quitar ${item.name}`}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <a
                href={quoteItems.length ? createWhatsAppUrl(quoteMessage) : createWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary mt-5 w-full justify-center"
              >
                <MessageCircle size={18} />
                Enviar lista
              </a>
            </aside>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {!loadingProducts && filteredProducts.length === 0 && (
              <div className="border border-black/10 bg-warm p-6 text-sm font-bold text-steel md:col-span-2 xl:col-span-3">
                No hay productos publicados con esos filtros.
              </div>
            )}
            {filteredProducts.map((product) => (
              <article key={product.id} className="product-card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-steel">
                      {product.category}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-black text-graphite">
                      {product.name}
                    </h3>
                  </div>
                  <span className="tag">{product.tag}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-steel">{product.description}</p>
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="mt-4 h-40 w-full object-cover"
                    loading="lazy"
                  />
                )}
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className={`stock-badge stock-${product.stockStatus}`}>
                    {stockLabels[product.stockStatus]}
                  </span>
                  <span className="soft-badge">{product.useCase}</span>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setSelectedProduct(product)} className="btn btn-outline-dark justify-center">
                    <Eye size={17} />
                    Ver ficha
                  </button>
                  <button type="button" onClick={() => addToQuote(product)} className="btn btn-primary justify-center">
                    <Plus size={17} />
                    Agregar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {selectedProduct && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="product-title">
          <div className="product-modal">
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 grid size-10 place-items-center border border-black/10"
              aria-label="Cerrar ficha"
            >
              <X size={20} />
            </button>
            <p className="eyebrow mb-4">Ficha de producto</p>
            <h3 id="product-title" className="font-display text-3xl font-black uppercase text-graphite">
              {selectedProduct.name}
            </h3>
            <p className="mt-4 leading-7 text-steel">{selectedProduct.description}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="detail-box">
                <span>Categoría</span>
                <strong>{selectedProduct.category}</strong>
              </div>
              <div className="detail-box">
                <span>Stock</span>
                <strong>{stockLabels[selectedProduct.stockStatus]}</strong>
              </div>
              <div className="detail-box">
                <span>Uso recomendado</span>
                <strong>{selectedProduct.useCase}</strong>
              </div>
              <div className="detail-box">
                <span>Marca</span>
                <strong>{selectedProduct.brand}</strong>
              </div>
              <div className="detail-box">
                <span>Precio venta</span>
                <strong>{selectedProduct.salePrice ? `$${selectedProduct.salePrice.toLocaleString("es-AR")}` : "Consultar"}</strong>
              </div>
              <div className="detail-box">
                <span>Precio efectivo</span>
                <strong>{selectedProduct.cashPrice ? `$${selectedProduct.cashPrice.toLocaleString("es-AR")}` : "Consultar"}</strong>
              </div>
            </div>
            <ul className="mt-6 grid gap-2 text-sm font-semibold text-steel">
              {selectedProduct.technical.map((item) => (
                <li key={item} className="border-l-4 border-reyred bg-warm px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={createWhatsAppUrl(`Hola ReyMaq, quiero consultar disponibilidad de ${selectedProduct.name}.`)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary justify-center"
              >
                <MessageCircle size={18} />
                Consultar disponibilidad
              </a>
              <button
                type="button"
                onClick={() => addToQuote(selectedProduct)}
                className="btn btn-outline-dark justify-center"
              >
                <Plus size={18} />
                Agregar a cotización
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
