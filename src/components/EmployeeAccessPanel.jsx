import { KeyRound, Plus, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { getRoleRecords, saveRoleRecord } from "../lib/access";

const defaultAccess = [
  { name: "Duenio / Administrador", email: "admin@reymaq.com", roleLabel: "Duenio", status: "Activo" },
  { name: "Vendedor mostrador", email: "empleado@reymaq.com", roleLabel: "Vendedor", status: "Pendiente" }
];

const roleOptions = [
  ["seller", "Vendedor"],
  ["employee", "Empleado"],
  ["admin", "Admin"],
  ["readonly", "Solo lectura"],
  ["owner", "Duenio"]
];

export default function EmployeeAccessPanel() {
  const [records, setRecords] = useState(defaultAccess);
  const [form, setForm] = useState({ name: "", email: "", role: "seller" });
  const [notice, setNotice] = useState("");

  useEffect(() => {
    getRoleRecords()
      .then((items) => {
        if (items.length) setRecords(items);
      })
      .catch(() => setNotice("Modo demo: ejecuta el SQL actualizado para guardar roles por email."));
  }, []);

  const addAccess = async (event) => {
    event.preventDefault();
    if (!form.name || !form.email) return;
    const label = roleOptions.find(([value]) => value === form.role)?.[1] || "Empleado";
    try {
      const saved = await saveRoleRecord(form);
      setRecords((current) => [saved, ...current]);
      setNotice("Rol guardado. Crea el usuario en Supabase Auth con el mismo email.");
    } catch (_error) {
      setRecords((current) => [{ name: form.name, email: form.email, roleLabel: label, status: "Pendiente" }, ...current]);
      setNotice("Rol agregado en modo demo. Falta tabla user_roles o permisos en Supabase.");
    }
    setForm({ name: "", email: "", role: "seller" });
  };

  return (
    <div className="grid gap-5">
      <div className="ops-panel-title">
        <span><KeyRound size={20} /></span>
        <div>
          <p>Acceso empleados</p>
          <h3>Usuarios con rol antes de entrar al panel</h3>
          <small>Despues crea el usuario en Supabase Auth con el mismo email y una clave temporal.</small>
        </div>
      </div>

      {notice && <p className="admin-notice">{notice}</p>}

      <form onSubmit={addAccess} className="employee-access-form">
        <label className="field field-dark">
          Nombre
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </label>
        <label className="field field-dark">
          Email de login
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </label>
        <label className="field field-dark">
          Rol
          <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            {roleOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <button type="submit" className="btn btn-primary">
          <Plus size={18} />
          Crear acceso
        </button>
      </form>

      <div className="grid gap-4 lg:grid-cols-3">
        {records.map((record) => (
          <article key={`${record.email}-${record.name}`} className="control-card access-card">
            <ShieldCheck className="text-reyred" size={26} />
            <h4>{record.name}</h4>
            <p>{record.email}</p>
            <div>
              <span>{record.roleLabel}</span>
              <strong>{record.status}</strong>
            </div>
          </article>
        ))}
      </div>

      <article className="control-card access-note">
        <h4>Como activar la clave</h4>
        <p>
          En Supabase entra a Authentication, crea el usuario con ese email y una clave temporal.
          El rol queda registrado aca para limitar vistas y permisos en la siguiente etapa.
        </p>
      </article>
    </div>
  );
}
