import type { PostContent } from './types';

/** English translations — guides on buying a used car in France from a professional. */
export const POSTS_FRANCE_EN: Record<string, PostContent> = {
  'acheter-voiture-occasion-professionnel-garanties': {
    title: 'Buying a used car from a professional dealer: your guarantees',
    description:
      'Legal guarantee of conformity, hidden defects, commercial warranty, invoice, right of withdrawal: what changes when you buy a used car from a dealer.',
    blocks: [
      {
        type: 'p',
        text: 'When comparing a private seller with a professional, the advertised price is only part of the picture. Buying a used car from a professional seller gives you protections provided by law that a private sale does not offer, or only partly. Here they are, along with their limits.',
      },
      { type: 'h2', id: 'garantie-conformite', text: 'The legal guarantee of conformity' },
      {
        type: 'p',
        text: 'Set out in the French Consumer Code (articles L217-3 et seq.), it applies when a professional sells goods to a consumer, including a used vehicle. The seller is liable for lack of conformity existing at delivery and appearing within **two years**. Since the reform that came into force in 2022, for second-hand goods, a defect appearing within the **first 12 months** is presumed to have existed at delivery: you do not have to prove it predates the sale. After that, the burden of proof is in principle on you.',
      },
      {
        type: 'list',
        items: [
          'You can ask for the vehicle to be **repaired** or **replaced**.',
          'If neither is possible or successful, you can obtain a **price reduction** or, if the defect is serious enough, **cancellation of the sale**.',
          'The guarantee does not cover normal wear and tear or defects you were aware of at the time of purchase.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'The detailed rules (time limits, presumption, exclusions) may change. At the time of writing, the “Garantie légale de conformité” page on service-public.fr remains the reference to check.',
      },
      { type: 'h2', id: 'vices-caches', text: 'The guarantee against hidden defects' },
      {
        type: 'p',
        text: 'Based on the French Civil Code (articles 1641 et seq.), the guarantee against hidden defects (“vices cachés”) applies to every sale, including between private individuals. The defect must be hidden, predate the sale and make the vehicle unfit for use or greatly reduce its use. Action must be brought within two years of discovering the defect. In practice, the burden of proof is heavier than for the guarantee of conformity, often requiring an expert assessment.',
      },
      { type: 'h2', id: 'garantie-commerciale', text: 'The commercial warranty, an optional extra' },
      {
        type: 'p',
        text: 'The professional may also offer a commercial warranty (sometimes called a “mechanical warranty”), free or paid. It never replaces the legal guarantees. Read the contract: duration, parts covered, caps, excess, and servicing conditions to comply with. At SKH Global Motors, vehicles we sell in Europe come with a **3-month warranty**, extendable on request, on top of the legal guarantees.',
      },
      { type: 'h2', id: 'facture-retractation', text: 'Invoice and right of withdrawal' },
      {
        type: 'list',
        items: [
          '**Invoice**: the professional gives you a detailed invoice (vehicle, VIN, mileage, price, guarantees). Keep it: it serves as evidence in a dispute and when you resell.',
          '**Purchase at a dealership or branch**: there is no legal 14-day right of withdrawal. Once the order form is signed, the sale is in principle final, unless a clause says otherwise.',
          '**Distance sale** (ordered online, by phone or by email without visiting in person): the consumer in principle has **14 days** to withdraw, starting from receipt of the vehicle.',
          '**Buying on credit**: the credit agreement has its own withdrawal period (see our guide on [financing a used car](/blog/financer-voiture-occasion-credit-loa)).',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'These protections are for consumers. If you buy for your company, other rules apply, in particular regarding the guarantee of conformity and withdrawal.',
      },
      { type: 'h2', id: 'chez-nous', text: 'At SKH Global Motors' },
      {
        type: 'p',
        text: 'We sell to private and business customers, with an invoice and documents handed over on delivery. Browse our [vehicle stock](/voitures) or [contact us](/contact): we sell and deliver in France and across Europe.',
      },
    ],
  },

  'documents-achat-voiture-occasion-france': {
    title: 'The documents to get when you buy a used car in France',
    description:
      'Crossed-out registration, certificate of sale, roadworthiness test, non-pledge certificate, service book, ANTS registration: the full checklist.',
    blocks: [
      {
        type: 'p',
        text: 'A well-documented used car resells better and registers without difficulty. Before signing, make sure the seller can hand over the following documents. With a professional, most of them are prepared in advance.',
      },
      { type: 'h2', id: 'carte-grise', text: 'The registration certificate (carte grise)' },
      {
        type: 'p',
        text: 'The seller crosses out the registration certificate, writes “Vendu le … à …” (sold on … at …) with the date and time of sale, and signs it. Check that the VIN matches the one stamped on the vehicle and that the holder’s name matches the seller (or the selling company). If the seller is a motor trade professional, the registration may be in its name or in the previous owner’s, depending on how the vehicle entered stock.',
      },
      { type: 'h2', id: 'liste', text: 'The document checklist' },
      {
        type: 'list',
        items: [
          '**Certificate of sale** (“certificat de cession”, cerfa form no. 15776), completed and signed by seller and buyer, in two copies. The seller then declares the sale on the ANTS website and gives you a transfer code (“code de cession”).',
          '**Roadworthiness test report** (“contrôle technique”) less than 6 months old (or less than 2 months in case of a re-test) for a vehicle over 4 years old. At the time of writing, this is required to register the vehicle in your name.',
          '**Certificate of administrative status** (“certificat de situation administrative”, known as “non-gage”) less than 15 days old: it shows whether the vehicle is subject to a pledge or an objection preventing transfer of ownership.',
          '**Service book and invoices**: not legally required, but essential to judge the vehicle’s history.',
          '**Purchase invoice** if the seller is a professional, stating the applicable guarantees.',
          'Spare keys, the owner’s manual and, for an electric vehicle, the supplied charging cables.',
        ],
      },
      { type: 'h2', id: 'immatriculation', text: 'Registering the vehicle in your name' },
      {
        type: 'steps',
        items: [
          'Collect the transfer code and the documents above at the time of sale.',
          'Apply for the registration certificate on the ANTS website (immatriculation.ants.gouv.fr) or through an authorised professional, **within one month** of purchase.',
          'Pay the regional tax, which varies by region and fiscal horsepower.',
          'Print the provisional certificate (CPI) so you can drive while waiting for the new registration document, sent by post.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Procedures and fees change: check the current process on service-public.fr or ants.gouv.fr. Many authorised professionals can handle the registration for you.',
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Be wary of a seller who cannot provide the non-pledge certificate or whose identity does not match the registration certificate. See also our guide to [checking a vehicle’s history](/blog/verifier-historique-voiture-kilometrage-histovec).',
      },
      { type: 'h2', id: 'chez-nous', text: 'A complete file on delivery' },
      {
        type: 'p',
        text: 'For every vehicle in our [stock](/voitures), we prepare the sale documents and tell you what will be handed over on delivery. Any questions? [Contact us](/contact): we sell and deliver in France and across Europe.',
      },
    ],
  },

  'verifier-historique-voiture-kilometrage-histovec': {
    title: 'Checking a used car’s history and mileage',
    description:
      'HistoVec, roadworthiness test reports, service invoices, signs of a tampered odometer: how to check a used car’s past before you buy.',
    blocks: [
      {
        type: 'p',
        text: 'Mileage and service history weigh heavily on the price of a used car. They are also the target of the most common fraud: odometer tampering. Fortunately, several sources let you cross-check the information before buying.',
      },
      { type: 'h2', id: 'histovec', text: 'HistoVec, the free official report' },
      {
        type: 'p',
        text: 'HistoVec is a free service from the French Ministry of the Interior. The registration holder generates a report and shares it with the buyer (link or code). At the time of writing, the report shows in particular:',
      },
      {
        type: 'list',
        items: [
          'the vehicle’s specifications and date of first registration;',
          'the number of holders and changes of ownership;',
          'the administrative status: pledge, objection, reported theft;',
          'accidents that led to a damaged-vehicle procedure;',
          'the history of roadworthiness tests, with recorded mileage where available.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'A serious seller has no reason to refuse to share the HistoVec report. A refusal should put you on alert.',
      },
      { type: 'h2', id: 'controle-technique', text: 'Reading roadworthiness test reports' },
      {
        type: 'p',
        text: 'Each “contrôle technique” report records the mileage and any defects found. Compare them from one test to the next: mileage should always increase, consistently with use. Recurring minor defects (brakes, tyres, lights) also say a lot about how carefully the car was maintained.',
      },
      { type: 'h2', id: 'entretien', text: 'Cross-checking with the service history' },
      {
        type: 'p',
        text: 'The service book, paper or digital, and garage invoices also carry a mileage and a date. On many recent models, the brand’s network can look up the recorded service history. Check that major milestones (timing belt, oil changes, brakes) were respected.',
      },
      { type: 'h2', id: 'signes-fraude', text: 'Signs of a tampered odometer' },
      {
        type: 'steps',
        items: [
          'Compare the displayed mileage with the readings from roadworthiness tests and invoices: a figure lower than an earlier reading is a red flag.',
          'Look at wear on the steering wheel, gear knob, pedals and driver’s seat: it should be consistent with the stated mileage.',
          'Be wary of invoices or service books that are incomplete precisely for the recent period.',
          'Ask a workshop to read the control units: some modules store a mileage separate from the dashboard figure.',
          'Compare mileage with age: a very low or very high figure relative to typical use deserves an explanation.',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Tampering with an odometer is an offence. If you discover fraud after the purchase, keep all the evidence and contact a legal professional or a consumer association.',
      },
      { type: 'h2', id: 'chez-nous', text: 'Vehicles with a verifiable history' },
      {
        type: 'p',
        text: 'For vehicles in our [stock](/voitures), ask us for the available history and service documents before you decide. You can also read our guide to [the documents to get](/blog/documents-achat-voiture-occasion-france). We sell and deliver in France and across Europe: [contact us](/contact).',
      },
    ],
  },

  'voiture-occasion-ex-leasing-lld-loa': {
    title: 'Ex-lease used cars (LLD and LOA): a good deal?',
    description:
      'End of long-term rental and lease-purchase contracts: why these recent, well-followed vehicles feed the used car market, and what to check.',
    blocks: [
      {
        type: 'p',
        text: 'A large share of recent cars in France are not bought but leased, through long-term rental (“location longue durée”, LLD) or lease with purchase option (“location avec option d’achat”, LOA). At the end of the contract, many of these vehicles are returned and come back onto the used market. For buyers, this is an attractive source of recent cars, provided you know what to check.',
      },
      { type: 'h2', id: 'origine', text: 'Where do these vehicles come from?' },
      {
        type: 'p',
        text: 'At the end of an LLD, the vehicle returns to the company that owns it: a leasing company, a manufacturer-linked finance company (a “captive”) or a financial institution. With an LOA, the customer can exercise the purchase option or return the vehicle. Returned cars are then resold, often to professionals, through auctions, trade-only platforms or direct sales.',
      },
      { type: 'h2', id: 'avantages', text: 'Why these cars are worth a look' },
      {
        type: 'list',
        items: [
          '**Recent vehicles**: contracts often last between 2 and 5 years.',
          '**Servicing generally followed**: many contracts include or require servicing according to the manufacturer’s schedule, which leaves a record.',
          '**A documented history**: one main user and a condition report drawn up on return.',
          '**Recent equipment**: driver assistance, connectivity, hybrid or electric powertrains.',
        ],
      },
      { type: 'h2', id: 'points-attention', text: 'What to check' },
      {
        type: 'list',
        items: [
          '**Mileage**: company fleet vehicles may have covered a lot of ground; others very little. Compare with age and use.',
          '**Wear and minor damage**: scratches, scuffed rims, seats. They are usually listed in the return report but not always repaired before resale.',
          '**The return or inspection report**: ask whether it is available. It describes the vehicle’s condition when it was returned.',
          '**Service history**: check invoices or the digital service record, and that manufacturer recalls have been carried out.',
          '**The registration certificate**: the first holder is often a leasing or finance company. That is not a problem, but the history should be consistent.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'The HistoVec report is still useful for an ex-lease car: it shows successive holders, administrative status and any roadworthiness tests. See our guide to [checking the history](/blog/verifier-historique-voiture-kilometrage-histovec).',
      },
      { type: 'h2', id: 'professionnel', text: 'The dealer’s role' },
      {
        type: 'p',
        text: 'Access to these vehicles mostly goes through trade-only channels. The dealer selects vehicles, reviews the condition reports, prepares the car and resells it with the legal guarantees owed by a professional seller (see [your guarantees](/blog/acheter-voiture-occasion-professionnel-garanties)).',
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'An ex-lease car is not automatically in perfect condition: each vehicle must be examined individually. Always ask for the available documents before buying.',
      },
      { type: 'h2', id: 'chez-nous', text: 'Finding a recent vehicle' },
      {
        type: 'p',
        text: 'Browse our [vehicle stock](/voitures) and ask us about the origin and history of the one you are interested in. We sell and deliver in France and across Europe: [contact us](/contact).',
      },
    ],
  },

  'financer-voiture-occasion-credit-loa': {
    title: 'Financing a used car: linked credit, personal loan or LOA',
    description:
      'Linked credit, personal loan, lease-purchase on a used car: how they work, APR, insurance and the 14-day withdrawal period, to choose well.',
    blocks: [
      {
        type: 'p',
        text: 'Paying cash is not the only way to buy a used car. Several financing solutions exist, with different protections for the buyer. Here is how to compare them.',
      },
      { type: 'h2', id: 'credit-affecte', text: 'Linked credit (crédit affecté, or car loan)' },
      {
        type: 'p',
        text: 'A linked credit finances a specific purchase named in the contract. The sale and the credit are tied together: if the credit is refused, the sale is cancelled; if you exercise your right of withdrawal from the credit, the sale is in principle cancelled too. It is the most protective option for a consumer.',
      },
      { type: 'h2', id: 'pret-personnel', text: 'The personal loan' },
      {
        type: 'p',
        text: 'A personal loan (“prêt personnel”) is not tied to a purchase: you use the funds freely. It can be more flexible (you negotiate like a cash buyer), but if a problem arises with the sale, the loan keeps running.',
      },
      { type: 'h2', id: 'loa', text: 'LOA on a used vehicle' },
      {
        type: 'p',
        text: 'Lease with purchase option (“location avec option d’achat”, LOA) also exists for used cars. You may pay a larger first instalment, then monthly rentals; at the end, you can buy the vehicle by exercising the option or return it. Check the annual mileage allowance, the cost of extra kilometres, reconditioning charges on return and the total cost if you exercise the option.',
      },
      { type: 'h2', id: 'comparer', text: 'How to compare offers' },
      {
        type: 'list',
        items: [
          '**The APR** (“TAEG”, annual percentage rate of charge): it includes interest and mandatory fees. It is the figure to compare between two offers.',
          '**The total cost of credit**: what you will pay on top of the vehicle price.',
          '**Borrower insurance**: often offered, sometimes required by the lender; its cost must be shown separately (TAEA). You can in principle choose another insurer offering equivalent cover.',
          '**The term**: a longer term lowers monthly payments but increases the total cost.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'For consumer credit, including LOA, the borrower in principle has a **14-day** withdrawal period from signing the offer. Check the current rules on service-public.fr.',
      },
      {
        type: 'steps',
        items: [
          'Set your total budget and an affordable monthly payment.',
          'Request several offers and compare the APR and total cost.',
          'Read the pre-contractual information sheet and the insurance terms.',
          'Sign the offer only once the vehicle is chosen and the documents checked.',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Credit is a commitment and must be repaid. Check that you can afford the repayments before committing.',
      },
      { type: 'h2', id: 'chez-nous', text: 'Your project with us' },
      {
        type: 'p',
        text: 'Would you like to finance a vehicle from our [stock](/voitures)? Ask us about the solutions available: we can help you put your file together. We sell and deliver in France and across Europe: [contact us](/contact).',
      },
    ],
  },

  'essence-hybride-electrique-quelle-occasion-choisir': {
    title: 'Petrol, hybrid or electric: which used car to choose?',
    description:
      'Usage, charging, Crit’Air sticker, battery health (SoH), plug-in hybrid: the right criteria for choosing the powertrain of a recent used car.',
    blocks: [
      {
        type: 'p',
        text: 'On the recent used car market, the choice has widened: petrol, full hybrid, plug-in hybrid, fully electric, and diesel too. No powertrain is best in absolute terms; it all depends on how you drive and where you can charge.',
      },
      { type: 'h2', id: 'usage', text: 'Start from your usage' },
      {
        type: 'list',
        items: [
          '**Petrol**: versatile, often a lower purchase price, simple maintenance. Suited to low and medium annual mileage.',
          '**Hybrid (non plug-in)**: worthwhile in town and suburban driving, where it cuts consumption. No charging needed.',
          '**Plug-in hybrid**: makes sense if you can charge often and your daily trips fit within the electric range. Without regular charging, it uses more fuel than a conventional hybrid.',
          '**Electric**: generally low running costs if you charge at home or at work. Check real-world range on your long trips and access to fast chargers.',
          '**Diesel**: still suited to high-mileage road drivers, but more exposed to traffic restrictions.',
        ],
      },
      { type: 'h2', id: 'crit-air', text: 'Crit’Air sticker and traffic restrictions' },
      {
        type: 'p',
        text: 'The Crit’Air sticker classifies vehicles by their pollutant emissions. At the time of writing, electric cars get the green sticker (Crit’Air 0); recent petrol cars (Euro 5 and 6 standards) and most petrol hybrids, plug-in or not, get Crit’Air 1; recent diesels get Crit’Air 2. The exact rating follows from the Euro standard and the date of first registration shown on the registration certificate.',
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'The framework for low-emission zones (“zones à faibles émissions”, ZFE) is subject to debate and change, and rules vary from one city to another. Check the restrictions that apply where you drive before choosing.',
      },
      { type: 'h2', id: 'batterie', text: 'Electric: battery health' },
      {
        type: 'p',
        text: 'On a used electric car, the battery is the most expensive component. Ask for a **battery health certificate** (SoH, “State of Health”), produced with a diagnostic tool: it expresses the remaining capacity as a percentage of the original capacity. Also check the manufacturer’s battery warranty, often expressed in years and kilometres with a minimum capacity threshold, and whether it transfers to the new owner.',
      },
      {
        type: 'steps',
        items: [
          'Ask for the SoH certificate and its date.',
          'Check the remaining battery warranty (duration, mileage, threshold).',
          'Check the supplied cables and the accepted charging power (AC and DC).',
          'Take a test drive that includes, if possible, a charging session.',
        ],
      },
      { type: 'h2', id: 'hybride-rechargeable', text: 'Plug-in hybrid: two systems to watch' },
      {
        type: 'p',
        text: 'A plug-in hybrid combines a combustion engine and a battery. Check the engine’s servicing as you would for a petrol car, and the battery’s condition as you would for an electric one. Charging history, when available, shows how the vehicle was used.',
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Whatever the powertrain, check the history and documents: see our guides on [the vehicle’s history](/blog/verifier-historique-voiture-kilometrage-histovec) and [purchase documents](/blog/documents-achat-voiture-occasion-france).',
      },
      { type: 'h2', id: 'chez-nous', text: 'Finding the right powertrain' },
      {
        type: 'p',
        text: 'Filter our [vehicle stock](/voitures) by fuel type, or describe how you drive through the [contact form](/contact): we will point you to suitable models. We sell and deliver in France and across Europe.',
      },
    ],
  },
};
