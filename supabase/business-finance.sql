create extension if not exists pgcrypto;

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text,
  phone text,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_purchases (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid references public.suppliers(id) on delete set null,
  purchase_date date not null default current_date,
  description text not null default '',
  total_amount numeric(12, 2) not null default 0,
  paid_amount numeric(12, 2) not null default 0,
  payment_type text not null default 'cash' check (payment_type in ('cash', 'current_account')),
  due_date date,
  status text not null default 'open' check (status in ('open', 'partial', 'paid', 'overdue')),
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_payments (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid not null references public.supplier_purchases(id) on delete cascade,
  payment_date date not null default current_date,
  amount numeric(12, 2) not null default 0,
  method text not null default 'cash',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.daily_sales (
  id uuid primary key default gen_random_uuid(),
  sale_date date not null unique default current_date,
  cash_amount numeric(12, 2) not null default 0,
  transfer_amount numeric(12, 2) not null default 0,
  card_amount numeric(12, 2) not null default 0,
  account_amount numeric(12, 2) not null default 0,
  other_income numeric(12, 2) not null default 0,
  cost_estimate numeric(12, 2) not null default 0,
  salary_expense numeric(12, 2) not null default 0,
  other_expense numeric(12, 2) not null default 0,
  expense_notes text,
  notes text,
  created_at timestamptz not null default now()
);

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

alter table public.suppliers enable row level security;
alter table public.supplier_purchases enable row level security;
alter table public.supplier_payments enable row level security;
alter table public.daily_sales enable row level security;
alter table public.monthly_costs enable row level security;

drop policy if exists "Authenticated users manage suppliers" on public.suppliers;
create policy "Authenticated users manage suppliers" on public.suppliers
for all to authenticated using (true) with check (true);

drop policy if exists "Authenticated users manage supplier purchases" on public.supplier_purchases;
create policy "Authenticated users manage supplier purchases" on public.supplier_purchases
for all to authenticated using (true) with check (true);

drop policy if exists "Authenticated users manage supplier payments" on public.supplier_payments;
create policy "Authenticated users manage supplier payments" on public.supplier_payments
for all to authenticated using (true) with check (true);

drop policy if exists "Authenticated users manage daily sales" on public.daily_sales;
create policy "Authenticated users manage daily sales" on public.daily_sales
for all to authenticated using (true) with check (true);

drop policy if exists "Authenticated users manage monthly costs" on public.monthly_costs;
create policy "Authenticated users manage monthly costs" on public.monthly_costs
for all to authenticated using (true) with check (true);
