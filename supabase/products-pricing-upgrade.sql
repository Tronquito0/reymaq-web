alter table public.products
add column if not exists cost_price numeric(12, 2) not null default 0,
add column if not exists sale_price numeric(12, 2) not null default 0,
add column if not exists cash_price numeric(12, 2) not null default 0,
add column if not exists wholesale_price numeric(12, 2) not null default 0,
add column if not exists card_3_markup_percent numeric(6, 2) not null default 35,
add column if not exists min_stock_quantity integer not null default 0;

update public.products
set
  sale_price = coalesce(nullif(sale_price, 0), coalesce(price, 0)),
  cash_price = coalesce(nullif(cash_price, 0), coalesce(price, 0)),
  wholesale_price = coalesce(wholesale_price, 0),
  cost_price = coalesce(cost_price, 0),
  card_3_markup_percent = coalesce(card_3_markup_percent, 35),
  min_stock_quantity = coalesce(min_stock_quantity, 0);

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
