import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('common');
  return (
    <section className="bg-grid grid min-h-[80svh] place-items-center px-5 pt-24 text-center">
      <div>
        <p className="font-display text-brand text-8xl font-bold sm:text-9xl">404</p>
        <h1 className="font-display mt-4 text-3xl font-semibold text-white">{t('notFoundTitle')}</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">{t('notFoundText')}</p>
        <Link href="/" className="btn-primary mt-8">
          {t('backHome')}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
