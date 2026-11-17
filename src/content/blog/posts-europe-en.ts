import type { PostContent } from './types';

/** English translations — guides on buying and selling cars across Europe. */
export const POSTS_EUROPE_EN: Record<string, PostContent> = {
  'acheter-voiture-france-livraison-europe': {
    title: 'Buying a car in France with delivery anywhere in Europe',
    description:
      'Belgium, Germany, Spain, Italy, the Netherlands: steps, documents supplied, transport and registration when buying a car from a French dealer.',
    blocks: [
      {
        type: 'p',
        text: 'The European market is open: a private buyer or a business based in Belgium, Germany, Spain, Italy or the Netherlands can buy a car from a French dealer and register it at home. The process is well established, as long as you know which documents to ask for and how the car will travel. Here is how it typically works.',
      },
      { type: 'h2', id: 'etapes', text: 'The steps of a remote purchase' },
      {
        type: 'steps',
        items: [
          '**Selection and checks**: detailed photos, service history, HistoVec report and, if needed, a video call or a third-party inspection.',
          '**Offer and order form**: price, VAT status of the car (margin scheme or VAT-qualifying), delivery options and lead times.',
          '**Payment** by bank transfer to the company’s account, in whose name the invoice is issued.',
          '**Paperwork**: invoice, French registration certificate, certificate of conformity, and the sale declared in the French vehicle registration system.',
          '**Transport** by truck, or collection in person with temporary plates.',
          '**Registration** in your country, following the local procedure.',
        ],
      },
      { type: 'h2', id: 'documents', text: 'Documents supplied by the seller' },
      {
        type: 'list',
        items: [
          'The **invoice** in your name (or your company’s), showing the vehicle identification number (VIN), mileage and the VAT scheme applied.',
          'The **French registration certificate** (carte grise), crossed out and signed, together with the **certificate of sale** (certificat de cession).',
          'The **European certificate of conformity (COC)**, which confirms the car complies with EU type approval. It makes registration in another member state much easier; if it is missing, it can usually be ordered from the manufacturer, sometimes for a fee.',
          'Where available: service book, invoices, roadworthiness test report and spare key.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'For a business buyer, the invoice can be issued without VAT if the car is VAT-qualifying and your EU VAT number is valid. See our guide on [VAT when buying a car in Europe](/blog/tva-voiture-occasion-achat-europe).',
      },
      { type: 'h2', id: 'transport', text: 'Transport options' },
      {
        type: 'p',
        text: 'The simplest solution is **delivery by car transporter**: the car travels insured, adds no mileage, and you receive it at the agreed address. The cost depends on distance, vehicle size and the lead time you need; it is quoted before you order.',
      },
      {
        type: 'p',
        text: 'You can also **collect the car and drive it home**. You will then need plates and insurance valid for the journey: transit or export plates issued by your country, or a French temporary registration depending on your situation. Our guide to [WW, transit and export plates](/blog/plaques-ww-transit-export-voiture) explains the options.',
      },
      { type: 'h2', id: 'immatriculation', text: 'Registration in your country' },
      {
        type: 'p',
        text: 'Each country has its own procedure: roadworthiness or identification inspection, a registration tax (sometimes high, as in the Netherlands or, depending on the region, Belgium), and tax paperwork for VAT. Amounts and lead times change regularly, so check with your local authorities or a professional in your country before buying, to know the real cost once the car is registered.',
      },
      {
        type: 'p',
        text: 'We sell to private and business customers in France and across Europe, with delivery on request. Vehicles we sell in Europe come with a **3-month warranty**, which you can extend if you wish. Browse our [vehicle stock](/voitures) or [contact us](/contact) for a quote delivered to your country.',
      },
    ],
  },

  'tva-voiture-occasion-achat-europe': {
    title: 'VAT when buying a used car in Europe: margin scheme, VAT-free, new vehicles',
    description:
      'Margin scheme, VAT-qualifying cars, exempt intra-EU supplies, the 6-month / 6,000 km rule: understanding VAT when buying a car in another EU country.',
    blocks: [
      {
        type: 'p',
        text: 'When you buy a car in another European Union country, VAT accounts for a large part of the final price. It all depends on three things: the car’s VAT status, whether the buyer is a private individual or a business, and the car’s age or mileage. Here are the general principles, which come from the EU VAT Directive.',
      },
      { type: 'h2', id: 'marge', text: 'The margin scheme' },
      {
        type: 'p',
        text: 'Most used cars bought from private individuals are resold under the **margin scheme** (in France, the second-hand goods scheme of article 297 A of the French tax code). The dealer only pays VAT on its margin, and the invoice shows **no VAT**: it carries a statement such as “Special scheme – second-hand goods”.',
      },
      {
        type: 'list',
        items: [
          'VAT on the margin is due **in France**, whatever the buyer’s country.',
          'The buyer, even a business, **cannot reclaim** this VAT.',
          'No additional VAT is due in the destination country on the purchase (local registration taxes still apply).',
        ],
      },
      { type: 'h2', id: 'tva-recuperable', text: 'VAT-qualifying cars: private and business buyers' },
      {
        type: 'p',
        text: 'Some cars were bought by the dealer with deductible VAT: ex-fleet, ex-rental or dealer cars. They are resold with VAT charged on the full price. For a **private buyer** based in another EU country, French VAT then applies normally (unless the car counts as “new”, see below).',
      },
      {
        type: 'p',
        text: 'If the buyer is a VAT-registered business in another member state, the sale of a VAT-qualifying car can be **exempt in France**: it is an intra-community supply. The buyer then accounts for VAT in its own country (reverse charge) and deducts it according to its rights.',
      },
      {
        type: 'steps',
        items: [
          'The buyer provides its **EU VAT number**, which the seller checks in the European **VIES** database.',
          'The invoice is issued without VAT, stating the exemption and both parties’ VAT numbers.',
          'The seller keeps **proof of transport** to the other member state (consignment note, proof of receipt…).',
        ],
      },
      { type: 'h2', id: 'neuf', text: 'The “new means of transport” rule' },
      {
        type: 'p',
        text: 'For EU VAT purposes, a car counts as **new** if it was first put into service **no more than 6 months** ago or has covered **no more than 6,000 km**. In that case, VAT is due **in the destination country**, even if the buyer is a private individual: the sale is invoiced without VAT in France and the buyer pays their own country’s VAT, usually at registration.',
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'These are general principles: how they apply (supporting documents, deadlines, forms) varies from country to country and may change. Before a major purchase, check your situation with your country’s tax authority or your accountant.',
      },
      {
        type: 'p',
        text: 'We state the VAT scheme of each car before you order and issue a compliant invoice, for private and business buyers alike, in France and across Europe. Browse our [stock](/voitures) or [contact us](/contact) with your VAT number for a tailored offer.',
      },
    ],
  },

  'importer-voiture-europe-en-france-quitus-fiscal': {
    title: 'Importing a car from another EU country into France: quitus fiscal, COC, registration',
    description:
      'Quitus fiscal, certificate of conformity, ANTS application and taxes: the steps to register in France a car bought in another European country.',
    blocks: [
      {
        type: 'p',
        text: 'Buying a car in Germany, Belgium or Spain can look attractive. But before driving in France on French plates, there are several administrative steps to complete. Here they are, and why buying from a French dealer who has already handled them makes things much simpler.',
      },
      { type: 'h2', id: 'quitus', text: 'Step 1: the quitus fiscal' },
      {
        type: 'p',
        text: 'The **quitus fiscal** (tax certificate) proves that the car’s VAT position has been settled. It is required to register in France a car bought in another member state. It is issued by the relevant tax office, and in most cases the application can now be made online.',
      },
      {
        type: 'list',
        items: [
          'Usual documents: invoice or bill of sale, foreign registration certificate, ID and proof of address.',
          'For a used car (over 6 months old **and** over 6,000 km), the quitus is in principle issued without any VAT payment in France.',
          'For a car that is “new” for VAT purposes (6 months or less, or 6,000 km or less), French VAT must be paid to obtain the quitus.',
        ],
      },
      { type: 'h2', id: 'coc', text: 'Step 2: proof of conformity' },
      {
        type: 'p',
        text: 'The **European certificate of conformity (COC)** proves that the car matches a type approved in the EU. If it did not come with the car, it can be requested from the manufacturer or its French representative, often for a fee. Failing that, an identification certificate or an individual approval from the DREAL (regional authority) may be needed, which significantly extends lead times.',
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'If the car is more than 4 years old, a recent roadworthiness test is generally required. A test carried out in another EU country may be accepted under certain conditions: check the current rules on the ANTS website.',
      },
      { type: 'h2', id: 'ants', text: 'Step 3: the registration application' },
      {
        type: 'steps',
        items: [
          'Apply on the **ANTS** website (vehicle bought abroad section) or through an approved professional.',
          'Attach the quitus fiscal, COC, foreign registration certificate, invoice, roadworthiness test if applicable and proof of insurance.',
          'Pay the taxes: the regional tax and, depending on the car, the **CO₂ malus** and **weight malus**, which can apply to a first registration in France, reduced according to the car’s age. The scales change every year with the Finance Act: estimate the cost before buying, as it can wipe out the price gap with a car already registered in France.',
          'If needed, drive with a **WW temporary certificate** while waiting for the final registration certificate.',
        ],
      },
      { type: 'h2', id: 'simplicite', text: 'Why buy from a French dealer' },
      {
        type: 'list',
        items: [
          'A car already **registered in France**: no quitus fiscal and no import file to put together.',
          'The final cost is known from the start, with no unexpected malus or conformity fees.',
          'An identifiable seller in France, should you have questions after the sale.',
        ],
      },
      {
        type: 'p',
        text: 'We sell cars in France and deliver them across Europe. Browse our [stock](/voitures) or [contact us](/contact): for each car, we tell you which documents are supplied and the registration costs to expect.',
      },
    ],
  },

  'plaques-ww-transit-export-voiture': {
    title: 'WW, transit and export plates: driving a car that is not yet registered',
    description:
      'WW, W garage, TT, foreign transit or export plates: which temporary registrations to use when delivering a car in Europe or exporting it.',
    blocks: [
      {
        type: 'p',
        text: 'Between buying a car and registering it for good, there is often a journey to make: driving home after buying abroad, reaching a port of departure, delivering to a customer in another country. Without valid plates and insurance, you cannot drive legally. Several temporary solutions exist, each with its own use.',
      },
      { type: 'h2', id: 'france', text: 'French temporary registrations' },
      {
        type: 'list',
        items: [
          '**WW (temporary certificate)**: for a vehicle imported into France awaiting its final registration. It allows the car to be driven while the application is processed, for a limited period (in the order of a few months, according to the current rules on the ANTS website).',
          '**W garage**: reserved for motor trade professionals, for test drives, transfers and vehicle presentations. It does not replace a registration for the customer.',
          '**TT (temporary transit)**: intended in particular for people not domiciled in France who buy a vehicle and take it out of France. Its validity is limited in time.',
        ],
      },
      { type: 'h2', id: 'etranger', text: 'Transit and export plates from other countries' },
      {
        type: 'p',
        text: 'Many European countries issue their own temporary plates, valid from a few days to a few months: short-term or export plates in Germany, transit plates in Belgium, export plates in other member states. A foreign buyer usually obtains them in their own country before coming to collect the car, together with matching insurance.',
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Conditions, validity and recognition abroad vary by country and change regularly. Check with your country’s authorities before setting off, and make sure the insurance covers every country you will drive through.',
      },
      { type: 'h2', id: 'assurance', text: 'Insurance: don’t overlook it' },
      {
        type: 'p',
        text: 'A temporary plate without insurance is useless. The policy must cover the specific vehicle (VIN), the duration of the journey and every country crossed. Some insurers offer dedicated short-term policies; others refuse foreign plates. Keep the insurance certificate, the invoice and the registration certificate (or certificate of sale) in the car throughout the journey.',
      },
      { type: 'h2', id: 'quand', text: 'When do you need them?' },
      {
        type: 'steps',
        items: [
          '**Delivery in Europe by truck**: no temporary plates needed, the car is not driven.',
          '**Collection by a European buyer**: transit or export plates from their country, or a French temporary registration depending on their situation.',
          '**Export outside the EU** (Algeria, Tunisia, Morocco): the car is usually taken to the port by truck; if it is driven, it needs valid registration and insurance, in addition to the export documents (EX-A).',
          '**Import into France**: a WW temporary certificate while waiting for the final registration certificate.',
        ],
      },
      {
        type: 'p',
        text: 'For imports into France, see also our guide on the [quitus fiscal and registration](/blog/importer-voiture-europe-en-france-quitus-fiscal).',
      },
      {
        type: 'p',
        text: 'We sell and deliver our cars in France and across Europe, and prepare export documents for North Africa. Choose a car from our [stock](/voitures) or [contact us](/contact) to arrange transport.',
      },
    ],
  },

  'vendre-sa-voiture-a-un-professionnel-reprise': {
    title: 'Selling your car to a dealer: valuation, documents and transfer',
    description:
      'Valuation, paperwork, certificate of sale, ANTS declaration and secure payment: how to sell your car to a dealer in France the right way.',
    blocks: [
      {
        type: 'p',
        text: 'Selling your car to a dealer, as a trade-in or an outright sale, saves you the ads, the viewings and the risks of a private sale. The price is often a little lower, but the transaction is quick and well regulated. Here is how the valuation works, which documents to prepare and how to secure the sale.',
      },
      { type: 'h2', id: 'estimation', text: 'How a dealer values your car' },
      {
        type: 'list',
        items: [
          '**Market value**: prices of comparable cars (age, mileage, trim, options) and how quickly they sell.',
          '**Actual condition**: bodywork, interior, tyres, brakes, warning lights, test drive.',
          '**History**: service book, invoices, number of owners, reported claims.',
          '**Reconditioning costs** and the margin needed to resell, warranty included.',
        ],
      },
      {
        type: 'p',
        text: 'A complete file (service invoices, spare key, stamped service book) reassures the buyer and weighs on the offer. Compare several offers, but on equivalent condition and terms. A clean car with its original accessories (charging cables, mats, parcel shelf) also makes a better impression, even though the offer will rest mainly on mechanical condition and history.',
      },
      { type: 'h2', id: 'documents', text: 'Documents to prepare' },
      {
        type: 'list',
        items: [
          'The **registration certificate** (carte grise) in your name, crossed out with the words “Vendu le …” (sold on, with date and time) and signed.',
          'The **certificate of sale** (form cerfa no. 15776), filled in in duplicate and signed by both parties.',
          'The **certificate of administrative status** (non-gage, confirming no lien or objection), less than 15 days old, downloadable free of charge from the French Interior Ministry’s website.',
          'Your ID and, for a trade-in, the order form for the car you are buying.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'A roadworthiness test less than 6 months old, mandatory when selling a car over 4 years old to a private buyer, is in principle not required when the buyer is a motor trade professional. The dealer will nonetheless factor the car’s condition into its offer.',
      },
      { type: 'h2', id: 'declaration', text: 'Declaring the sale' },
      {
        type: 'steps',
        items: [
          'The seller declares the sale on the **ANTS** website within **15 days** of the sale.',
          'They receive a **transfer code** to pass on to the buyer, plus an acknowledgement to keep.',
          'An approved dealer can also record the sale directly in the registration system: ask for the proof.',
          'This declaration releases you from liability (fines, offences) for anything that happens after the date and time of sale. Then remember to cancel your insurance.',
        ],
      },
      { type: 'h2', id: 'paiement', text: 'Securing payment' },
      {
        type: 'list',
        items: [
          'Prefer a **bank transfer**: only hand over the keys and registration certificate once the funds are in your account.',
          'For a **banker’s draft**, check it directly with the issuing bank, using contact details you found yourself.',
          'Cash payments to a business are strictly capped by law: avoid them.',
          'Check the dealer’s identity (name, SIREN number, address) before signing.',
        ],
      },
      {
        type: 'p',
        text: 'Changing cars? Browse our [stock](/voitures), sold and delivered in France and across Europe, or [contact us](/contact) to talk about your current car.',
      },
    ],
  },

  'marche-voiture-occasion-premium-europe-2026': {
    title: 'Europe’s used premium car market in 2026: where recent cars come from',
    description:
      'Lease returns, demo cars, fleets, remarketing auctions: how recent premium cars move around Europe and what professional buyers check.',
    blocks: [
      {
        type: 'p',
        text: 'A two- or three-year-old BMW, Mercedes, Audi or Porsche doesn’t end up at a dealer by chance. Recent premium cars follow well-defined channels across Europe. Understanding them helps you know what you are buying and ask the right questions.',
      },
      { type: 'h2', id: 'origines', text: 'Where recent premium cars come from' },
      {
        type: 'list',
        items: [
          '**Lease returns**: a large share of new premium cars is financed through long-term leasing or lease-purchase. At the end of the contract, often after 2 to 4 years, the car goes back to the lessor or finance company, which resells it.',
          '**Demonstrators and management cars**: used for a few months by dealerships or manufacturers, with low mileage.',
          '**Company fleets and rental companies**: company cars and short-term rental cars, replaced on regular cycles.',
          '**Trade-ins** from private buyers purchasing a new car.',
        ],
      },
      { type: 'h2', id: 'remarketing', text: 'The role of remarketing auctions' },
      {
        type: 'p',
        text: 'Leasing companies, rental firms and manufacturers’ captive finance arms sell a large part of their vehicles to professionals, through online auction platforms or trade-only sales. Buyers find batches of recent cars with a condition report, but have to move quickly and know the prices in each market.',
      },
      { type: 'h2', id: 'france-allemagne', text: 'Why France and Germany matter' },
      {
        type: 'p',
        text: 'Germany is Europe’s largest car market and home to several major premium brands; company cars are very common there, feeding a steady flow of recent vehicles. France also has a highly developed long-term leasing market. Both countries are therefore major sources of used premium cars, which then travel across Europe and beyond.',
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Prices, volumes and trends (electrification, residual values) change quickly: be wary of figures presented as definitive and always compare several recent sources.',
      },
      { type: 'h2', id: 'verifications', text: 'What professional buyers check' },
      {
        type: 'steps',
        items: [
          '**History**: servicing by the brand network or a specialist, consistent mileage, number of owners.',
          '**Condition report**: damage, repairs, paintwork, tyres and brakes.',
          '**Origin and paperwork**: registration certificate, COC, no lien, theft record or objection.',
          '**VAT status**: margin scheme or VAT-qualifying, crucial for cross-border sales (see our [VAT guide](/blog/tva-voiture-occasion-achat-europe)).',
          '**Manufacturer recalls** and any remaining warranty.',
          '**Transport and registration costs** in the country of resale.',
        ],
      },
      {
        type: 'p',
        text: 'A recent car from these channels can be an excellent buy, provided its history is documented and its paperwork in order. Always ask about the car’s origin, history and VAT status before committing.',
      },
      {
        type: 'p',
        text: 'We select recent and premium cars and sell them in France and across Europe, with delivery. Discover our [stock](/voitures) or [contact us](/contact) for a personalised search.',
      },
    ],
  },
};
