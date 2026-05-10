alter table public.daily_sales
add column if not exists other_income numeric(12, 2) not null default 0,
add column if not exists salary_expense numeric(12, 2) not null default 0,
add column if not exists other_expense numeric(12, 2) not null default 0,
add column if not exists expense_notes text;

create table if not exists public.monthly_costs (
  id uuid primary key default gen_random_uuid(),
  month text not null unique,
  rent_amount numeric(12, 2) not null default 0,
  salaries_amount numeric(12, 2) not null default 0,
  services_amount numeric(12, 2) not null default 0,
  taxes_amount numeric(12, 2) not null default 0,
  debt_payments_amount numeric(12, 2) not null default 0,
  other_fixed_costs numeric(12, 2) not null default 0,
  target_margin_percent numeric(6, 2) not null default 35,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.monthly_costs enable row level security;

drop policy if exists "Authenticated users manage monthly costs" on public.monthly_costs;
create policy "Authenticated users manage monthly costs"
on public.monthly_costs
for all to authenticated
using (true)
with check (true);
