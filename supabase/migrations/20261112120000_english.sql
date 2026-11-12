-- English version of the site: optional EN car copy (falls back to FR in the
-- app) and English visitor requests.

alter table public.cars
  add column if not exists title_en text,
  add column if not exists description_en text;

alter table public.leads drop constraint if exists leads_locale_check;
alter table public.leads
  add constraint leads_locale_check check (locale in ('fr', 'ar', 'en'));
