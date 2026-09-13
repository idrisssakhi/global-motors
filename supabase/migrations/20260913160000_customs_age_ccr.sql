-- ════════════════════════════════════════════════════════════════════
-- 20260913160000_customs_age_ccr — vehicle age valuation + CCR regime
--   • Age: customs may replace the invoice by a reference value (argus),
--     net of foreign VAT (× 0.833) and depreciated per year of age.
--   • CCR (certificat de changement de résidence, LF 2026 art. 127):
--     vehicles < 5 years, ≤ 1 800 cm³, no diesel, duty & tax exempt
--     under a goods-value ceiling; consular fees + technical inspection.
-- ════════════════════════════════════════════════════════════════════

alter table public.customs_settings
  add column if not exists depreciation_per_year  numeric(6,4)  not null default 0.10,
  add column if not exists foreign_vat_coef       numeric(6,4)  not null default 0.833,
  add column if not exists ccr_max_age_years      int           not null default 5,
  add column if not exists ccr_max_cc             int           not null default 1800,
  add column if not exists ccr_ceiling_dzd        numeric(14,2) not null default 10000000,
  add column if not exists ccr_consular_fixed_eur numeric(10,2) not null default 40,
  add column if not exists ccr_consular_rate      numeric(6,4)  not null default 0.04,
  add column if not exists ccr_inspection_dzd     numeric(10,2) not null default 8000;

comment on column public.customs_settings.depreciation_per_year is 'Dépréciation de la valeur de référence par année d''âge (0.10 = 10 %)';
comment on column public.customs_settings.foreign_vat_coef is 'Coefficient de retrait de la TVA étrangère sur la valeur de référence (0.833)';
comment on column public.customs_settings.ccr_ceiling_dzd is 'Plafond de valeur des biens importés sous CCR (DA)';
comment on column public.customs_settings.ccr_consular_rate is 'Droits de chancellerie CCR proportionnels à la valeur déclarée';
