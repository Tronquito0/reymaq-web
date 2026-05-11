import { Camera, CheckCircle2, FileSearch, ImagePlus, PackagePlus, ScanLine, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import {
  analyzeReceiptImage,
  analyzeReceiptText,
  applyPurchaseToStock,
  fileToDataUrl,
  uploadReceiptImage
} from "../lib/purchases";

const demoText = `3 Disco corte 115 mm 950
1 Tubo Lusqtoff 108 pzs 48500
6 Mecha copa 32 mm 7200`;

const money = (value) =>
  Number(value || 0).toLocaleString("es-AR", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "ARS"
  });

export default function SupplierReceiptPanel() {
  const [supplier, setSupplier] = useState({ name: "", phone: "" });
  const [receipt, setReceipt] = useState({ number: "", date: new Date().toISOString().slice(0, 10) });
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [rawText, setRawText] = useState(demoText);
  const [items, setItems] = useState([]);
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitCost || 0), 0),
    [items]
  );

  const selectImage = (event) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;
    setFile(nextFile);
    setImagePreview(URL.createObjectURL(nextFile));
    setNotice("Imagen lista. Por ahora pega o corrige el texto detectado; el OCR automatico queda preparado para Edge Function.");
  };

  const analyze = () => {
    const detected = analyzeReceiptText(rawText);
    setItems(detected);
    setNotice(detected.length ? `${detected.length} productos detectados para revisar.` : "No pude detectar productos en ese texto.");
  };

  const analyzeWithAi = async () => {
    if (!file) {
      setNotice("Subi una foto del remito para usar OCR automatico.");
      return;
    }

    try {
      setNotice("Analizando imagen con OCR/IA...");
      const imageDataUrl = await fileToDataUrl(file);
      const result = await analyzeReceiptImage({ imageDataUrl, textHint: rawText });
      const nextItems = (result.items || []).map((item) => ({
        productName: item.productName,
        quantity: Number(item.quantity || 1),
        unitCost: Number(item.unitCost || 0),
        marginPercent: 35,
        salePrice: Math.round(Number(item.unitCost || 0) * 1.35),
        action: "create",
        productId: "",
        category: "General"
      }));
      if (result.supplierName) setSupplier((current) => ({ ...current, name: result.supplierName }));
      if (result.receiptNumber || result.receiptDate) {
        setReceipt((current) => ({
          ...current,
          number: result.receiptNumber || current.number,
          date: result.receiptDate || current.date
        }));
      }
      setItems(nextItems);
      setNotice(`${nextItems.length} productos extraidos por IA. Revisalos antes de cargar stock.`);
    } catch (error) {
      setNotice(`OCR automatico no disponible: ${error.message}. Podes seguir con el texto manual.`);
    }
  };

  const patchItem = (index, patch) => {
    setItems((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        const next = { ...item, ...patch };
        const margin = Number(next.marginPercent || 0);
        const cost = Number(next.unitCost || 0);
        return { ...next, salePrice: patch.salePrice ?? Math.round(cost * (1 + margin / 100)) };
      })
    );
  };

  const applyPurchase = async () => {
    if (!supplier.name || !items.length) {
      setNotice("Carga proveedor y analiza al menos un producto.");
      return;
    }

    setSaving(true);
    setNotice("");
    try {
      const imageUrl = file ? await uploadReceiptImage(file) : imagePreview;
      const result = await applyPurchaseToStock({ supplier, receipt, items, imageUrl, rawText });
      setNotice(`Compra ${result.purchase.id.slice(0, 8)} aplicada. ${result.applied.length} productos actualizados.`);
    } catch (error) {
      setNotice(`No se pudo aplicar en Supabase: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="supplier-receipt-panel">
      <div className="ops-panel-title">
        <span><ScanLine size={20} /></span>
        <div>
          <p>Remitos de proveedores</p>
          <h3>Escanea, revisa costos y carga stock masivamente</h3>
          <small>Foto desde celular, texto del remito, margen por producto y registro de compra al proveedor.</small>
        </div>
      </div>

      {notice && <p className="admin-notice">{notice}</p>}

      <div className="receipt-layout">
        <section className="control-card receipt-capture">
          <h4><Camera size={20} /> Captura</h4>
          <div className="receipt-fields">
            <label className="field field-dark">
              Proveedor
              <input value={supplier.name} onChange={(event) => setSupplier({ ...supplier, name: event.target.value })} />
            </label>
            <label className="field field-dark">
              Telefono
              <input value={supplier.phone} onChange={(event) => setSupplier({ ...supplier, phone: event.target.value })} />
            </label>
            <label className="field field-dark">
              Nro remito
              <input value={receipt.number} onChange={(event) => setReceipt({ ...receipt, number: event.target.value })} />
            </label>
            <label className="field field-dark">
              Fecha
              <input type="date" value={receipt.date} onChange={(event) => setReceipt({ ...receipt, date: event.target.value })} />
            </label>
          </div>
          <label className="receipt-upload">
            <ImagePlus size={22} />
            <span>Subir foto o sacar con el celular</span>
            <input type="file" accept="image/*" capture="environment" onChange={selectImage} />
          </label>
          {imagePreview && <img src={imagePreview} alt="Remito proveedor" className="receipt-preview" />}
        </section>

        <section className="control-card receipt-text">
          <h4><FileSearch size={20} /> Texto detectado</h4>
          <textarea value={rawText} onChange={(event) => setRawText(event.target.value)} />
          <div className="receipt-analyze-actions">
            <button type="button" onClick={analyzeWithAi} className="btn btn-primary">
              <ScanLine size={18} />
              OCR automatico
            </button>
            <button type="button" onClick={analyze} className="btn btn-outline-light">
              <Upload size={18} />
              Analizar texto
            </button>
          </div>
        </section>
      </div>

      <section className="control-card">
        <div className="receipt-review-head">
          <div>
            <span>Revision antes de impactar stock</span>
            <h4>{items.length} productos - Total compra {money(total)}</h4>
          </div>
          <button type="button" onClick={applyPurchase} className="btn btn-light" disabled={saving || !items.length}>
            <PackagePlus size={18} />
            {saving ? "Aplicando" : "Cargar al stock"}
          </button>
        </div>

        <div className="receipt-items-table">
          <div className="receipt-item-row receipt-item-head">
            <span>Producto</span>
            <span>Cant.</span>
            <span>Costo</span>
            <span>Ganancia %</span>
            <span>Venta</span>
            <span>Accion</span>
          </div>
          {items.map((item, index) => (
            <div key={`${item.productName}-${index}`} className="receipt-item-row">
              <input value={item.productName} onChange={(event) => patchItem(index, { productName: event.target.value })} />
              <input type="number" value={item.quantity} onChange={(event) => patchItem(index, { quantity: event.target.value })} />
              <input type="number" value={item.unitCost} onChange={(event) => patchItem(index, { unitCost: event.target.value })} />
              <input type="number" value={item.marginPercent} onChange={(event) => patchItem(index, { marginPercent: event.target.value })} />
              <input type="number" value={item.salePrice} onChange={(event) => patchItem(index, { salePrice: Number(event.target.value) })} />
              <select value={item.action} onChange={(event) => patchItem(index, { action: event.target.value })}>
                <option value="create">Crear</option>
                <option value="update">Actualizar</option>
                <option value="ignore">Ignorar</option>
              </select>
            </div>
          ))}
          {!items.length && (
            <div className="receipt-empty">
              <CheckCircle2 size={18} />
              Pega texto del remito y toca analizar para revisar productos.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
