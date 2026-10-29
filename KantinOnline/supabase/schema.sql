create type public.user_role as enum ('pembeli', 'penjual');
create type public.payment_method as enum ('QRIS', 'Saldo', 'Tunai');
create type public.payment_status as enum ('PENDING', 'SUCCESS', 'FAILED');

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null unique,
  role public.user_role not null default 'pembeli',
  balance numeric(12, 2) not null default 0 check (balance >= 0),
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(12, 2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  image_url text
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete restrict,
  total_price numeric(12, 2) not null check (total_price > 0),
  payment_method public.payment_method not null,
  payment_status public.payment_status not null default 'PENDING',
  created_at timestamptz not null default now()
);

create table public.transaction_items (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.transactions (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete restrict,
  quantity integer not null check (quantity > 0),
  price numeric(12, 2) not null check (price >= 0)
);

grant usage on schema public to anon, authenticated;
grant select on public.products to anon, authenticated;
grant select on public.users, public.transactions, public.transaction_items to authenticated;

alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.transactions enable row level security;
alter table public.transaction_items enable row level security;

create policy "Users can read their own profile"
  on public.users for select to authenticated
  using (id = (select auth.uid()));

create policy "Products are readable by everyone"
  on public.products for select to anon, authenticated
  using (true);

create policy "Users can read their own transactions"
  on public.transactions for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Users can read items from their own transactions"
  on public.transaction_items for select to authenticated
  using (
    exists (
      select 1
      from public.transactions
      where transactions.id = transaction_items.transaction_id
        and transactions.user_id = (select auth.uid())
    )
  );

create function public.create_user_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, name, email)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_user_profile();

create function public.save_transaction(
  p_total_price numeric,
  p_payment_method public.payment_method,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_transaction_id uuid;
  v_calculated_total numeric(12, 2);
begin
  if v_user_id is null then
    raise exception 'Login diperlukan untuk menyimpan transaksi.';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Transaksi harus memiliki setidaknya satu item.';
  end if;

  select coalesce(sum(products.price * (item.value ->> 'quantity')::integer), 0)
  into v_calculated_total
  from jsonb_array_elements(p_items) as item(value)
  join public.products on products.id = (item.value ->> 'product_id')::uuid
  where (item.value ->> 'quantity')::integer > 0;

  if exists (
    select 1
    from jsonb_array_elements(p_items) as item(value)
    where coalesce((item.value ->> 'quantity')::integer, 0) <= 0
      or not exists (
        select 1 from public.products
        where products.id = (item.value ->> 'product_id')::uuid
      )
  ) then
    raise exception 'Item transaksi tidak valid atau produk tidak ditemukan.';
  end if;

  if p_total_price <= 0 or round(p_total_price, 2) <> v_calculated_total then
    raise exception 'Total transaksi tidak sesuai dengan harga produk saat ini.';
  end if;

  insert into public.transactions (user_id, total_price, payment_method)
  values (v_user_id, v_calculated_total, p_payment_method)
  returning id into v_transaction_id;

  insert into public.transaction_items (transaction_id, product_id, quantity, price)
  select
    v_transaction_id,
    products.id,
    (item.value ->> 'quantity')::integer,
    products.price
  from jsonb_array_elements(p_items) as item(value)
  join public.products on products.id = (item.value ->> 'product_id')::uuid;

  return v_transaction_id;
end;
$$;

revoke all on function public.save_transaction(numeric, public.payment_method, jsonb)
  from public, anon;
grant execute on function public.save_transaction(numeric, public.payment_method, jsonb)
  to authenticated;
