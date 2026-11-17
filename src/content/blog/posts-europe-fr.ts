import type { PostContent } from './types';

/** French originals — guides on buying and selling cars across Europe. */
export const POSTS_EUROPE_FR: Record<string, PostContent> = {
  'acheter-voiture-france-livraison-europe': {
    title: 'Acheter une voiture en France et se faire livrer en Europe',
    description:
      'Belgique, Allemagne, Espagne, Italie, Pays-Bas : étapes, documents fournis, transport et immatriculation pour acheter une voiture à un professionnel français.',
    blocks: [
      {
        type: 'p',
        text: 'Le marché européen est ouvert : un particulier ou un professionnel installé en Belgique, en Allemagne, en Espagne, en Italie ou aux Pays-Bas peut acheter une voiture à un professionnel français, puis l’immatriculer chez lui. Les démarches sont bien rodées, à condition de savoir quels documents demander et comment le véhicule voyagera. Voici le déroulé type.',
      },
      { type: 'h2', id: 'etapes', text: 'Les étapes d’un achat à distance' },
      {
        type: 'steps',
        items: [
          '**Sélection et vérifications** : photos détaillées, historique d’entretien, rapport HistoVec et, si besoin, une visio ou une inspection par un tiers.',
          '**Proposition et bon de commande** : prix, statut TVA du véhicule (marge ou TVA récupérable), options de livraison et délais.',
          '**Paiement** par virement bancaire sur le compte de la société, au nom de laquelle la facture est émise.',
          '**Préparation administrative** : facture, certificat d’immatriculation français, certificat de conformité, déclaration de cession dans le système d’immatriculation français.',
          '**Transport** par camion ou retrait sur place avec des plaques temporaires.',
          '**Immatriculation** dans votre pays, selon la procédure locale.',
        ],
      },
      { type: 'h2', id: 'documents', text: 'Les documents remis par le vendeur' },
      {
        type: 'list',
        items: [
          'La **facture** à votre nom (ou à celui de votre société), avec le numéro d’identification (VIN), le kilométrage et le régime de TVA appliqué.',
          'Le **certificat d’immatriculation français** (carte grise) barré et signé, accompagné du **certificat de cession**.',
          'Le **certificat de conformité européen (COC)**, qui atteste que le véhicule respecte la réception par type de l’UE. Il facilite fortement l’immatriculation dans un autre État membre ; s’il manque, il peut généralement être demandé au constructeur, parfois contre paiement.',
          'Selon les cas : carnet d’entretien, factures, rapport de contrôle technique et double des clés.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Pour un acheteur professionnel, la facture peut être établie hors taxe si le véhicule est à TVA récupérable et si votre numéro de TVA intracommunautaire est valide. Détails dans notre guide sur la [TVA des achats de voitures en Europe](/blog/tva-voiture-occasion-achat-europe).',
      },
      { type: 'h2', id: 'transport', text: 'Les options de transport' },
      {
        type: 'p',
        text: 'La solution la plus simple est la **livraison par camion porte-voitures** : le véhicule voyage assuré, sans kilomètres supplémentaires, et vous le réceptionnez à l’adresse convenue. Le coût dépend de la distance, du gabarit et des délais souhaités ; il est chiffré avant la commande.',
      },
      {
        type: 'p',
        text: 'Vous pouvez aussi **venir chercher la voiture et la conduire jusque chez vous**. Il faut alors des plaques et une assurance valables pour le trajet : plaques de transit ou d’export délivrées par votre pays, ou immatriculation temporaire française selon votre situation. Notre guide sur les [plaques WW, transit et export](/blog/plaques-ww-transit-export-voiture) détaille les possibilités.',
      },
      { type: 'h2', id: 'immatriculation', text: 'L’immatriculation dans votre pays' },
      {
        type: 'p',
        text: 'Chaque pays a sa procédure : contrôle technique ou inspection d’identification, paiement d’une taxe d’immatriculation ou de mise en circulation (parfois élevée, comme aux Pays-Bas ou en Belgique selon la région), justificatif fiscal pour la TVA. Les montants et délais changent régulièrement : renseignez-vous auprès de l’administration ou d’un professionnel de votre pays avant l’achat, pour connaître le coût réel une fois la voiture immatriculée.',
      },
      {
        type: 'p',
        text: 'Nous vendons à des particuliers et à des professionnels en France et dans toute l’Europe, avec livraison sur demande. Nos véhicules vendus en Europe sont couverts par une **garantie de 3 mois**, que vous pouvez faire prolonger si vous le souhaitez. Parcourez notre [stock de véhicules](/voitures) ou [contactez-nous](/contact) pour un devis livré dans votre pays.',
      },
    ],
  },

  'tva-voiture-occasion-achat-europe': {
    title: 'TVA et achat d’une voiture d’occasion en Europe : marge, HT, véhicule neuf',
    description:
      'Régime de la marge, voiture à TVA récupérable, livraison intracommunautaire exonérée, règle des 6 mois / 6 000 km : comprendre la TVA d’un achat en Europe.',
    blocks: [
      {
        type: 'p',
        text: 'Quand on achète une voiture dans un autre pays de l’Union européenne, la question de la TVA détermine une bonne partie du prix final. Tout dépend de trois éléments : le régime fiscal du véhicule, le statut de l’acheteur (particulier ou professionnel) et l’âge ou le kilométrage de la voiture. Voici les principes généraux, issus de la directive TVA européenne.',
      },
      { type: 'h2', id: 'marge', text: 'Le régime de la marge' },
      {
        type: 'p',
        text: 'La plupart des voitures d’occasion achetées à des particuliers sont revendues sous le **régime de la marge** (en France, régime des biens d’occasion de l’article 297 A du CGI). Le professionnel ne paie la TVA que sur sa marge, et la facture ne fait **pas apparaître de TVA** : elle porte une mention du type « Régime particulier – Biens d’occasion ».',
      },
      {
        type: 'list',
        items: [
          'La TVA sur la marge est due **en France**, quel que soit le pays de l’acheteur.',
          'L’acheteur, même professionnel, **ne peut pas récupérer** cette TVA.',
          'Il n’y a pas de TVA supplémentaire à payer dans le pays de destination au titre de l’achat (les taxes d’immatriculation locales restent dues).',
        ],
      },
      { type: 'h2', id: 'tva-recuperable', text: 'Les voitures à TVA récupérable : particuliers et professionnels' },
      {
        type: 'p',
        text: 'Certains véhicules ont été achetés par le professionnel avec une TVA déductible : voitures issues de flottes, de loueurs ou de concessions. Ils sont revendus avec une TVA calculée sur le prix total. Pour un acheteur **particulier** établi dans un autre pays de l’UE, la TVA française s’applique alors normalement (sauf véhicule « neuf », voir plus bas).',
      },
      {
        type: 'p',
        text: 'Si l’acheteur est une entreprise assujettie à la TVA dans un autre État membre, la vente d’un véhicule à TVA récupérable peut être **exonérée en France** : c’est une livraison intracommunautaire. L’acheteur déclare alors la TVA dans son propre pays (autoliquidation) et la déduit selon ses droits.',
      },
      {
        type: 'steps',
        items: [
          'L’acheteur communique son **numéro de TVA intracommunautaire**, que le vendeur vérifie dans la base européenne **VIES**.',
          'La facture est émise hors taxe avec la mention de l’exonération et les numéros de TVA des deux parties.',
          'Le vendeur conserve la **preuve du transport** vers l’autre État membre (lettre de voiture, attestation de réception…).',
        ],
      },
      { type: 'h2', id: 'neuf', text: 'La règle du « moyen de transport neuf »' },
      {
        type: 'p',
        text: 'Pour la TVA européenne, une voiture est considérée comme **neuve** si elle a été mise en service depuis **6 mois au plus** ou si elle a parcouru **6 000 km au plus**. Dans ce cas, la TVA est due **dans le pays de destination**, même si l’acheteur est un particulier : la vente est facturée hors taxe en France et l’acheteur paie la TVA de son pays, en général au moment de l’immatriculation.',
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Ces règles sont des principes généraux : leur application (justificatifs, délais, formulaires) varie d’un pays à l’autre et peut évoluer. Avant un achat important, vérifiez votre situation auprès de l’administration fiscale de votre pays ou de votre expert-comptable.',
      },
      {
        type: 'p',
        text: 'Nous indiquons le régime de TVA de chaque voiture avant la commande et établissons une facture conforme, pour les particuliers comme pour les professionnels, en France et partout en Europe. Consultez notre [stock](/voitures) ou [contactez-nous](/contact) avec votre numéro de TVA pour une offre adaptée.',
      },
    ],
  },

  'importer-voiture-europe-en-france-quitus-fiscal': {
    title: 'Importer une voiture d’un pays de l’UE en France : quitus fiscal, COC, carte grise',
    description:
      'Quitus fiscal, certificat de conformité, démarche ANTS et taxes : les étapes pour immatriculer en France une voiture achetée dans un autre pays européen.',
    blocks: [
      {
        type: 'p',
        text: 'Acheter une voiture en Allemagne, en Belgique ou en Espagne peut sembler avantageux. Mais avant de rouler en France avec une carte grise française, il faut franchir plusieurs étapes administratives. Voici lesquelles, et pourquoi acheter à un professionnel français qui s’en est déjà chargé simplifie beaucoup les choses.',
      },
      { type: 'h2', id: 'quitus', text: 'Étape 1 : le quitus fiscal' },
      {
        type: 'p',
        text: 'Le **quitus fiscal** (certificat fiscal) prouve que la situation du véhicule au regard de la TVA est réglée. Il est indispensable pour immatriculer en France une voiture achetée dans un autre État membre. Il est délivré par le service des impôts compétent, et la demande peut aujourd’hui se faire en ligne dans la plupart des cas.',
      },
      {
        type: 'list',
        items: [
          'Pièces habituelles : facture ou certificat de vente, certificat d’immatriculation étranger, pièce d’identité et justificatif de domicile.',
          'Pour une voiture d’occasion (plus de 6 mois **et** plus de 6 000 km), le quitus est en principe délivré sans paiement de TVA en France.',
          'Pour un véhicule « neuf » au sens de la TVA (6 mois ou moins, ou 6 000 km ou moins), la TVA française doit être payée pour obtenir le quitus.',
        ],
      },
      { type: 'h2', id: 'coc', text: 'Étape 2 : la conformité du véhicule' },
      {
        type: 'p',
        text: 'Le **certificat de conformité européen (COC)** prouve que la voiture correspond à un type réceptionné dans l’UE. S’il n’a pas été remis avec le véhicule, il se demande au constructeur ou à son représentant en France, souvent contre paiement. À défaut, une attestation d’identification ou une réception à titre isolé auprès de la DREAL peut être nécessaire, ce qui allonge nettement les délais.',
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Si la voiture a plus de 4 ans, un contrôle technique récent est en général exigé. Un contrôle réalisé dans un autre pays de l’UE peut être accepté sous conditions : vérifiez les règles en vigueur sur le site de l’ANTS.',
      },
      { type: 'h2', id: 'ants', text: 'Étape 3 : la demande de carte grise' },
      {
        type: 'steps',
        items: [
          'Déposer la demande sur le site de l’**ANTS** (rubrique véhicule acheté à l’étranger) ou passer par un professionnel habilité.',
          'Joindre le quitus fiscal, le COC, le certificat d’immatriculation étranger, la facture, le contrôle technique le cas échéant et une attestation d’assurance.',
          'Payer les taxes : taxe régionale, et selon le véhicule **malus écologique** et **malus au poids**, qui peuvent s’appliquer à une première immatriculation en France, avec une réfaction selon l’âge. Leurs barèmes changent chaque année avec la loi de finances : simulez le coût avant d’acheter, il peut annuler l’écart de prix avec une voiture déjà immatriculée en France.',
          'Rouler si besoin avec un **certificat provisoire WW** en attendant la carte grise définitive.',
        ],
      },
      { type: 'h2', id: 'simplicite', text: 'Pourquoi acheter à un professionnel français' },
      {
        type: 'list',
        items: [
          'Un véhicule déjà **immatriculé en France** : pas de quitus fiscal ni de dossier d’importation à monter.',
          'Le coût final est connu dès le départ, sans malus ni frais de conformité imprévus.',
          'Un vendeur identifiable en France, en cas de question après la vente.',
        ],
      },
      {
        type: 'p',
        text: 'Nous vendons des voitures en France et les livrons dans toute l’Europe. Consultez notre [stock](/voitures) ou [contactez-nous](/contact) : nous vous indiquons pour chaque véhicule les documents fournis et le coût d’immatriculation à prévoir.',
      },
    ],
  },

  'plaques-ww-transit-export-voiture': {
    title: 'Plaques WW, transit et export : rouler avec une voiture pas encore immatriculée',
    description:
      'WW, W garage, TT, plaques de transit ou d’export étrangères : quelles immatriculations temporaires pour livrer une voiture en Europe ou l’exporter.',
    blocks: [
      {
        type: 'p',
        text: 'Entre l’achat d’une voiture et son immatriculation définitive, il y a souvent un trajet à faire : rentrer chez soi après un achat à l’étranger, rejoindre un port d’embarquement, livrer un client dans un autre pays. Sans plaques valides et sans assurance, impossible de rouler légalement. Plusieurs solutions temporaires existent, chacune avec son usage.',
      },
      { type: 'h2', id: 'france', text: 'Les immatriculations temporaires françaises' },
      {
        type: 'list',
        items: [
          '**WW (certificat provisoire)** : pour un véhicule importé en France en attente de son immatriculation définitive. Il permet de rouler pendant l’instruction du dossier, pour une durée limitée (de l’ordre de quelques mois, selon les règles en vigueur sur le site de l’ANTS).',
          '**W garage** : réservé aux professionnels de l’automobile, pour les essais, les convoyages et les présentations de véhicules. Il ne remplace pas une immatriculation pour le client.',
          '**TT (transit temporaire)** : destiné notamment aux personnes non domiciliées en France qui achètent un véhicule et l’emmènent hors de France. Sa validité est limitée dans le temps.',
        ],
      },
      { type: 'h2', id: 'etranger', text: 'Les plaques de transit et d’export d’autres pays' },
      {
        type: 'p',
        text: 'Beaucoup de pays européens délivrent leurs propres plaques temporaires, valables de quelques jours à quelques mois : plaques de courte durée ou d’export en Allemagne, plaques de transit en Belgique, plaques d’export dans d’autres États membres. Un acheteur étranger les obtient en général dans son pays avant de venir chercher le véhicule, avec une assurance correspondante.',
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Conditions, durée et reconnaissance à l’étranger varient selon le pays et changent régulièrement. Renseignez-vous auprès de l’administration de votre pays avant le départ et vérifiez que l’assurance couvre bien tous les pays traversés.',
      },
      { type: 'h2', id: 'assurance', text: 'L’assurance, un point à ne pas négliger' },
      {
        type: 'p',
        text: 'Une plaque temporaire sans assurance ne sert à rien. L’assurance doit couvrir le véhicule précis (numéro VIN), la durée du trajet et chaque pays traversé. Certains assureurs proposent des contrats spécifiques de courte durée ; d’autres refusent les plaques étrangères. Gardez l’attestation, la facture et le certificat d’immatriculation (ou le certificat de cession) dans la voiture pendant tout le trajet.',
      },
      { type: 'h2', id: 'quand', text: 'Quand en a-t-on besoin ?' },
      {
        type: 'steps',
        items: [
          '**Livraison en Europe par camion** : aucune plaque temporaire n’est nécessaire, le véhicule ne roule pas.',
          '**Retrait par l’acheteur européen** : plaques de transit ou d’export de son pays, ou immatriculation temporaire française selon sa situation.',
          '**Export hors UE** (Algérie, Tunisie, Maroc) : le véhicule est le plus souvent acheminé jusqu’au port par camion ; s’il roule, il lui faut une immatriculation et une assurance valables, en plus des documents d’export (EX-A).',
          '**Import en France** : certificat provisoire WW en attendant la carte grise définitive.',
        ],
      },
      {
        type: 'p',
        text: 'Pour l’import en France, voir aussi notre guide sur le [quitus fiscal et la carte grise](/blog/importer-voiture-europe-en-france-quitus-fiscal).',
      },
      {
        type: 'p',
        text: 'Nous vendons et livrons nos véhicules en France et dans toute l’Europe, et préparons les documents d’export pour le Maghreb. Choisissez un véhicule dans notre [stock](/voitures) ou [contactez-nous](/contact) pour organiser le transport.',
      },
    ],
  },

  'vendre-sa-voiture-a-un-professionnel-reprise': {
    title: 'Vendre sa voiture à un professionnel : estimation, documents et cession',
    description:
      'Estimation, papiers à fournir, certificat de cession, déclaration sur l’ANTS et paiement sécurisé : bien vendre sa voiture à un garage en France.',
    blocks: [
      {
        type: 'p',
        text: 'Vendre sa voiture à un professionnel, en reprise ou en vente sèche, évite les annonces, les visites et les risques d’une vente entre particuliers. Le prix est souvent un peu inférieur, mais la transaction est rapide et encadrée. Voici comment se passe l’estimation, quels documents préparer et comment sécuriser la vente.',
      },
      { type: 'h2', id: 'estimation', text: 'Comment le professionnel estime votre voiture' },
      {
        type: 'list',
        items: [
          '**La cote du marché** : prix de modèles comparables (âge, kilométrage, finition, options) et rapidité de revente.',
          '**L’état réel** : carrosserie, intérieur, pneus, freins, voyants, essai routier.',
          '**L’historique** : carnet d’entretien, factures, nombre de propriétaires, sinistres déclarés.',
          '**Les frais de remise en état** et la marge nécessaire à la revente, garantie comprise.',
        ],
      },
      {
        type: 'p',
        text: 'Un dossier complet (factures d’entretien, double des clés, carnet tamponné) rassure l’acheteur et pèse dans l’offre. Comparez plusieurs propositions, mais à état et conditions équivalents. Une voiture présentée propre, avec ses accessoires d’origine (câbles de recharge, tapis, cache-bagages), fait aussi meilleure impression, même si l’offre reposera surtout sur l’état mécanique et l’historique.',
      },
      { type: 'h2', id: 'documents', text: 'Les documents à préparer' },
      {
        type: 'list',
        items: [
          'Le **certificat d’immatriculation** (carte grise) à votre nom, barré avec la mention « Vendu le … » (date et heure), et signé.',
          'Le **certificat de cession** (formulaire cerfa n° 15776), rempli en deux exemplaires et signé par les deux parties.',
          'Le **certificat de situation administrative** (non-gage) de moins de 15 jours, téléchargeable gratuitement sur le site du ministère de l’Intérieur.',
          'Votre pièce d’identité et, pour une reprise, le bon de commande du véhicule acheté.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Le contrôle technique de moins de 6 mois, obligatoire pour vendre à un particulier une voiture de plus de 4 ans, n’est en principe pas exigé lorsque l’acheteur est un professionnel de l’automobile. Le professionnel en tiendra toutefois compte dans son offre.',
      },
      { type: 'h2', id: 'declaration', text: 'La déclaration de cession' },
      {
        type: 'steps',
        items: [
          'Le vendeur déclare la cession sur le site de l’**ANTS** dans les **15 jours** suivant la vente.',
          'Il obtient un **code de cession** à transmettre à l’acheteur, ainsi qu’un accusé d’enregistrement à conserver.',
          'Un professionnel habilité peut aussi enregistrer la cession directement dans le système d’immatriculation : demandez-lui le justificatif.',
          'Cette déclaration vous dégage de toute responsabilité (amendes, infractions) pour les faits commis après la date et l’heure de la vente. Pensez ensuite à résilier votre assurance.',
        ],
      },
      { type: 'h2', id: 'paiement', text: 'Sécuriser le paiement' },
      {
        type: 'list',
        items: [
          'Privilégiez le **virement bancaire** : ne remettez les clés et la carte grise qu’une fois les fonds reçus sur votre compte.',
          'En cas de **chèque de banque**, vérifiez-le directement auprès de la banque émettrice, à partir de coordonnées trouvées par vous-même.',
          'Le paiement en espèces à un professionnel est strictement plafonné par la loi : évitez-le.',
          'Vérifiez l’identité de l’acheteur professionnel (nom, SIREN, adresse) avant de signer.',
        ],
      },
      {
        type: 'p',
        text: 'Vous changez de voiture ? Parcourez notre [stock](/voitures), vendu et livré en France et dans toute l’Europe, ou [contactez-nous](/contact) pour parler de votre véhicule actuel.',
      },
    ],
  },

  'marche-voiture-occasion-premium-europe-2026': {
    title: 'Le marché européen de l’occasion premium en 2026 : d’où viennent les voitures récentes',
    description:
      'Fins de leasing, véhicules de démo, flottes, enchères : comment circulent les voitures premium récentes en Europe et ce que vérifient les pros.',
    blocks: [
      {
        type: 'p',
        text: 'Une BMW, une Mercedes, une Audi ou une Porsche de deux ou trois ans n’arrive pas chez un revendeur par hasard. Les voitures premium récentes suivent des circuits bien précis à l’échelle européenne. Les comprendre aide à savoir ce que l’on achète et à poser les bonnes questions.',
      },
      { type: 'h2', id: 'origines', text: 'D’où viennent les voitures premium récentes' },
      {
        type: 'list',
        items: [
          '**Fins de leasing** : une large part des voitures premium neuves est financée en location longue durée ou en location avec option d’achat. À la fin du contrat, souvent après 2 à 4 ans, la voiture revient au loueur ou à la société de financement, qui la revend.',
          '**Véhicules de démonstration et de direction** : utilisés quelques mois par les concessions ou les constructeurs, avec un faible kilométrage.',
          '**Flottes d’entreprise et loueurs** : véhicules de société et voitures de location courte durée, renouvelés selon des cycles réguliers.',
          '**Reprises** de particuliers lors de l’achat d’un véhicule neuf.',
        ],
      },
      { type: 'h2', id: 'remarketing', text: 'Le rôle des enchères de remarketing' },
      {
        type: 'p',
        text: 'Les sociétés de leasing, les loueurs et les captives financières des constructeurs revendent une grande partie de leurs véhicules à des professionnels, via des plateformes d’enchères en ligne ou des ventes réservées aux marchands. Les acheteurs y trouvent des lots de véhicules récents, accompagnés d’un rapport d’état, mais doivent agir vite et connaître les cotes de chaque marché.',
      },
      { type: 'h2', id: 'france-allemagne', text: 'Pourquoi la France et l’Allemagne comptent' },
      {
        type: 'p',
        text: 'L’Allemagne est le premier marché automobile d’Europe et le berceau de plusieurs grandes marques premium ; les voitures de société y sont très répandues, ce qui alimente un flux régulier de véhicules récents. La France dispose elle aussi d’un marché de la location longue durée très développé. Ces deux pays sont donc des sources majeures de voitures premium d’occasion, qui circulent ensuite dans toute l’Europe et au-delà.',
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Les prix, les volumes et les tendances (électrification, valeurs résiduelles) évoluent vite : méfiez-vous des chiffres présentés comme définitifs et comparez toujours plusieurs sources récentes.',
      },
      { type: 'h2', id: 'verifications', text: 'Ce que vérifient les acheteurs professionnels' },
      {
        type: 'steps',
        items: [
          '**L’historique** : entretien chez le réseau ou un spécialiste, kilométrage cohérent, nombre de propriétaires.',
          '**Le rapport d’état** : dommages, réparations, peinture, pneus et freins.',
          '**L’origine et les papiers** : certificat d’immatriculation, COC, absence de gage, de vol ou d’opposition.',
          '**Le statut TVA** : régime de la marge ou TVA récupérable, déterminant pour les ventes entre pays (voir notre [guide TVA](/blog/tva-voiture-occasion-achat-europe)).',
          '**Les rappels constructeur** et la garantie restante éventuelle.',
          '**Le coût de transport et d’immatriculation** dans le pays de revente.',
        ],
      },
      {
        type: 'p',
        text: 'Une voiture récente issue de ces circuits peut être un très bon achat, à condition que son historique soit documenté et ses papiers en règle. Demandez systématiquement l’origine du véhicule, son historique et son statut TVA avant de vous engager.',
      },
      {
        type: 'p',
        text: 'Nous sélectionnons des voitures récentes et premium et les vendons en France et dans toute l’Europe, avec livraison. Découvrez notre [stock](/voitures) ou [contactez-nous](/contact) pour une recherche personnalisée.',
      },
    ],
  },
};
