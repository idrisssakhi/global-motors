import { legalPage } from '@/lib/legal-page';
import { CookieSettingsButton } from '@/components/CookieConsent';

const { generateMetadata, Page } = legalPage(
  'cookies',
  <CookieSettingsButton className="btn-primary mt-8" />
);
export { generateMetadata };
export default Page;
