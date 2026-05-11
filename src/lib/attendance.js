import { supabase } from "./supabase";
import { today } from "./finance";

const number = (value) => Number(value || 0);

export const getAttendanceData = async () => {
  const [staff, records] = await Promise.all([
    supabase.from("staff_members").select("*").order("full_name", { ascending: true }),
    supabase
      .from("attendance_records")
      .select("*, staff_members(full_name, role, daily_salary)")
      .order("work_date", { ascending: false })
      .limit(120)
  ]);

  const error = staff.error || records.error;
  if (error) throw error;

  return {
    staff: staff.data || [],
    records: records.data || []
  };
};

export const createStaffMember = async (staff) => {
  const { data, error } = await supabase
    .from("staff_members")
    .insert({
      ...staff,
      daily_salary: number(staff.daily_salary),
      expected_entry_time: staff.expected_entry_time || null,
      expected_exit_time: staff.expected_exit_time || null
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
};

export const upsertAttendanceRecord = async (record) => {
  const { data, error } = await supabase
    .from("attendance_records")
    .upsert(
      {
        ...record,
        work_date: record.work_date || today(),
        entry_time: record.entry_time || null,
        exit_time: record.exit_time || null,
        break_minutes: number(record.break_minutes)
      },
      { onConflict: "staff_id,work_date" }
    )
    .select("*, staff_members(full_name, role, daily_salary)")
    .single();
  if (error) throw error;
  return data;
};
