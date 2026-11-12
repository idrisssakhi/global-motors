import type { PostContent } from './types';

/** English translations (missing slugs fall back to French). */
export const POSTS_EN: Record<string, PostContent> = {
  'importer-voiture-algerie-2026': {
    title: 'Importing a car into Algeria in 2026: what’s changing',
    description:
      '2026 Finance Act: permanent return with a CCR for vehicles under 5 years old, engine capped at 1,800 cm³, diesel excluded, new DZD 8,000 tax.',
    blocks: [
      {
        type: 'p',
        text: 'The 2026 Finance Act changed the rules for importing vehicles by private individuals. The main new feature concerns Algerians living abroad who return to the country permanently: they can now import a used vehicle under 5 years old free of duties, under strict conditions. Here are the essentials, and what stays the same.',
      },
      { type: 'h2', id: 'deux-regimes', text: 'Two schemes not to be confused' },
      {
        type: 'list',
        items: [
          '**Resident in Algeria — vehicle under 3 years old**: the scheme in place since 2023. One vehicle every 3 years per person, petrol, hybrid or electric. Duties and taxes are payable, with a reduction depending on the engine type (see our [dedicated guide](/blog/importer-voiture-moins-3-ans-algerie)).',
          '**Permanent return with a certificate of change of residence (CCR) — under 5 years old**: the new 2026 scheme. The vehicle enters free of duties and taxes if all the conditions are met.',
        ],
      },
      { type: 'h2', id: 'conditions-ccr', text: 'Conditions for a permanent return (CCR)' },
      {
        type: 'list',
        items: [
          'Hold Algerian nationality and be registered with an Algerian consulate.',
          'Provide proof of at least **3 years of uninterrupted residence** abroad and obtain the certificate of change of residence.',
          'Not have already benefited from the advantages linked to a change of residence.',
          'A vehicle that is **new or under 5 years old** when it enters the customs territory.',
          '**Petrol, hybrid or electric** engine; engine capacity **up to 1,800 cm³** (down from 2,000 cm³ previously). Light commercial vehicles up to 5.95 t gross vehicle weight are also covered.',
          'Total value of the goods (vehicle and household effects included) capped at **DZD 10 million** (DZD 8 million for students and trainees).',
          'Vehicles that arrived at port before 1 January 2026 are excluded.',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Diesel is excluded from the exemption. A diesel vehicle can still be imported in some cases, but it bears the full duties and taxes, which can exceed 50% of its value.',
      },
      { type: 'h2', id: 'frais', text: 'The costs you still have to pay' },
      {
        type: 'p',
        text: 'Even when exempt from duties, a permanent return has a cost: chancery fees are paid at the consulate before departure, calculated on the value of the declared inventory (reduced rate for students). In Algeria, a new tax of **DZD 8,000** applies to imported vehicles subject to roadworthy inspection; it is paid at the tax office after customs clearance and before registration.',
      },
      {
        type: 'p',
        text: 'Our [customs clearance simulator](/simulateur-dedouanement) covers both schemes: choose “CCR” to see the consular fees and automatically check the age, engine capacity and value cap.',
      },
      { type: 'h2', id: 'chez-nous', text: 'How we help you' },
      {
        type: 'p',
        text: 'Every vehicle in our [stock](/voitures) now shows its eligibility (“< 3 years”, “CCR < 5 years”) and an estimated delivered-to-Algeria price. Before any purchase, an adviser checks your situation and the vehicle’s compliance.',
      },
    ],
  },

  'importer-voiture-moins-3-ans-algerie': {
    title: 'Resident in Algeria: importing a vehicle under 3 years old',
    description:
      'Conditions, how duties and taxes are calculated, the Decree 23-74 reduction and documents: the guide to importing a car under 3 years old from France.',
    blocks: [
      {
        type: 'p',
        text: 'Since 2023, a private individual resident in Algeria can import a used passenger car under 3 years old. It is the most common route for buying a car in France. Here are the conditions, how duties are calculated and the documents you need.',
      },
      { type: 'h2', id: 'conditions', text: 'The conditions' },
      {
        type: 'list',
        items: [
          'Be resident in Algeria.',
          'Only one vehicle imported **every 3 years** per person.',
          'A vehicle **under 3 years old** (from the date of first registration).',
          '**Petrol, hybrid or electric** engine: diesel is not allowed for private individuals.',
        ],
      },
      { type: 'h2', id: 'calcul', text: 'How duties and taxes are calculated' },
      {
        type: 'steps',
        items: [
          '**Customs value**: the purchase price (or a reference value depreciated by age, if higher) + freight + insurance, converted into dinars.',
          '**Customs duty** depending on engine type and engine capacity.',
          '**Solidarity contribution** (3%) and **PRCT levy** (2%) on the customs value.',
          '**VAT** (19%) on the customs value plus the duties and contributions.',
          '**Decree 23-74 reduction** on the total, for used vehicles: 80% for electric, 50% for petrol or hybrid up to 1,800 cm³, 20% above that.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Rates change with each finance act. Our [simulator](/simulateur-dedouanement) applies the rates in force to the best of our knowledge; only the calculation by Algerian customs is authoritative.',
      },
      { type: 'h2', id: 'ht', text: 'Buying VAT-free in France' },
      {
        type: 'p',
        text: 'For export outside the European Union, a vehicle on which VAT is recoverable can be invoiced excluding VAT, on presentation of proof of export. The saving (20% in France) offsets part of the Algerian duties. In our stock, the price excluding VAT is shown where it applies.',
      },
      { type: 'h2', id: 'documents', text: 'The documents you need' },
      {
        type: 'list',
        items: [
          'The purchase invoice itemising the price (excluding VAT for export).',
          'The registration certificate, in the seller’s name or accompanied by a certificate of transfer.',
          'The export document (EX-A / EX1), issued **before shipment**.',
          'A roadworthy inspection less than 3 years old, where applicable.',
          'In Algeria: customs clearance, vehicle inspection by the Mines service, then registration.',
        ],
      },
      {
        type: 'p',
        text: 'Returning to the country for good? The CCR scheme, open to vehicles under 5 years old since 2026, may be more advantageous: read [what’s changing in 2026](/blog/importer-voiture-algerie-2026).',
      },
    ],
  },

  'ports-alger-oran-restriction-ete': {
    title: 'Ports of Algiers and Oran: the summer restriction on imported vehicles',
    description:
      'Every summer, imported vehicles that are new or under 3 years old may be barred from the ports of Algiers and Oran. How to plan your import.',
    blocks: [
      {
        type: 'p',
        text: 'In 2026, the entry of vehicles that are new or under 3 years old, bought abroad and intended for import, was banned at the ports of Algiers and Oran **from 15 June to 15 September**, according to notices relayed by shipping companies. The aim: to ease congestion at these ports during the passenger crossing season.',
      },
      { type: 'h2', id: 'consequences', text: 'What this means for your purchase' },
      {
        type: 'list',
        items: [
          'A vehicle bought at the end of May can end up stuck until mid-September if the crossing is planned to Algiers or Oran.',
          'Other ports may stay open during this period: feasibility depends on sailing schedules and must be checked at the time of booking.',
          'The categories covered differ between the companies’ notices: have the rule confirmed for your specific vehicle.',
        ],
      },
      { type: 'h2', id: 'anticiper', text: 'How to plan ahead' },
      {
        type: 'steps',
        items: [
          'Aim for arrival **before mid-June or after mid-September**: allow generally 2 to 4 weeks between purchase and arrival at port.',
          'If you are buying in spring, finalise the vehicle and export documents early.',
          'During the summer, ask us which ports and dates are possible before you commit.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'This measure is announced every year by the Algerian authorities and may change. We update this guide as soon as a new notice is published.',
      },
    ],
  },

  'acheter-voiture-france-export-eviter-arnaques': {
    title: 'Buying a car in France for export: the essential checks',
    description:
      'Registration document, certificate of transfer, no-lien certificate, history, export document: the checks to demand before buying a vehicle for the Maghreb.',
    blocks: [
      {
        type: 'p',
        text: 'An investigation revealed that more than 900 cars stolen in Europe had been fraudulently exported from the port of Marseille to Algeria between May 2024 and May 2025. A stolen vehicle can be seized, even months after it arrives: the buyer then loses both the car and the money. Here are the checks to demand, whoever the seller is.',
      },
      { type: 'h2', id: 'papiers', text: 'Papers in the seller’s name' },
      {
        type: 'list',
        items: [
          'The **registration certificate** (carte grise) must be in the seller’s name. If not, demand the **certificate of transfer** proving the chain of ownership (for example between the manufacturer and the dealer).',
          'The **certificate of administrative status** (no-lien certificate): it proves the vehicle is not subject to a lien, not stolen and not blocked by an objection.',
          'The vehicle’s **history** (HistoVec report in France): previous owners, declared accidents, roadworthy inspections.',
        ],
      },
      { type: 'h2', id: 'signaux', text: 'Warning signs' },
      {
        type: 'list',
        items: [
          'A car offered “customs-cleared, turnkey” without any document in your name.',
          'A seller who asks you to declare a lower price than the one you paid: this is illegal and risky for you.',
          'A price far below the market, cash payment required, a company that cannot be traced.',
        ],
      },
      { type: 'h2', id: 'export', text: 'Export documents' },
      {
        type: 'p',
        text: 'The export document (EX-A / EX1) must be issued before shipment: it proves the vehicle has left the European Union and allows the VAT-free sale. A detailed invoice in the buyer’s name is essential for customs clearance.',
      },
      { type: 'h2', id: 'nous', text: 'Our commitments' },
      {
        type: 'p',
        text: 'SKH Global Motors is a SAS (simplified joint-stock company) registered in France (SIRET 991 121 880 00017). For every vehicle, we check its origin and documents, and we give you a compliant invoice and proof of export. See our [legal notice](/mentions-legales) or [contact us](/contact) with any questions.',
      },
    ],
  },

  'export-voiture-tunisie-maroc': {
    title: 'Exporting a car from France to Tunisia or Morocco',
    description:
      'Buying in France, export documents, sea transport: how we support the export of a vehicle to Tunisia and Morocco.',
    blocks: [
      {
        type: 'p',
        text: 'While Algeria is our main market, we also support, on request, the export of vehicles to Tunisia and Morocco. The French side of the process is the same; it is the import rules of the destination country that differ.',
      },
      { type: 'h2', id: 'france', text: 'What we handle in France' },
      {
        type: 'list',
        items: [
          'Finding and inspecting the vehicle, in France or elsewhere in Europe.',
          'The purchase, with a VAT-free invoice when VAT is recoverable.',
          'The export documents (EX-A / EX1), the registration certificate and proof of origin.',
          'Transport to the departure port and booking the crossing.',
        ],
      },
      { type: 'h2', id: 'arrivee', text: 'On arrival: rules specific to each country' },
      {
        type: 'p',
        text: 'Maximum vehicle age, permitted engine types, duties and taxes, schemes reserved for nationals living abroad: each country has its own rules, which change with its finance acts. We check the conditions in force with you before the purchase, but only the customs of the destination country are authoritative.',
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Our online simulator only calculates Algerian duties. For Tunisia or Morocco, ask us for a personalised estimate.',
      },
      { type: 'h2', id: 'devis', text: 'Request a quote' },
      {
        type: 'p',
        text: 'Tell us the model you are looking for, your budget and the destination country via the [contact form](/contact) or on WhatsApp: an adviser will reply with a full cost breakdown.',
      },
    ],
  },
};
