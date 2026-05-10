import { Calculator, Eye, EyeOff, ImagePlus, LogIn, LogOut, Percent, Save, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { getAdminProducts, updateProduct } from "../lib/products";

const money = (value) =>
  Number(value || 0).toLocaleString("es-AR", {
    maximumFractionDigits: 0
  });

const getRoi = (product) => {
  const cost = Number(product.costPrice || 0);
  const sale = Number(product.salePrice || 0);
  if (!cost) return { profit: sale, percent: 0 };
  const profit = sale - cost;
  return { profit, percent: (profit / cost) * 100 };
};

export default function ProductAdminPanel() {
  const [session, setSession] = useState(null);
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");
  const [bulkMargin, setBulkMargin] = useState("40");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;

    setLoading(true);
    getAdminProducts()
      .then(setProducts)
      .catch((error) => setNotice(error.message))
      .finally(() => setLoading(false));
  }, [session]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) =>
      [product.sku, product.name, product.category, product.brand].join(" ").toLowerCase().includes(term)
    );
  }, [products, search]);

  const selectedProducts = selectedIds.length
    ? products.filter((product) => selectedIds.includes(product.id))
    : filteredProducts;

  const metrics = useMemo(() => {
    const active = products.filter((product) => product.isActive).length;
    const withPrice = products.filter((product) => Number(product.salePrice) > 0).length;
    const totalCost = products.reduce((sum, product) => sum + Number(product.costPrice || 0), 0);
    const totalSale = products.reduce((sum, product) => sum + Number(product.salePrice || 0), 0);
    const roi = totalCost ? ((totalSale - totalCost) / totalCost) * 100 : 0;
    return { active, withPrice, roi };
  }, [products]);

  const signIn = async (event) => {
    event.preventDefault();
    setNotice("");
    const { error } = await supabase.auth.signInWithPassword(authForm);
    if (error) setNotice(error.message);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProducts([]);
    setSelectedIds([]);
  };

  const patchProduct = (productId, patch) => {
    setProducts((current) =>
      current.map((product) => (product.id === productId ? { ...product, ...patch } : product))
    );
  };

  const saveProduct = async (product) => {
    setSavingId(product.id);
    setNotice("");
    try {
      const saved = await updateProduct(product);
      setProducts((current) => current.map((item) => (item.id === saved.id ? saved : item)));
      setNotice(`Guardado: ${saved.name}`);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSavingId("");
    }
  };

  const applyBulkMargin = async () => {
    const margin = Number(bulkMargin || 0);
    const nextProducts = selectedProducts.map((product) => {
      const salePrice = Math.round(Number(product.costPrice || 0) * (1 + margin / 100));
      return {
        ...product,
        salePrice,
        cashPrice: salePrice,
        wholesalePrice: Math.round(salePrice * 0.9)
      };
    });

    setSavingId("bulk");
    setNotice("");
    try {
      const saved = await Promise.all(nextProducts.map(updateProduct));
      setProducts((current) =>
        current.map((product) => saved.find((item) => item.id === product.id) || product)
      );
      setNotice(`Actualizados ${saved.length} productos con ${margin}% de ganancia.`);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSavingId("");
    }
  };

  const toggleSelected = (productId) => {
    setSelectedIds((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]
    );
  };

  if (!session) {
    return (
      <form onSubmit={signIn} className="control-card admin-login-card">
        <div>
          <h4>Ingresar al panel de productos</h4>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Usá un usuario creado en Supabase Auth para editar precios, stock e imagenes.
          </p>
        </div>
        <label className="field field-dark">
          Email
          <input
            type="email"
            value={authForm.email}
            onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
            placeholder="admin@reymaq.com"
          />
        </label>
        <label className="field field-dark">
          Clave
          <input
            type="password"
            value={authForm.password}
            onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
            placeholder="********"
          />
        </label>
        {notice && <p className="admin-notice">{notice}</p>}
        <button type="submit" className="btn btn-primary justify-center" disabled={loading}>
          <LogIn size={18} />
          Entrar
        </button>
      </form>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="admin-products-toolbar">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45" size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="admin-search"
            placeholder="Buscar por codigo, producto, categoria o marca"
          />
        </div>
        <label className="field field-dark admin-margin-field">
          Ganancia %
          <input
            type="number"
            value={bulkMargin}
            onChange={(event) => setBulkMargin(event.target.value)}
          />
        </label>
        <button type="button" onClick={applyBulkMargin} className="btn btn-primary" disabled={savingId === "bulk"}>
          <Percent size={18} />
          Aplicar
        </button>
        <button type="button" onClick={signOut} className="btn btn-outline-light">
          <LogOut size={18} />
          Salir
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="metric-card">
          <span>Productos</span>
          <strong>{products.length}</strong>
          <p>{filteredProducts.length} visibles en busqueda</p>
        </article>
        <article className="metric-card">
          <span>Publicados</span>
          <strong>{metrics.active}</strong>
          <p>{metrics.withPrice} con precio de venta</p>
        </article>
        <article className="metric-card">
          <span>ROI global</span>
          <strong>{metrics.roi.toFixed(1)}%</strong>
          <p>Segun costo y venta cargados</p>
        </article>
      </div>

      {notice && <p className="admin-notice">{notice}</p>}

      <div className="admin-products-grid">
        {loading && <div className="control-card">Cargando productos...</div>}
        {!loading &&
          filteredProducts.map((product) => {
            const roi = getRoi(product);
            const card3Price = Math.round(Number(product.salePrice || 0) * (1 + Number(product.card3MarkupPercent || 0) / 100));
            const imageSearchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${product.name} ${product.category}`)}`;

            return (
              <article key={product.id} className="admin-product-card">
                <div className="admin-product-head">
                  <label className="admin-check">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => toggleSelected(product.id)}
                    />
                    <span>{product.sku || "Sin codigo"}</span>
                  </label>
                  <button
                    type="button"
                    className={`admin-visibility ${product.isActive ? "is-live" : ""}`}
                    onClick={() => {
                      const next = { ...product, isActive: !product.isActive };
                      patchProduct(product.id, { isActive: next.isActive });
                      saveProduct(next);
                    }}
                  >
                    {product.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                    {product.isActive ? "Publicado" : "Oculto"}
                  </button>
                </div>

                <label className="field field-dark">
                  Producto
                  <input
                    value={product.name}
                    onChange={(event) => patchProduct(product.id, { name: event.target.value })}
                    onBlur={() => saveProduct(product)}
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <label className="field field-dark">
                    Costo
                    <input
                      type="number"
                      value={product.costPrice}
                      onChange={(event) => patchProduct(product.id, { costPrice: event.target.value })}
                      onBlur={() => saveProduct(product)}
                    />
                  </label>
                  <label className="field field-dark">
                    Venta
                    <input
                      type="number"
                      value={product.salePrice}
                      onChange={(event) => patchProduct(product.id, { salePrice: event.target.value })}
                      onBlur={() => saveProduct(product)}
                    />
                  </label>
                  <label className="field field-dark">
                    Efectivo
                    <input
                      type="number"
                      value={product.cashPrice}
                      onChange={(event) => patchProduct(product.id, { cashPrice: event.target.value })}
                      onBlur={() => saveProduct(product)}
                    />
                  </label>
                  <label className="field field-dark">
                    Mayoreo
                    <input
                      type="number"
                      value={product.wholesalePrice}
                      onChange={(event) => patchProduct(product.id, { wholesalePrice: event.target.value })}
                      onBlur={() => saveProduct(product)}
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <label className="field field-dark">
                    Recargo 3 pagos %
                    <input
                      type="number"
                      value={product.card3MarkupPercent}
                      onChange={(event) => patchProduct(product.id, { card3MarkupPercent: event.target.value })}
                      onBlur={() => saveProduct(product)}
                    />
                  </label>
                  <label className="field field-dark">
                    Stock
                    <input
                      type="number"
                      value={product.stockQuantity}
                      onChange={(event) => patchProduct(product.id, { stockQuantity: event.target.value })}
                      onBlur={() => saveProduct(product)}
                    />
                  </label>
                  <label className="field field-dark">
                    Minimo
                    <input
                      type="number"
                      value={product.minStockQuantity}
                      onChange={(event) => patchProduct(product.id, { minStockQuantity: event.target.value })}
                      onBlur={() => saveProduct(product)}
                    />
                  </label>
                  <label className="field field-dark">
                    Categoria
                    <input
                      value={product.category}
                      onChange={(event) => patchProduct(product.id, { category: event.target.value })}
                      onBlur={() => saveProduct(product)}
                    />
                  </label>
                </div>

                <div className="admin-price-summary">
                  <span><Calculator size={15} /> ROI {roi.percent.toFixed(1)}%</span>
                  <span>Ganancia ${money(roi.profit)}</span>
                  <span>3 pagos ${money(card3Price)}</span>
                </div>

                <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-end">
                  <label className="field field-dark">
                    URL imagen
                    <input
                      value={product.imageUrl}
                      onChange={(event) => patchProduct(product.id, { imageUrl: event.target.value })}
                      onBlur={() => saveProduct(product)}
                      placeholder="https://..."
                    />
                  </label>
                  <a href={imageSearchUrl} target="_blank" rel="noreferrer" className="btn btn-outline-light justify-center">
                    <ImagePlus size={18} />
                    Buscar imagen
                  </a>
                  <button type="button" onClick={() => saveProduct(product)} className="btn btn-primary justify-center">
                    <Save size={18} />
                    {savingId === product.id ? "Guardando" : "Guardar"}
                  </button>
                </div>
              </article>
            );
          })}
      </div>
    </div>
  );
}
