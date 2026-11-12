/**
 * English courtesy translation of the legal documents in legal.ts.
 * The French text prevails in case of discrepancy.
 *
 * Type-only import from legal.ts: legal.ts imports this file, so a value
 * import would create a cycle. Helpers are re-declared locally for that reason.
 */
import type { LegalBlock, LegalDoc, LegalDocKey } from '@/content/legal';
import { SITE } from '@/lib/site';

const p = (text: string): LegalBlock => ({ type: 'p', text });
const list = (...items: string[]): LegalBlock => ({ type: 'list', items });

const L = SITE.legal;
const address = `${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city}, ${SITE.address.country}`;
const years = SITE.leadRetentionMonths / 12;
const contactEn = [
  SITE.phone && `by phone or WhatsApp on ${SITE.phone}`,
  SITE.email && `by email at ${SITE.email}`,
  `by post to ${L.name}, ${address}`,
  'via the [contact form](/contact)',
]
  .filter(Boolean)
  .join(', ');

const enNotice = p('This English version is a courtesy translation; in the event of any discrepancy, the French version prevails.');

const privacyEn: LegalDoc = {
  title: 'Privacy policy',
  metaDescription: `How ${SITE.name} collects, uses and protects your personal data (GDPR): purposes, retention periods, recipients and rights.`,
  intro: `${L.name} attaches great importance to the protection of your personal data. This policy explains what data we collect on ${SITE.url.replace(/^https?:\/\//, '')}, why, how long we keep it and how to exercise your rights, in accordance with the General Data Protection Regulation (GDPR, or RGPD in French) and the French loi Informatique et Libertés.`,
  sections: [
    {
      id: 'responsable',
      title: '1. Data controller',
      blocks: [
        enNotice,
        p(`The data controller is ${L.name}, a ${L.legalForm} registered with the ${L.rcs}, whose registered office is located at ${address}.`),
        p(`You can contact us ${contactEn}. Given the nature of its business, ${L.name} has not appointed a data protection officer.`),
      ],
    },
    {
      id: 'donnees',
      title: '2. Data collected',
      blocks: [
        p('We only collect the data needed to process your request:'),
        list(
          'Contact, vehicle request or search forms: name, phone number, email (optional), message (optional), site language and, where applicable, the vehicle concerned.',
          'Offer request from the customs clearance simulator: in addition to the data above, the simulation parameters (scheme, fuel, age and engine size of the vehicle, price, shipping and insurance costs, student status for the CCR scheme, estimated amount).',
          'Technical logs kept by the host: IP address, date and time, page requested and browser type, used solely for the security and proper operation of the site.'
        ),
        p('The site does not require visitors to create an account and does not use any audience measurement, advertising or profiling tool. Please do not send sensitive data or copies of identity documents in your messages: we will ask you for them, if necessary, at the time of sale.'),
      ],
    },
    {
      id: 'finalites',
      title: '3. Purposes and legal bases',
      blocks: [
        {
          type: 'table',
          head: ['Purpose', 'Legal basis (GDPR art. 6)'],
          rows: [
            ['Responding to your request, calling you back, preparing a quote or an offer', 'Pre-contractual measures taken at your request (6.1.b)'],
            ['Following up on our business exchanges and improving our service', 'Legitimate interest in managing our customer relationships (6.1.f)'],
            ['Site security, prevention of spam and abuse', 'Legitimate interest (6.1.f)'],
            ['Displaying external content (map, videos)', 'Your consent (6.1.a)'],
            ['Invoicing and accounting if you become a customer', 'Legal obligation (6.1.c)'],
          ],
        },
      ],
    },
    {
      id: 'destinataires',
      title: '4. Recipients',
      blocks: [
        p(`Your data is accessible only to authorised staff of ${L.name}. It is never sold, rented or transferred to third parties for commercial purposes. We use the following technical processors, bound by a data processing agreement:`),
        list(
          `${SITE.hosting.name} (${SITE.hosting.url}) — website hosting;`,
          `${SITE.dataHost.name} (${SITE.dataHost.url}) — database, hosted in the European Union (Ireland, eu-west-1 region).`
        ),
        p('If you choose to write to us on WhatsApp or via our social media accounts, the data exchanged is also processed by those platforms in accordance with their own privacy policies.'),
      ],
    },
    {
      id: 'transferts',
      title: '5. Transfers outside the European Union',
      blocks: [
        p(`Your requests are stored in the European Union. However, our providers ${SITE.hosting.name} (United States) and ${SITE.dataHost.name} (Singapore) may access them for service purposes. These transfers are governed by the European Commission’s standard contractual clauses and, where applicable, by the EU–US Data Privacy Framework.`),
      ],
    },
    {
      id: 'conservation',
      title: '6. Retention periods',
      blocks: [
        list(
          `Requests sent via the site: ${years} years from the date they are sent, after which they are automatically deleted.`,
          'Customer data: for the duration of the business relationship, then archived for the statutory periods (10 years for accounting records).',
          'Technical logs: 12 months maximum.',
          `Your cookie preferences: ${SITE.consentMaxAgeMonths} months.`
        ),
      ],
    },
    {
      id: 'droits',
      title: '7. Your rights',
      blocks: [
        p('You have the right to access, rectify, erase, restrict and port your data, the right to object to processing based on our legitimate interest, the right to withdraw your consent at any time and the right to give instructions regarding the handling of your data after your death.'),
        p(`To exercise these rights, contact us ${contactEn}. We will respond within one month. If we have reasonable doubts about your identity, we may ask you for proof of identity.`),
        p('If you consider that your rights have not been respected, you may lodge a complaint with the CNIL, 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 ([www.cnil.fr](https://www.cnil.fr/fr/plaintes)).'),
        p('If you do not wish to receive telephone marketing, you can register free of charge on the Bloctel opt-out list ([www.bloctel.gouv.fr](https://www.bloctel.gouv.fr)).'),
      ],
    },
    {
      id: 'securite',
      title: '8. Security',
      blocks: [
        p('The site is served exclusively over HTTPS. Access to requests is restricted to authenticated members of our team, and the database enforces access control that prevents any visitor from reading other people’s requests.'),
      ],
    },
    {
      id: 'cookies',
      title: '9. Cookies',
      blocks: [p('The use of cookies and other trackers is described in detail in our [cookie policy](/cookies).')],
    },
    {
      id: 'modifications',
      title: '10. Changes',
      blocks: [p('We may update this policy, in particular in the event of a change in the law or a new service. The date of the last update is shown at the top of this page.')],
    },
  ],
};

const mediator: { name: string; address: string; url: string } = L.mediator;
const termsEn: LegalDoc = {
  title: 'Terms of use',
  metaDescription: `Terms of use of the ${SITE.name} website: vehicle listings, customs clearance simulator, liability and intellectual property.`,
  intro: `These general terms of use (CGU) govern access to and use of the website ${SITE.url.replace(/^https?:\/\//, '')}, published by ${L.name}. By browsing the site, you accept these terms.`,
  sections: [
    {
      id: 'editeur',
      title: '1. Publisher',
      blocks: [
        enNotice,
        p(`The site is published by ${L.name}, a ${L.legalForm} registered with the ${L.rcs}, ${address}. All legal information is available in the [legal notice](/mentions-legales).`),
      ],
    },
    {
      id: 'acces',
      title: '2. Access to the site',
      blocks: [p('The site is accessible free of charge, without registration. We endeavour to keep it available but cannot guarantee this: it may be interrupted for maintenance, updates or technical reasons, without giving rise to any right to compensation.')],
    },
    {
      id: 'vehicules',
      title: '3. Vehicle listings',
      blocks: [
        list(
          'Listings are published for information purposes and subject to availability: a vehicle may be sold in the meantime.',
          'Prices are shown in euros including all taxes (TTC), unless marked “HT” (excluding tax). They may be changed at any time; the applicable price is the one stated on the purchase order.',
          'Photos, videos and specifications are provided with the greatest care but are not contractually binding. Only the purchase order and the vehicle documents are authoritative.',
          'Submitting a form is neither an order nor a reservation. A sale is only concluded upon signature of a purchase order with ' + L.name + ', and a reservation is only confirmed in writing.'
        ),
      ],
    },
    {
      id: 'simulateur',
      title: '4. Customs clearance simulator and export',
      blocks: [
        p('The customs clearance simulator provides an indicative estimate based on public rates and rules that are subject to change. It does not constitute tax or customs advice, nor a commitment as to the amount actually payable: only the Algerian customs authorities determine the duties and taxes due.'),
        p('We assist you with export formalities, but it is the buyer’s responsibility to check that the vehicle and their personal circumstances meet the import conditions in force in the country of destination.'),
      ],
    },
    {
      id: 'utilisation',
      title: '5. Use of forms',
      blocks: [p('You undertake to provide accurate information and not to submit any unlawful or abusive content or content that infringes the rights of third parties. We reserve the right not to follow up on abusive or automated requests.')],
    },
    {
      id: 'propriete',
      title: '6. Intellectual property',
      blocks: [p(`The texts, logos, trademarks, photos, videos and graphic elements of the site are the property of ${L.name} or its partners, or are used under licence. Any reproduction without written authorisation is prohibited. Media licensed under Creative Commons are credited in the [legal notice](/mentions-legales) and remain subject to their licence.`)],
    },
    {
      id: 'liens',
      title: '7. External links',
      blocks: [p('The site contains links to third-party services (WhatsApp, social media, maps). We have no control over these services and are not responsible for their content or practices.')],
    },
    {
      id: 'responsabilite',
      title: '8. Liability',
      blocks: [p(`${L.name} cannot be held liable for indirect damage arising from the use of the site, from its temporary unavailability, or from a decision taken solely on the basis of indicative information (listing, simulation). Nothing in these terms limits the rights you have as a consumer.`)],
    },
    {
      id: 'donnees',
      title: '9. Personal data',
      blocks: [p('The processing of your data is described in our [privacy policy](/confidentialite) and our [cookie policy](/cookies).')],
    },
    {
      id: 'litiges',
      title: '10. Complaints, mediation and governing law',
      blocks: [
        p(`For any complaint, contact us ${contactEn}: we always seek an amicable solution.`),
        ...(mediator.name
          ? [
              p(
                `In accordance with articles L611-1 et seq. of the French Code de la consommation, if your written complaint has not been resolved, you may refer the matter free of charge to the consumer mediator: ${mediator.name}${mediator.address ? `, ${mediator.address}` : ''}${mediator.url ? ` ([${mediator.url.replace(/^https?:\/\//, '')}](${mediator.url}))` : ''}.`
              ),
            ]
          : []),
        p('These terms are governed by French law. In the event of a dispute, and failing an amicable agreement, the competent courts are those designated by law; between professionals, jurisdiction is conferred on the courts within the jurisdiction of Pontoise.'),
      ],
    },
    {
      id: 'modification',
      title: '11. Changes to the terms',
      blocks: [p('We may amend these terms at any time. The applicable version is the one online at the time of your visit.')],
    },
  ],
};

const cookiesEn: LegalDoc = {
  title: 'Cookie policy',
  metaDescription: `Cookies and trackers used on the ${SITE.name} website: no advertising or audience measurement cookies, external content subject to your consent.`,
  intro: 'A cookie (or tracker) is a small piece of information stored in your browser. We use as few as possible: no advertising cookies, no audience measurement tools, no profiling.',
  sections: [
    {
      id: 'necessaires',
      title: '1. Strictly necessary trackers',
      blocks: [
        enNotice,
        p('These trackers are essential for the site to function or to remember your choices. They are exempt from consent (article 82 of the loi Informatique et Libertés).'),
        {
          type: 'table',
          head: ['Name', 'Purpose', 'Duration'],
          rows: [
            ['NEXT_LOCALE (cookie)', 'Remembers the chosen language (French, Arabic or English)', 'Browser session'],
            ['skh-consent-v1 (local storage)', 'Remembers your choice regarding external content', `${SITE.consentMaxAgeMonths} months`],
            ['sb-… (cookies)', 'Sign-in of our team to the administration area, never set for visitors', 'Sign-in session'],
          ],
        },
      ],
    },
    {
      id: 'externes',
      title: '2. External content (subject to your consent)',
      blocks: [
        p('Some pages offer content hosted by third parties. It is only loaded after you have given your consent: until you have allowed it, a placeholder replaces it and no data is sent to these services.'),
        {
          type: 'table',
          head: ['Service', 'Where', 'Data'],
          rows: [
            ['OpenStreetMap (OpenStreetMap Foundation, United Kingdom)', 'Map on the Contact page', 'IP address, technical browser data'],
            ['YouTube, in privacy-enhanced mode (Google Ireland Ltd)', 'Videos on some vehicle pages', 'IP address, trackers set by YouTube during playback'],
          ],
        },
        p('See the policies of these services: [OpenStreetMap](https://osmfoundation.org/wiki/Privacy_Policy) and [Google](https://policies.google.com/privacy).'),
      ],
    },
    {
      id: 'gerer',
      title: '3. Managing your choices',
      blocks: [
        p(`You can accept or refuse external content, then change your mind at any time using the button below or the “Manage cookies” link at the bottom of every page. Your choice is kept for ${SITE.consentMaxAgeMonths} months, after which you will be asked again. You can also delete cookies from your browser settings.`),
      ],
    },
    {
      id: 'plus',
      title: '4. Find out more',
      blocks: [p('To find out more about your data, see our [privacy policy](/confidentialite) or the CNIL website ([www.cnil.fr](https://www.cnil.fr/fr/cookies-et-autres-traceurs)).')],
    },
  ],
};

export const LEGAL_EN: Record<LegalDocKey, LegalDoc> = { privacy: privacyEn, terms: termsEn, cookies: cookiesEn };
