import { Clock, LogIn, LogOut, Plus, RefreshCcw, UserRoundCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createStaffMember, getAttendanceData, upsertAttendanceRecord } from "../lib/attendance";
import { today } from "../lib/finance";

const money = (value) => `$${Number(value || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

const nowTime = () => new Date().toTimeString().slice(0, 5);

const emptyStaff = {
  full_name: "",
  role: "Empleado",
  phone: "",
  daily_salary: "",
  expected_entry_time: "08:00",
  expected_exit_time: "17:00",
  notes: ""
};

const getHours = (record) => {
  if (!record.entry_time || !record.exit_time) return 0;
  const entry = new Date(`${record.work_date}T${record.entry_time}`);
  const exit = new Date(`${record.work_date}T${record.exit_time}`);
  const minutes = Math.max(0, (exit - entry) / 60000 - Number(record.break_minutes || 0));
  return minutes / 60;
};

export default function AttendancePanel() {
  const [staff, setStaff] = useState([]);
  const [records, setRecords] = useState([]);
  const [staffForm, setStaffForm] = useState(emptyStaff);
  const [activeDate, setActiveDate] = useState(today());
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    setNotice("");
    try {
      const data = await getAttendanceData();
      setStaff(data.staff);
      setRecords(data.records);
    } catch (error) {
      setNotice(`Presentismo no esta inicializado: ejecuta supabase/attendance.sql. Detalle: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const dayRecords = useMemo(
    () => records.filter((record) => record.work_date === activeDate),
    [activeDate, records]
  );

  const metrics = useMemo(() => {
    const present = dayRecords.filter((record) => ["present", "late", "half_day"].includes(record.status)).length;
    const late = dayRecords.filter((record) => record.status === "late").length;
    const hours = dayRecords.reduce((sum, record) => sum + getHours(record), 0);
    const estimatedPay = dayRecords.reduce((sum, record) => {
      if (record.status === "absent" || record.status === "day_off") return sum;
      if (record.status === "half_day") return sum + Number(record.staff_members?.daily_salary || 0) / 2;
      return sum + Number(record.staff_members?.daily_salary || 0);
    }, 0);
    return { present, late, hours, estimatedPay };
  }, [dayRecords]);

  const submitStaff = async (event) => {
    event.preventDefault();
    if (!staffForm.full_name.trim()) return;
    const created = await createStaffMember(staffForm);
    setStaff((current) => [...current, created].sort((a, b) => a.full_name.localeCompare(b.full_name)));
    setStaffForm(emptyStaff);
  };

  const saveRecord = async (staffMember, patch) => {
    const current = records.find((record) => record.staff_id === staffMember.id && record.work_date === activeDate);
    const expectedEntry = staffMember.expected_entry_time;
    const entryTime = patch.entry_time || current?.entry_time || "";
    const isLate = expectedEntry && entryTime && entryTime > expectedEntry;
    const saved = await upsertAttendanceRecord({
      staff_id: staffMember.id,
      work_date: activeDate,
      status: isLate ? "late" : current?.status || "present",
      break_minutes: current?.break_minutes || 0,
      notes: current?.notes || "",
      ...current,
      ...patch
    });
    setRecords((items) => [saved, ...items.filter((item) => item.id !== saved.id && !(item.staff_id === saved.staff_id && item.work_date === saved.work_date))]);
  };

  return (
    <div className="attendance-panel">
      <div className="finance-top">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-reyred">Presentismo</p>
          <h3>Entrada, salida y control de empleados</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <input className="admin-date-input" type="date" value={activeDate} onChange={(event) => setActiveDate(event.target.value)} />
          <button type="button" onClick={refresh} className="btn btn-outline-light"><RefreshCcw size={18} />Actualizar</button>
        </div>
      </div>

      {notice && <p className="admin-notice">{notice}</p>}

      <div className="grid gap-4 md:grid-cols-4">
        <article className="metric-card"><span>Empleados</span><strong>{staff.length}</strong><p>{loading ? "Cargando" : "Activos"}</p></article>
        <article className="metric-card"><span>Presentes</span><strong>{metrics.present}</strong><p>{metrics.late} llegadas tarde</p></article>
        <article className="metric-card"><span>Horas</span><strong>{metrics.hours.toFixed(1)}</strong><p>Horas trabajadas</p></article>
        <article className="metric-card"><span>Pago estimado</span><strong>{money(metrics.estimatedPay)}</strong><p>Segun jornal diario</p></article>
      </div>

      <div className="attendance-layout">
        <form onSubmit={submitStaff} className="control-card">
          <h4><UserRoundCheck size={20} /> Alta de empleado</h4>
          <label className="field field-dark">Nombre<input value={staffForm.full_name} onChange={(event) => setStaffForm({ ...staffForm, full_name: event.target.value })} /></label>
          <label className="field field-dark">Rol<input value={staffForm.role} onChange={(event) => setStaffForm({ ...staffForm, role: event.target.value })} /></label>
          <label className="field field-dark">Telefono<input value={staffForm.phone} onChange={(event) => setStaffForm({ ...staffForm, phone: event.target.value })} /></label>
          <label className="field field-dark">Jornal diario<input type="number" value={staffForm.daily_salary} onChange={(event) => setStaffForm({ ...staffForm, daily_salary: event.target.value })} /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="field field-dark">Entrada esperada<input type="time" value={staffForm.expected_entry_time} onChange={(event) => setStaffForm({ ...staffForm, expected_entry_time: event.target.value })} /></label>
            <label className="field field-dark">Salida esperada<input type="time" value={staffForm.expected_exit_time} onChange={(event) => setStaffForm({ ...staffForm, expected_exit_time: event.target.value })} /></label>
          </div>
          <button className="btn btn-primary justify-center" type="submit"><Plus size={18} />Agregar empleado</button>
        </form>

        <section className="control-card">
          <h4><Clock size={20} /> Jornada del dia</h4>
          <div className="attendance-list">
            {staff.map((staffMember) => {
              const record = records.find((item) => item.staff_id === staffMember.id && item.work_date === activeDate);
              return (
                <article key={staffMember.id} className="attendance-row">
                  <div>
                    <strong>{staffMember.full_name}</strong>
                    <span>{staffMember.role} - entrada esperada {staffMember.expected_entry_time || "-"}</span>
                  </div>
                  <div className="attendance-actions">
                    <button type="button" onClick={() => saveRecord(staffMember, { entry_time: nowTime(), status: "present" })}><LogIn size={16} />Entrada</button>
                    <button type="button" onClick={() => saveRecord(staffMember, { exit_time: nowTime() })}><LogOut size={16} />Salida</button>
                    <select value={record?.status || "present"} onChange={(event) => saveRecord(staffMember, { status: event.target.value })}>
                      <option value="present">Presente</option>
                      <option value="late">Tarde</option>
                      <option value="absent">Ausente</option>
                      <option value="half_day">Medio dia</option>
                      <option value="day_off">Franco</option>
                    </select>
                  </div>
                  <div className="attendance-times">
                    <span>Entrada: {record?.entry_time || "-"}</span>
                    <span>Salida: {record?.exit_time || "-"}</span>
                    <span>Horas: {getHours(record || {}).toFixed(1)}</span>
                  </div>
                </article>
              );
            })}
            {!staff.length && <p className="text-sm text-white/60">Agrega tu primer empleado para usar presentismo.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
