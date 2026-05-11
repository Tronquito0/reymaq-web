create extension if not exists pgcrypto;

create table if not exists public.staff_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text not null default 'Empleado',
  phone text,
  daily_salary numeric(12, 2) not null default 0,
  expected_entry_time time,
  expected_exit_time time,
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.staff_members(id) on delete cascade,
  work_date date not null default current_date,
  entry_time time,
  exit_time time,
  break_minutes integer not null default 0,
  status text not null default 'present' check (status in ('present', 'late', 'absent', 'half_day', 'day_off')),
  notes text,
  created_at timestamptz not null default now(),
  unique (staff_id, work_date)
);

alter table public.staff_members enable row level security;
alter table public.attendance_records enable row level security;

drop policy if exists "Authenticated users manage staff" on public.staff_members;
create policy "Authenticated users manage staff"
on public.staff_members
for all to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users manage attendance" on public.attendance_records;
create policy "Authenticated users manage attendance"
on public.attendance_records
for all to authenticated
using (true)
with check (true);
