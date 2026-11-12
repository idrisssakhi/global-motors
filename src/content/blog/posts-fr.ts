import type { PostContent } from './types';

/** French originals — the reference text for every translation. */
export const POSTS_FR: Record<string, PostContent> = {
  'importer-voiture-algerie-2026': {
    title: 'Importer une voiture en Algérie en 2026 : ce qui change',
    description:
      'Loi de finances 2026 : retour définitif avec CCR pour les véhicules de moins de 5 ans, cylindrée limitée à 1 800 cm³, diesel exclu, nouvelle taxe de 8 000 DA.',
    blocks: [
      {
        type: 'p',
        text: 'La loi de finances 2026 a modifié les règles d’importation des véhicules par les particuliers. La principale nouveauté concerne les Algériens établis à l’étranger qui rentrent définitivement au pays : ils peuvent désormais importer un véhicule d’occasion de moins de 5 ans en franchise de droits, à des conditions strictes. Voici l’essentiel, et ce qui ne change pas.',
      },
      { type: 'h2', id: 'deux-regimes', text: 'Deux régimes à ne pas confondre' },
      {
        type: 'list',
        items: [
          '**Résident en Algérie — véhicule de moins de 3 ans** : le régime en place depuis 2023. Un véhicule tous les 3 ans par personne, essence, hybride ou électrique. Les droits et taxes sont dus, avec un abattement selon la motorisation (voir notre [guide dédié](/blog/importer-voiture-moins-3-ans-algerie)).',
          '**Retour définitif avec certificat de changement de résidence (CCR) — moins de 5 ans** : la nouveauté 2026. Le véhicule entre en franchise de droits et taxes si toutes les conditions sont réunies.',
        ],
      },
      { type: 'h2', id: 'conditions-ccr', text: 'Les conditions du retour définitif (CCR)' },
      {
        type: 'list',
        items: [
          'Être de nationalité algérienne et immatriculé auprès d’un consulat d’Algérie.',
          'Justifier d’au moins **3 ans de résidence ininterrompue** à l’étranger et obtenir le certificat de changement de résidence.',
          'Ne pas avoir déjà bénéficié des avantages liés à un changement de résidence.',
          'Un véhicule **neuf ou de moins de 5 ans** à son entrée sur le territoire douanier.',
          'Motorisation **essence, hybride ou électrique** ; cylindrée **jusqu’à 1 800 cm³** (contre 2 000 cm³ auparavant). Les utilitaires jusqu’à 5,95 t de PTAC sont aussi concernés.',
          'Valeur totale des biens (véhicule et mobilier compris) plafonnée à **10 millions de DA** (8 millions pour les étudiants et stagiaires).',
          'Les véhicules arrivés au port avant le 1er janvier 2026 sont exclus.',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Le diesel est exclu de la franchise. Un véhicule diesel reste importable dans certains cas, mais il supporte la totalité des droits et taxes, ce qui peut dépasser 50 % de sa valeur.',
      },
      { type: 'h2', id: 'frais', text: 'Les frais qui restent à payer' },
      {
        type: 'p',
        text: 'Même exonéré de droits, le retour définitif a un coût : des droits de chancellerie sont réglés au consulat avant le départ, calculés sur la valeur de l’inventaire déclaré (tarif réduit pour les étudiants). En Algérie, une nouvelle taxe de **8 000 DA** s’applique aux véhicules importés soumis au contrôle technique ; elle est payée à la recette des impôts après le dédouanement et avant l’immatriculation.',
      },
      {
        type: 'p',
        text: 'Notre [simulateur de dédouanement](/simulateur-dedouanement) intègre ces deux régimes : choisissez « CCR » pour voir les frais consulaires et vérifier automatiquement l’âge, la cylindrée et le plafond.',
      },
      { type: 'h2', id: 'chez-nous', text: 'Comment nous vous aidons' },
      {
        type: 'p',
        text: 'Chaque véhicule de notre [stock](/voitures) affiche désormais son éligibilité (« < 3 ans », « CCR < 5 ans ») et un prix rendu Algérie estimé. Avant tout achat, un conseiller vérifie votre situation et la conformité du véhicule.',
      },
    ],
  },

  'importer-voiture-moins-3-ans-algerie': {
    title: 'Résident en Algérie : importer un véhicule de moins de 3 ans',
    description:
      'Conditions, calcul des droits et taxes, abattement du décret 23-74 et documents : le guide pour importer une voiture de moins de 3 ans depuis la France.',
    blocks: [
      {
        type: 'p',
        text: 'Depuis 2023, un particulier résidant en Algérie peut importer un véhicule de tourisme d’occasion de moins de 3 ans. C’est la voie la plus utilisée pour acheter une voiture en France. Voici les conditions, la façon dont les droits sont calculés et les documents à réunir.',
      },
      { type: 'h2', id: 'conditions', text: 'Les conditions' },
      {
        type: 'list',
        items: [
          'Être résident en Algérie.',
          'Un seul véhicule importé **tous les 3 ans** par personne.',
          'Un véhicule de **moins de 3 ans** (à compter de la première mise en circulation).',
          'Motorisation **essence, hybride ou électrique** : le diesel n’est pas admis pour les particuliers.',
        ],
      },
      { type: 'h2', id: 'calcul', text: 'Comment sont calculés les droits et taxes' },
      {
        type: 'steps',
        items: [
          '**Valeur en douane** : le prix d’achat (ou une valeur de référence dépréciée selon l’âge, si elle est plus élevée) + le fret + l’assurance, convertis en dinars.',
          '**Droit de douane** selon la motorisation et la cylindrée.',
          '**Contribution de solidarité** (3 %) et **prélèvement PRCT** (2 %) sur la valeur en douane.',
          '**TVA** (19 %) sur la valeur en douane augmentée des droits et contributions.',
          '**Abattement du décret 23-74** sur le total, pour les véhicules d’occasion : 80 % pour l’électrique, 50 % pour l’essence ou l’hybride jusqu’à 1 800 cm³, 20 % au-delà.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Les taux évoluent avec les lois de finances. Notre [simulateur](/simulateur-dedouanement) applique les taux en vigueur à notre connaissance ; seul le calcul des douanes algériennes fait foi.',
      },
      { type: 'h2', id: 'ht', text: 'Acheter hors taxe en France' },
      {
        type: 'p',
        text: 'Pour une exportation hors de l’Union européenne, un véhicule dont la TVA est récupérable peut être facturé hors taxe, sur présentation des justificatifs d’export. L’économie (20 % en France) compense une partie des droits algériens. Dans notre stock, le prix HT est affiché quand il s’applique.',
      },
      { type: 'h2', id: 'documents', text: 'Les documents à réunir' },
      {
        type: 'list',
        items: [
          'La facture d’achat détaillant le prix (HT pour l’export).',
          'Le certificat d’immatriculation, au nom du vendeur ou accompagné d’un certificat de cession.',
          'Le document d’export (EX-A / EX1), établi **avant l’embarquement**.',
          'Un contrôle technique de moins de 3 ans le cas échéant.',
          'En Algérie : dédouanement, contrôle des Mines puis immatriculation.',
        ],
      },
      {
        type: 'p',
        text: 'Vous rentrez définitivement au pays ? Le régime CCR, ouvert aux véhicules de moins de 5 ans depuis 2026, peut être plus avantageux : lisez [ce qui change en 2026](/blog/importer-voiture-algerie-2026).',
      },
    ],
  },

  'ports-alger-oran-restriction-ete': {
    title: 'Ports d’Alger et d’Oran : la restriction estivale sur les véhicules importés',
    description:
      'Chaque été, l’entrée des véhicules neufs ou de moins de 3 ans importés peut être interdite aux ports d’Alger et d’Oran. Comment anticiper votre import.',
    blocks: [
      {
        type: 'p',
        text: 'En 2026, l’entrée des véhicules neufs ou de moins de 3 ans, acquis à l’étranger et destinés à l’importation, a été interdite aux ports d’Alger et d’Oran **du 15 juin au 15 septembre**, d’après les avis relayés par les compagnies maritimes. Le but : désengorger ces ports pendant la saison des traversées des voyageurs.',
      },
      { type: 'h2', id: 'consequences', text: 'Ce que cela change pour votre achat' },
      {
        type: 'list',
        items: [
          'Un véhicule acheté fin mai peut se retrouver bloqué jusqu’à mi-septembre si la traversée est prévue vers Alger ou Oran.',
          'D’autres ports peuvent rester ouverts sur la période : la faisabilité dépend des rotations et doit être vérifiée au moment de réserver.',
          'Les catégories visées diffèrent selon les avis des compagnies : faites confirmer la règle pour votre véhicule précis.',
        ],
      },
      { type: 'h2', id: 'anticiper', text: 'Comment anticiper' },
      {
        type: 'steps',
        items: [
          'Visez une arrivée **avant mi-juin ou après mi-septembre** : comptez en général 2 à 4 semaines entre l’achat et l’arrivée au port.',
          'Si vous achetez au printemps, validez tôt le véhicule et les documents d’export.',
          'Pendant l’été, demandez-nous les ports et dates possibles avant de vous engager.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Cette mesure est annoncée chaque année par les autorités algériennes et peut évoluer. Nous mettons ce guide à jour dès qu’un nouvel avis est publié.',
      },
    ],
  },

  'acheter-voiture-france-export-eviter-arnaques': {
    title: 'Acheter une voiture en France pour l’export : les vérifications indispensables',
    description:
      'Carte grise, certificat de cession, non-gage, historique, document d’export : les contrôles à exiger avant d’acheter un véhicule destiné au Maghreb.',
    blocks: [
      {
        type: 'p',
        text: 'Une enquête a révélé que plus de 900 voitures volées en Europe avaient été exportées frauduleusement depuis le port de Marseille vers l’Algérie entre mai 2024 et mai 2025. Un véhicule volé peut être saisi, même des mois après son arrivée : l’acheteur perd alors la voiture et l’argent. Voici les vérifications à exiger, quel que soit le vendeur.',
      },
      { type: 'h2', id: 'papiers', text: 'Des papiers au nom du vendeur' },
      {
        type: 'list',
        items: [
          'Le **certificat d’immatriculation** (carte grise) doit être au nom du vendeur. Sinon, exigez le **certificat de cession** qui prouve la chaîne de propriété (par exemple entre le constructeur et le garage).',
          'Le **certificat de situation administrative** (non-gage) : il prouve que le véhicule n’est ni gagé, ni volé, ni frappé d’opposition.',
          'L’**historique** du véhicule (rapport HistoVec en France) : propriétaires successifs, sinistres déclarés, contrôles techniques.',
        ],
      },
      { type: 'h2', id: 'signaux', text: 'Les signaux d’alerte' },
      {
        type: 'list',
        items: [
          'Une voiture proposée « dédouanée clé en main » sans aucun document à votre nom.',
          'Un vendeur qui vous demande de déclarer un prix inférieur au prix payé : c’est illégal et risqué pour vous.',
          'Un prix très en dessous du marché, un paiement en espèces exigé, une société introuvable.',
        ],
      },
      { type: 'h2', id: 'export', text: 'Les documents d’export' },
      {
        type: 'p',
        text: 'Le document d’export (EX-A / EX1) doit être établi avant l’embarquement : il prouve la sortie du véhicule de l’Union européenne et permet la vente hors taxe. Une facture détaillée, au nom de l’acheteur, est indispensable au dédouanement.',
      },
      { type: 'h2', id: 'nous', text: 'Nos engagements' },
      {
        type: 'p',
        text: 'SKH Global Motors est une SAS immatriculée en France (SIRET 991 121 880 00017). Pour chaque véhicule, nous vérifions l’origine et les documents, et nous vous remettons une facture conforme et les justificatifs d’export. Consultez nos [mentions légales](/mentions-legales) ou [contactez-nous](/contact) pour toute question.',
      },
    ],
  },

  'export-voiture-tunisie-maroc': {
    title: 'Exporter une voiture de France vers la Tunisie ou le Maroc',
    description:
      'Achat en France, documents d’export, transport maritime : comment nous accompagnons l’export d’un véhicule vers la Tunisie et le Maroc.',
    blocks: [
      {
        type: 'p',
        text: 'Si l’Algérie est notre premier marché, nous accompagnons aussi, sur demande, l’export de véhicules vers la Tunisie et le Maroc. La partie française du dossier est la même ; ce sont les règles d’importation du pays d’arrivée qui changent.',
      },
      { type: 'h2', id: 'france', text: 'Ce que nous prenons en charge en France' },
      {
        type: 'list',
        items: [
          'La recherche et l’inspection du véhicule, en France ou en Europe.',
          'L’achat, avec facture hors taxe quand la TVA est récupérable.',
          'Les documents d’export (EX-A / EX1), le certificat d’immatriculation et les justificatifs d’origine.',
          'Le transport jusqu’au port de départ et la réservation de la traversée.',
        ],
      },
      { type: 'h2', id: 'arrivee', text: 'À l’arrivée : des règles propres à chaque pays' },
      {
        type: 'p',
        text: 'Âge maximal du véhicule, motorisations admises, droits et taxes, régimes réservés aux ressortissants résidant à l’étranger : chaque pays a ses propres règles, qui évoluent avec les lois de finances. Nous vérifions avec vous les conditions en vigueur avant l’achat, mais seules les douanes du pays d’arrivée font foi.',
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Notre simulateur en ligne calcule uniquement les droits algériens. Pour la Tunisie ou le Maroc, demandez-nous une estimation personnalisée.',
      },
      { type: 'h2', id: 'devis', text: 'Demander un devis' },
      {
        type: 'p',
        text: 'Indiquez-nous le modèle recherché, votre budget et le pays de destination via le [formulaire de contact](/contact) ou sur WhatsApp : un conseiller vous répond avec un chiffrage complet.',
      },
    ],
  },
};
