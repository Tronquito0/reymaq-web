create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  description text not null default '',
  tag text not null default 'Consultar stock',
  stock_status text not null default 'consult'
    check (stock_status in ('available', 'consult', 'preorder', 'low', 'out')),
  use_case text not null default '',
  brand text not null default 'Varias marcas',
  technical text[] not null default '{}',
  sku text,
  cost_price numeric(12, 2) not null default 0,
  sale_price numeric(12, 2) not null default 0,
  cash_price numeric(12, 2) not null default 0,
  wholesale_price numeric(12, 2) not null default 0,
  card_3_markup_percent numeric(6, 2) not null default 35,
  price numeric(12, 2) generated always as (sale_price) stored,
  stock_quantity integer,
  min_stock_quantity integer not null default 0,
  image_url text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_active_sort_idx on public.products (is_active, sort_order, name);
create index if not exists products_featured_idx on public.products (is_featured) where is_featured = true;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

alter table public.products enable row level security;

drop policy if exists "Products are publicly readable" on public.products;
create policy "Products are publicly readable"
on public.products
for select
using (is_active = true);

drop policy if exists "Authenticated users can read all products" on public.products;
create policy "Authenticated users can read all products"
on public.products
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can manage products" on public.products;
create policy "Authenticated users can manage products"
on public.products
for all
to authenticated
using (true)
with check (true);
