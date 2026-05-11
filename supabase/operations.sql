create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  document text,
  address text,
  status text not null default 'active'
    check (status in ('active', 'blocked', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  quote_number text unique not null,
  customer_id uuid references public.customers (id) on delete set null,
  customer_name text not null,
  customer_phone text,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'rejected', 'expired')),
  subtotal numeric(12, 2) not null default 0,
  discount_percent numeric(6, 2) not null default 0,
  discount_amount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  notes text not null default '',
  expires_at date,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  quantity numeric(12, 2) not null default 1,
  unit_price numeric(12, 2) not null default 0,
  discount_percent numeric(6, 2) not null default 0,
  line_total numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.customer_accounts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers (id) on delete set null,
  customer_name text not null,
  current_debt numeric(12, 2) not null default 0,
  last_payment_at date,
  credit_limit numeric(12, 2) not null default 0,
  purchase_history text not null default '',
  status text not null default 'current'
    check (status in ('current', 'late', 'blocked')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.repair_orders (
  id uuid primary key default gen_random_uuid(),
  repair_number text unique not null,
  customer_id uuid references public.customers (id) on delete set null,
  customer_name text not null,
  customer_phone text,
  machine text not null,
  brand_model text not null default '',
  problem text not null,
  status text not null default 'received'
    check (status in ('received', 'diagnosing', 'waiting_part', 'ready', 'delivered')),
  parts_cost numeric(12, 2) not null default 0,
  labor_cost numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  deposit numeric(12, 2) not null default 0,
  estimated_delivery date,
  photo_urls text[] not null default '{}',
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.internal_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  owner text not null default 'Equipo',
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high')),
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'done')),
  due_date date,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  employee text not null,
  action text not null,
  detail text not null,
  entity_type text,
  entity_id uuid,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  email text,
  employee_name text not null,
  role text not null default 'employee'
    check (role in ('owner', 'admin', 'seller', 'employee', 'readonly')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  phone text,
  email text,
  cuit text,
  address text,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.supplier_purchases (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid references public.suppliers (id) on delete set null,
  supplier_name text not null,
  receipt_number text,
  receipt_date date,
  image_url text,
  raw_text text not null default '',
  total numeric(12, 2) not null default 0,
  status text not null default 'draft'
    check (status in ('draft', 'reviewed', 'applied', 'cancelled')),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.supplier_purchase_items (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid not null references public.supplier_purchases (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  detected_name text not null,
  quantity numeric(12, 2) not null default 1,
  unit_cost numeric(12, 2) not null default 0,
  margin_percent numeric(6, 2) not null default 35,
  sale_price numeric(12, 2) not null default 0,
  action text not null default 'update'
    check (action in ('update', 'create', 'ignore')),
  created_at timestamptz not null default now()
);

create table if not exists public.receipt_scans (
  id uuid primary key default gen_random_uuid(),
  supplier_purchase_id uuid references public.supplier_purchases (id) on delete set null,
  image_url text,
  raw_text text not null default '',
  extracted_json jsonb not null default '{}'::jsonb,
  status text not null default 'pending'
    check (status in ('pending', 'analyzed', 'failed')),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace view public.smart_stock_alerts as
select
  id,
  name as product_name,
  stock_quantity,
  min_stock_quantity,
  cost_price,
  sale_price,
  case
    when coalesce(stock_quantity, 0) <= 0 then 'Sin stock'
    when coalesce(min_stock_quantity, 0) > 0 and coalesce(stock_quantity, 0) <= min_stock_quantity then 'Bajo stock'
    when cost_price > 0 and sale_price > 0 and ((sale_price - cost_price) / cost_price) < 0.18 then 'Margen bajo'
    else 'Ok'
  end as alert_status,
  case
    when coalesce(stock_quantity, 0) <= 0 then 'Comprar'
    when coalesce(min_stock_quantity, 0) > 0 and coalesce(stock_quantity, 0) <= min_stock_quantity then 'Reponer'
    when cost_price > 0 and sale_price > 0 and ((sale_price - cost_price) / cost_price) < 0.18 then 'Revisar precio'
    else 'Sin accion'
  end as suggested_action
from public.products
where
  coalesce(stock_quantity, 0) <= 0
  or (coalesce(min_stock_quantity, 0) > 0 and coalesce(stock_quantity, 0) <= min_stock_quantity)
  or (cost_price > 0 and sale_price > 0 and ((sale_price - cost_price) / cost_price) < 0.18);

create index if not exists quotes_status_idx on public.quotes (status, created_at desc);
create index if not exists quote_items_quote_idx on public.quote_items (quote_id);
create index if not exists customer_accounts_status_idx on public.customer_accounts (status, current_debt desc);
create index if not exists repair_orders_status_idx on public.repair_orders (status, created_at desc);
create index if not exists internal_tasks_status_idx on public.internal_tasks (status, priority);
create index if not exists audit_events_created_idx on public.audit_events (created_at desc);
create index if not exists user_roles_user_idx on public.user_roles (user_id, is_active);
create index if not exists user_roles_email_idx on public.user_roles (lower(email), is_active);
create index if not exists suppliers_name_idx on public.suppliers (name);
create index if not exists supplier_purchases_supplier_idx on public.supplier_purchases (supplier_id, created_at desc);
create index if not exists supplier_purchase_items_purchase_idx on public.supplier_purchase_items (purchase_id);
create index if not exists receipt_scans_created_idx on public.receipt_scans (created_at desc);

drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at
before update on public.customers
for each row
execute function public.set_updated_at();

drop trigger if exists quotes_set_updated_at on public.quotes;
create trigger quotes_set_updated_at
before update on public.quotes
for each row
execute function public.set_updated_at();

drop trigger if exists customer_accounts_set_updated_at on public.customer_accounts;
create trigger customer_accounts_set_updated_at
before update on public.customer_accounts
for each row
execute function public.set_updated_at();

drop trigger if exists repair_orders_set_updated_at on public.repair_orders;
create trigger repair_orders_set_updated_at
before update on public.repair_orders
for each row
execute function public.set_updated_at();

drop trigger if exists internal_tasks_set_updated_at on public.internal_tasks;
create trigger internal_tasks_set_updated_at
before update on public.internal_tasks
for each row
execute function public.set_updated_at();

drop trigger if exists user_roles_set_updated_at on public.user_roles;
create trigger user_roles_set_updated_at
before update on public.user_roles
for each row
execute function public.set_updated_at();

drop trigger if exists suppliers_set_updated_at on public.suppliers;
create trigger suppliers_set_updated_at
before update on public.suppliers
for each row
execute function public.set_updated_at();

drop trigger if exists supplier_purchases_set_updated_at on public.supplier_purchases;
create trigger supplier_purchases_set_updated_at
before update on public.supplier_purchases
for each row
execute function public.set_updated_at();

alter table public.customers enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;
alter table public.customer_accounts enable row level security;
alter table public.repair_orders enable row level security;
alter table public.internal_tasks enable row level security;
alter table public.audit_events enable row level security;
alter table public.user_roles enable row level security;
alter table public.suppliers enable row level security;
alter table public.supplier_purchases enable row level security;
alter table public.supplier_purchase_items enable row level security;
alter table public.receipt_scans enable row level security;

insert into storage.buckets (id, name, public)
values ('supplier-receipts', 'supplier-receipts', true)
on conflict (id) do nothing;

drop policy if exists "Authenticated users can manage customers" on public.customers;
create policy "Authenticated users can manage customers"
on public.customers
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can manage quotes" on public.quotes;
create policy "Authenticated users can manage quotes"
on public.quotes
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can manage quote items" on public.quote_items;
create policy "Authenticated users can manage quote items"
on public.quote_items
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can manage customer accounts" on public.customer_accounts;
create policy "Authenticated users can manage customer accounts"
on public.customer_accounts
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can manage repair orders" on public.repair_orders;
create policy "Authenticated users can manage repair orders"
on public.repair_orders
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can manage internal tasks" on public.internal_tasks;
create policy "Authenticated users can manage internal tasks"
on public.internal_tasks
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can read audit events" on public.audit_events;
create policy "Authenticated users can read audit events"
on public.audit_events
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can create audit events" on public.audit_events;
create policy "Authenticated users can create audit events"
on public.audit_events
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can read user roles" on public.user_roles;
create policy "Authenticated users can read user roles"
on public.user_roles
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can manage user roles" on public.user_roles;
create policy "Authenticated users can manage user roles"
on public.user_roles
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can manage suppliers" on public.suppliers;
create policy "Authenticated users can manage suppliers"
on public.suppliers
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can manage supplier purchases" on public.supplier_purchases;
create policy "Authenticated users can manage supplier purchases"
on public.supplier_purchases
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can manage supplier purchase items" on public.supplier_purchase_items;
create policy "Authenticated users can manage supplier purchase items"
on public.supplier_purchase_items
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can manage receipt scans" on public.receipt_scans;
create policy "Authenticated users can manage receipt scans"
on public.receipt_scans
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can upload supplier receipts" on storage.objects;
create policy "Authenticated users can upload supplier receipts"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'supplier-receipts');

drop policy if exists "Authenticated users can read supplier receipts" on storage.objects;
create policy "Authenticated users can read supplier receipts"
on storage.objects
for select
to authenticated
using (bucket_id = 'supplier-receipts');
