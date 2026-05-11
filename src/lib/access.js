import { supabase } from "./supabase";

const roleLabels = {
  owner: "Duenio",
  admin: "Admin",
  seller: "Vendedor",
  employee: "Empleado",
  readonly: "Solo lectura"
};

export const getRoleRecords = async () => {
  const { data, error } = await supabase
    .from("user_roles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map((role) => ({
    id: role.id,
    name: role.employee_name,
    email: role.email || "",
    role: role.role,
    roleLabel: roleLabels[role.role] || role.role,
    status: role.is_active ? "Activo" : "Inactivo"
  }));
};

export const saveRoleRecord = async ({ name, email, role }) => {
  const { data, error } = await supabase
    .from("user_roles")
    .insert({
      employee_name: name,
      email,
      role,
      is_active: true
    })
    .select("*")
    .single();

  if (error) throw error;
  return {
    id: data.id,
    name: data.employee_name,
    email: data.email || "",
    role: data.role,
    roleLabel: roleLabels[data.role] || data.role,
    status: data.is_active ? "Activo" : "Inactivo"
  };
};
