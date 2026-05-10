import {
  Calculator,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  FolderTree,
  ImagePlus,
  LogIn,
  LogOut,
  Percent,
  Save,
  Search
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { getAdminProducts, updateProduct } from "../lib/products";

const pageSize = 50;

const money = (value) =>
  Number(value || 0).toLocaleString("es-AR", {
    maximumFractionDigits: 0
  });

const getRoi = (product) => {
  const cost = Number(product?.costPrice || 0);
  const sale = Number(product?.salePrice || 0);
  if (!cost) return { profit: sale, percent: 0 };
  const profit = sale - cost;
  return { profit, percent: (profit / cost) * 100 };
};

export default function ProductAdminPanel() {
  const [session, setSession] = useState(null);
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [activeDepartment, setActiveDepartment] = useState("Todos");
  const [search, setSearch] = useState("");
  const [bulkMargin, setBulkMargin] = useState("40");
  const [page, setPage] = useState(1);
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
      .then((items) => {
        setProducts(items);
        setSelectedProductId(items[0]?.id || "");
      })
      .catch((error) => setNotice(error.message))
      .finally(() => setLoading(false));
  }, [session]);

  const departments = useMemo(() => {
    const map = new Map();
    products.forEach((product) => {
      const name = product.category || "Sin departamento";
      const current = map.get(name) || { name, count: 0, active: 0 };
      current.count += 1;
      if (product.isActive) current.active += 1;
      map.set(name, current);
    });

    return [
      { name: "Todos", count: products.length, active: products.filter((product) => product.isActive).length },
      ...Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesDepartment = activeDepartment === "Todos" || product.category === activeDepartment;
      const matchesSearch =
        !term ||
        [product.sku, product.name, product.category, product.brand].join(" ").toLowerCase().includes(term);

      return matchesDepartment && matchesSearch;
    });
  }, [activeDepartment, products, search]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visibleProducts = filteredProducts.slice((safePage - 1) * pageSize, safePage * pageSize);
  const selectedProduct = products.find((product) => product.id === selectedProductId) || visibleProducts[0];
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

  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [activeDepartment, search]);

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
    setSelectedProductId("");
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
      setSelectedProductId(saved.id);
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

  const toggleCurrentPage = () => {
    const pageIds = visibleProducts.map((product) => product.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    setSelectedIds((current) =>
      allSelected
        ? current.filter((id) => !pageIds.includes(id))
        : [...new Set([...current, ...pageIds])]
    );
  };

  if (!session) {
    return (
      <form onSubmit={signIn} className="control-card admin-login-card">
        <div>
          <h4>Ingresar al panel de productos</h4>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Usa un usuario creado en Supabase Auth para editar precios, stock e imagenes.
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

  const roi = getRoi(selectedProduct);
  const card3Price = Math.round(
    Number(selectedProduct?.salePrice || 0) * (1 + Number(selectedProduct?.card3MarkupPercent || 0) / 100)
  );
  const imageSearchUrl = selectedProduct
    ? `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${selectedProduct.name} ${selectedProduct.category}`)}`
    : "#";

  return (
    <div className="grid gap-5">
      <div className="admin-products-toolbar">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45" size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="admin-search"
            placeholder="Buscar por codigo, descripcion, departamento o marca"
          />
        </div>
        <label className="field field-dark admin-margin-field">
          Ganancia %
          <input type="number" value={bulkMargin} onChange={(event) => setBulkMargin(event.target.value)} />
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
          <p>{filteredProducts.length} en vista actual</p>
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

      <div className="admin-inventory-layout">
        <aside className="admin-departments">
          <div className="admin-panel-title">
            <FolderTree size={17} />
            Departamentos
          </div>
          <div className="admin-department-list">
            {departments.map((department) => (
              <button
                key={department.name}
                type="button"
                className={`admin-department ${activeDepartment === department.name ? "is-active" : ""}`}
                onClick={() => setActiveDepartment(department.name)}
              >
                <span>{department.name}</span>
                <strong>{department.count}</strong>
              </button>
            ))}
          </div>
        </aside>

        <section className="admin-inventory-table-wrap">
          <div className="admin-table-actions">
            <button type="button" onClick={toggleCurrentPage} className="btn btn-outline-light">
              Seleccionar pagina
            </button>
            <span>
              {selectedIds.length || filteredProducts.length} productos para accion masiva
            </span>
          </div>

          <div className="inventory-table">
            <div className="inventory-row inventory-head">
              <span></span>
              <span>Codigo</span>
              <span>Descripcion</span>
              <span>Costo</span>
              <span>Venta</span>
              <span>Existencia</span>
              <span>Estado</span>
            </div>
            {loading && <div className="inventory-empty">Cargando inventario...</div>}
            {!loading &&
              visibleProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className={`inventory-row ${selectedProduct?.id === product.id ? "is-selected" : ""}`}
                  onClick={() => setSelectedProductId(product.id)}
                >
                  <span onClick={(event) => event.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => toggleSelected(product.id)}
                    />
                  </span>
                  <span>{product.sku || "-"}</span>
                  <strong>{product.name}</strong>
                  <span>${money(product.costPrice)}</span>
                  <span className="sale-price">${money(product.salePrice)}</span>
                  <span>{product.stockQuantity || "-"}</span>
                  <span>{product.isActive ? "Publicado" : "Oculto"}</span>
                </button>
              ))}
            {!loading && visibleProducts.length === 0 && (
              <div className="inventory-empty">No hay productos para ese filtro.</div>
            )}
          </div>

          <div className="admin-pager">
            <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))}>
              <ChevronLeft size={16} />
            </button>
            <span>
              Pagina {safePage} de {pageCount} - {filteredProducts.length} productos
            </span>
            <button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))}>
              <ChevronRight size={16} />
            </button>
          </div>
        </section>

        <aside className="admin-editor">
          {!selectedProduct && <div className="control-card">Selecciona un producto para editar.</div>}
          {selectedProduct && (
            <article className="admin-product-card">
              <div className="admin-product-head">
                <div>
                  <span className="admin-editor-code">{selectedProduct.sku || "Sin codigo"}</span>
                  <h4>{selectedProduct.name}</h4>
                </div>
                <button
                  type="button"
                  className={`admin-visibility ${selectedProduct.isActive ? "is-live" : ""}`}
                  onClick={() => {
                    const next = { ...selectedProduct, isActive: !selectedProduct.isActive };
                    patchProduct(selectedProduct.id, { isActive: next.isActive });
                    saveProduct(next);
                  }}
                >
                  {selectedProduct.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                  {selectedProduct.isActive ? "Publicado" : "Oculto"}
                </button>
              </div>

              <label className="field field-dark">
                Descripcion
                <input
                  value={selectedProduct.name}
                  onChange={(event) => patchProduct(selectedProduct.id, { name: event.target.value })}
                  onBlur={() => saveProduct(selectedProduct)}
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="field field-dark">
                  Precio costo
                  <input
                    type="number"
                    value={selectedProduct.costPrice}
                    onChange={(event) => patchProduct(selectedProduct.id, { costPrice: event.target.value })}
                    onBlur={() => saveProduct(selectedProduct)}
                  />
                </label>
                <label className="field field-dark">
                  Precio venta
                  <input
                    type="number"
                    value={selectedProduct.salePrice}
                    onChange={(event) => patchProduct(selectedProduct.id, { salePrice: event.target.value })}
                    onBlur={() => saveProduct(selectedProduct)}
                  />
                </label>
                <label className="field field-dark">
                  Efectivo
                  <input
                    type="number"
                    value={selectedProduct.cashPrice}
                    onChange={(event) => patchProduct(selectedProduct.id, { cashPrice: event.target.value })}
                    onBlur={() => saveProduct(selectedProduct)}
                  />
                </label>
                <label className="field field-dark">
                  Mayoreo
                  <input
                    type="number"
                    value={selectedProduct.wholesalePrice}
                    onChange={(event) => patchProduct(selectedProduct.id, { wholesalePrice: event.target.value })}
                    onBlur={() => saveProduct(selectedProduct)}
                  />
                </label>
                <label className="field field-dark">
                  Recargo 3 pagos %
                  <input
                    type="number"
                    value={selectedProduct.card3MarkupPercent}
                    onChange={(event) => patchProduct(selectedProduct.id, { card3MarkupPercent: event.target.value })}
                    onBlur={() => saveProduct(selectedProduct)}
                  />
                </label>
                <label className="field field-dark">
                  Stock
                  <input
                    type="number"
                    value={selectedProduct.stockQuantity}
                    onChange={(event) => patchProduct(selectedProduct.id, { stockQuantity: event.target.value })}
                    onBlur={() => saveProduct(selectedProduct)}
                  />
                </label>
                <label className="field field-dark">
                  Minimo
                  <input
                    type="number"
                    value={selectedProduct.minStockQuantity}
                    onChange={(event) => patchProduct(selectedProduct.id, { minStockQuantity: event.target.value })}
                    onBlur={() => saveProduct(selectedProduct)}
                  />
                </label>
                <label className="field field-dark">
                  Departamento
                  <input
                    value={selectedProduct.category}
                    onChange={(event) => patchProduct(selectedProduct.id, { category: event.target.value })}
                    onBlur={() => saveProduct(selectedProduct)}
                  />
                </label>
              </div>

              <div className="admin-price-summary">
                <span><Calculator size={15} /> ROI {roi.percent.toFixed(1)}%</span>
                <span>Ganancia ${money(roi.profit)}</span>
                <span>3 pagos ${money(card3Price)}</span>
              </div>

              <label className="field field-dark">
                URL imagen
                <input
                  value={selectedProduct.imageUrl}
                  onChange={(event) => patchProduct(selectedProduct.id, { imageUrl: event.target.value })}
                  onBlur={() => saveProduct(selectedProduct)}
                  placeholder="https://..."
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <a href={imageSearchUrl} target="_blank" rel="noreferrer" className="btn btn-outline-light justify-center">
                  <ImagePlus size={18} />
                  Buscar imagen
                </a>
                <button type="button" onClick={() => saveProduct(selectedProduct)} className="btn btn-primary justify-center">
                  <Save size={18} />
                  {savingId === selectedProduct.id ? "Guardando" : "Guardar"}
                </button>
              </div>
            </article>
          )}
        </aside>
      </div>
    </div>
  );
}
