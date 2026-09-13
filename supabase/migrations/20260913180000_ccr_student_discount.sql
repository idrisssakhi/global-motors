-- ════════════════════════════════════════════════════════════════════
-- 20260913180000_ccr_student_discount — CCR consular fee for students
--   Chancellery fees: 40 € + 4 € per 100 € bracket of the declared
--   inventory value, paid at the consulate before departure; students
--   and trainees get a 50 % reduction.
-- ════════════════════════════════════════════════════════════════════

alter table public.customs_settings
  add column if not exists ccr_student_discount numeric(6,4) not null default 0.50;

comment on column public.customs_settings.ccr_consular_rate is 'Droits de chancellerie CCR : montant par euro, appliqué par tranche de 100 € (0.04 = 4 € / 100 €)';
comment on column public.customs_settings.ccr_student_discount is 'Réduction des droits de chancellerie CCR pour étudiants / stagiaires';
