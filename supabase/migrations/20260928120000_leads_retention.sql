-- ════════════════════════════════════════════════════════════════════
-- 20260928120000_leads_retention — GDPR storage limitation
--   Visitor requests are deleted 36 months after they were sent, as stated
--   in the privacy policy (SITE.leadRetentionMonths in src/lib/site.ts).
--   Runs nightly with pg_cron.
-- ════════════════════════════════════════════════════════════════════

create extension if not exists pg_cron with schema pg_catalog;

-- cron.schedule upserts by job name, so re-running is safe.
select cron.schedule(
  'purge-expired-leads',
  '17 3 * * *',
  $$delete from public.leads where created_at < now() - interval '36 months'$$
);
