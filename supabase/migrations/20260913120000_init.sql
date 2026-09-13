-- ════════════════════════════════════════════════════════════════════
-- 20260913120000_init — baseline schema for SKH Global Motors
--   • cars           : inventory (public read, admin write)
--   • leads          : contact / reservation / customs-quote requests
--                      (public insert only, admin read/update/delete)
--   • customs_settings : Algerian customs rates used by the simulator
--                      (single row, public read, admin write)
--   • Storage bucket "car-images"
-- ════════════════════════════════════════════════════════════════════

-- Enums ----------------------------------------------------------------
do $$ begin
  create type fuel_type as enum ('essence', 'diesel', 'hybride', 'electrique', 'gpl');
exception when duplicate_object then null; end $$;

do $$ begin
  create type gearbox_type as enum ('manuelle', 'automatique');
exception when duplicate_object then null; end $$;

do $$ begin
  create type car_status as enum ('disponible', 'reserve', 'vendu');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_kind as enum ('contact', 'vehicule', 'dedouanement', 'recherche');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_status as enum ('nouveau', 'en_cours', 'traite');
exception when duplicate_object then null; end $$;

-- updated_at helper ----------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Cars -----------------------------------------------------------------
create table if not exists public.cars (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  slug               text not null unique,
  make               text not null,
  model              text not null,
  version            text,                        -- finition, ex: GT Line
  year               int  not null,
  first_registration date,                        -- clé pour la règle « moins de 3 ans »
  immatriculation    text,
  price_eur          numeric(12,2) not null,      -- prix TTC
  price_ht           numeric(12,2),               -- prix HT (TVA récupérable / export)
  vat_recoverable    boolean not null default false,
  mileage_km         int  not null default 0,
  fuel               fuel_type    not null default 'essence',
  gearbox            gearbox_type not null default 'automatique',
  engine_cc          int,                         -- cylindrée, utilisée par le simulateur DZ
  power_hp           int,
  doors              int,
  seats              int,
  color              text,
  location           text default 'Argenteuil, France',

  title_fr           text,
  title_ar           text,
  description_fr     text,
  description_ar     text,

  images             text[] not null default '{}',
  video_url          text,                        -- optionnel : vidéo YouTube / MP4

  featured           boolean not null default false,
  export_dz          boolean not null default true,
  status             car_status not null default 'disponible'
);

create index if not exists cars_status_idx   on public.cars (status);
create index if not exists cars_featured_idx on public.cars (featured);
create index if not exists cars_make_idx     on public.cars (make);
create index if not exists cars_created_idx  on public.cars (created_at desc);

drop trigger if exists cars_set_updated_at on public.cars;
create trigger cars_set_updated_at
  before update on public.cars
  for each row execute function public.set_updated_at();

alter table public.cars enable row level security;

drop policy if exists "cars_public_read" on public.cars;
drop policy if exists "cars_auth_insert" on public.cars;
drop policy if exists "cars_auth_update" on public.cars;
drop policy if exists "cars_auth_delete" on public.cars;

create policy "cars_public_read" on public.cars for select using (true);
create policy "cars_auth_insert" on public.cars for insert to authenticated with check (true);
create policy "cars_auth_update" on public.cars for update to authenticated using (true) with check (true);
create policy "cars_auth_delete" on public.cars for delete to authenticated using (true);

-- Leads ----------------------------------------------------------------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  kind        lead_kind   not null default 'contact',
  status      lead_status not null default 'nouveau',
  name        text not null check (char_length(name) between 2 and 120),
  phone       text not null check (char_length(phone) between 6 and 40),
  email       text check (email is null or char_length(email) <= 200),
  message     text check (message is null or char_length(message) <= 4000),
  car_id      uuid references public.cars (id) on delete set null,
  locale      text check (locale in ('fr', 'ar')),
  payload     jsonb not null default '{}'::jsonb  -- ex: détail du calcul de dédouanement
);

create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_status_idx  on public.leads (status);

alter table public.leads enable row level security;

drop policy if exists "leads_public_insert" on public.leads;
drop policy if exists "leads_auth_read"     on public.leads;
drop policy if exists "leads_auth_update"   on public.leads;
drop policy if exists "leads_auth_delete"   on public.leads;

-- Visitors can submit a lead but can never read them back.
create policy "leads_public_insert" on public.leads for insert to anon, authenticated
  with check (status = 'nouveau');
create policy "leads_auth_read"   on public.leads for select to authenticated using (true);
create policy "leads_auth_update" on public.leads for update to authenticated using (true) with check (true);
create policy "leads_auth_delete" on public.leads for delete to authenticated using (true);

-- Customs settings (single row, id = 1) --------------------------------
create table if not exists public.customs_settings (
  id                     int primary key default 1 check (id = 1),
  updated_at             timestamptz not null default now(),
  exchange_rate_dzd      numeric(10,2) not null default 150.00, -- DZD pour 1 €
  dd_rate_small          numeric(6,4)  not null default 0.15,   -- D.D ≤ small_engine_max_cc
  dd_rate_large          numeric(6,4)  not null default 0.30,   -- D.D au-delà
  dd_rate_electric       numeric(6,4)  not null default 0.15,
  small_engine_max_cc    int           not null default 1500,
  cs_rate                numeric(6,4)  not null default 0.03,   -- contribution de solidarité
  prct_rate              numeric(6,4)  not null default 0.02,   -- prélèvement PRCT
  tva_rate               numeric(6,4)  not null default 0.19,
  abatt_electric         numeric(6,4)  not null default 0.80,   -- décret 23-74 (occasion < 3 ans)
  abatt_small            numeric(6,4)  not null default 0.50,   -- essence/hybride ≤ abatt_threshold_cc
  abatt_large            numeric(6,4)  not null default 0.20,
  abatt_threshold_cc     int           not null default 1800,
  default_freight_eur    numeric(10,2) not null default 600.00, -- transport maritime indicatif
  default_insurance_eur  numeric(10,2) not null default 150.00,
  notes                  text
);

insert into public.customs_settings (id) values (1) on conflict (id) do nothing;

drop trigger if exists customs_settings_set_updated_at on public.customs_settings;
create trigger customs_settings_set_updated_at
  before update on public.customs_settings
  for each row execute function public.set_updated_at();

alter table public.customs_settings enable row level security;

drop policy if exists "customs_public_read" on public.customs_settings;
drop policy if exists "customs_auth_update" on public.customs_settings;

create policy "customs_public_read" on public.customs_settings for select using (true);
create policy "customs_auth_update" on public.customs_settings for update to authenticated using (true) with check (true);

-- Storage bucket for car photos ----------------------------------------
insert into storage.buckets (id, name, public)
values ('car-images', 'car-images', true)
on conflict (id) do nothing;

drop policy if exists "car_images_public_read" on storage.objects;
drop policy if exists "car_images_auth_write"  on storage.objects;
drop policy if exists "car_images_auth_delete" on storage.objects;

create policy "car_images_public_read" on storage.objects for select
  using (bucket_id = 'car-images');
create policy "car_images_auth_write" on storage.objects for insert to authenticated
  with check (bucket_id = 'car-images');
create policy "car_images_auth_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'car-images');
