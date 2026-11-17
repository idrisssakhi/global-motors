import type { PostContent } from './types';

/** French originals — guides on buying a used car in France from a professional. */
export const POSTS_FRANCE_FR: Record<string, PostContent> = {
  'acheter-voiture-occasion-professionnel-garanties': {
    title: 'Acheter une voiture d’occasion chez un professionnel : vos garanties',
    description:
      'Garantie légale de conformité, vices cachés, garantie commerciale, facture, droit de rétractation : ce que change l’achat d’une occasion chez un pro.',
    blocks: [
      {
        type: 'p',
        text: 'Entre un particulier et un professionnel, le prix affiché n’est qu’une partie de la comparaison. Acheter une voiture d’occasion à un vendeur professionnel vous fait bénéficier de protections prévues par la loi, que la vente entre particuliers n’offre pas ou seulement en partie. Voici lesquelles, et leurs limites.',
      },
      { type: 'h2', id: 'garantie-conformite', text: 'La garantie légale de conformité' },
      {
        type: 'p',
        text: 'Prévue par le Code de la consommation (articles L217-3 et suivants), elle s’applique lorsqu’un professionnel vend un bien à un consommateur, y compris un véhicule d’occasion. Le vendeur répond des défauts de conformité existant lors de la délivrance et apparaissant dans un délai de **deux ans**. Depuis la réforme entrée en vigueur en 2022, pour un bien d’occasion, le défaut apparu dans les **12 premiers mois** est présumé exister au moment de la livraison : vous n’avez pas à prouver qu’il était antérieur à la vente. Au-delà, c’est en principe à vous d’en apporter la preuve.',
      },
      {
        type: 'list',
        items: [
          'Vous pouvez demander la **réparation** ou le **remplacement** du véhicule.',
          'Si aucune de ces solutions n’est possible ou n’aboutit, vous pouvez obtenir une **réduction du prix** ou, si le défaut est suffisamment grave, la **résolution de la vente**.',
          'La garantie ne couvre pas l’usure normale ni les défauts dont vous aviez connaissance lors de l’achat.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Les règles détaillées (délais, présomption, exclusions) peuvent évoluer. À la date de rédaction, la fiche « Garantie légale de conformité » de service-public.fr reste la référence à consulter.',
      },
      { type: 'h2', id: 'vices-caches', text: 'La garantie des vices cachés' },
      {
        type: 'p',
        text: 'Issue du Code civil (articles 1641 et suivants), elle s’applique à toute vente, y compris entre particuliers. Le vice doit être caché, antérieur à la vente et rendre le véhicule impropre à l’usage ou en diminuer fortement l’usage. L’action doit être engagée dans les deux ans suivant la découverte du vice. En pratique, la preuve est plus lourde que pour la garantie de conformité, souvent avec une expertise.',
      },
      { type: 'h2', id: 'garantie-commerciale', text: 'La garantie commerciale, un plus facultatif' },
      {
        type: 'p',
        text: 'Le professionnel peut proposer en plus une garantie commerciale (parfois appelée « garantie mécanique »), gratuite ou payante. Elle ne remplace jamais les garanties légales. Lisez son contrat : durée, pièces couvertes, plafonds, franchise, conditions d’entretien à respecter. Chez SKH Global Motors, nos véhicules vendus en Europe bénéficient d’une **garantie de 3 mois**, extensible sur demande, en plus des garanties légales.',
      },
      { type: 'h2', id: 'facture-retractation', text: 'Facture et droit de rétractation' },
      {
        type: 'list',
        items: [
          '**Facture** : le professionnel vous remet une facture détaillée (véhicule, numéro VIN, kilométrage, prix, garanties). Conservez-la : elle sert de preuve en cas de litige et lors de la revente.',
          '**Achat en concession ou en agence** : il n’existe pas de droit de rétractation légal de 14 jours. Une fois le bon de commande signé, la vente est en principe ferme, sauf clause contraire.',
          '**Vente à distance** (commande en ligne, par téléphone ou par e-mail sans passage sur place) : le consommateur dispose en principe de **14 jours** pour se rétracter, à compter de la réception du véhicule.',
          '**Achat à crédit** : le contrat de crédit bénéficie de son propre délai de rétractation (voir notre guide sur le [financement d’une occasion](/blog/financer-voiture-occasion-credit-loa)).',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Ces protections visent les consommateurs. Si vous achetez pour votre société, d’autres règles s’appliquent, notamment pour la garantie de conformité et la rétractation.',
      },
      { type: 'h2', id: 'chez-nous', text: 'Chez SKH Global Motors' },
      {
        type: 'p',
        text: 'Nous vendons aux particuliers et aux professionnels, avec facture et documents remis à la livraison. Consultez notre [stock de véhicules](/voitures) ou [contactez-nous](/contact) : nous vendons et livrons en France et partout en Europe.',
      },
    ],
  },

  'documents-achat-voiture-occasion-france': {
    title: 'Les documents à obtenir quand vous achetez une voiture d’occasion',
    description:
      'Carte grise barrée, certificat de cession, contrôle technique, non-gage, carnet d’entretien, immatriculation ANTS : la liste complète des papiers à vérifier.',
    blocks: [
      {
        type: 'p',
        text: 'Une voiture d’occasion bien documentée se revend mieux et s’immatricule sans difficulté. Avant de signer, assurez-vous que le vendeur peut vous remettre les pièces suivantes. Chez un professionnel, la plupart sont préparées à l’avance.',
      },
      { type: 'h2', id: 'carte-grise', text: 'Le certificat d’immatriculation (carte grise)' },
      {
        type: 'p',
        text: 'Le vendeur barre la carte grise, y inscrit la mention « Vendu le … à … » avec la date et l’heure de la vente, puis la signe. Vérifiez que le numéro VIN correspond à celui gravé sur le véhicule et que le nom du titulaire correspond au vendeur (ou à la société qui vend). Si le vendeur est un professionnel de l’automobile, la carte grise peut être à son nom ou à celui du précédent propriétaire, selon la façon dont le véhicule est entré en stock.',
      },
      { type: 'h2', id: 'liste', text: 'La liste des documents' },
      {
        type: 'list',
        items: [
          '**Certificat de cession** (formulaire cerfa n° 15776), rempli et signé par le vendeur et l’acheteur, en deux exemplaires. Le vendeur déclare ensuite la cession sur le site de l’ANTS et vous remet un code de cession.',
          '**Procès-verbal de contrôle technique** de moins de 6 mois (ou de moins de 2 mois en cas de contre-visite) pour un véhicule de plus de 4 ans. À la date de rédaction, c’est une condition pour immatriculer le véhicule à votre nom.',
          '**Certificat de situation administrative** (dit « non-gage ») de moins de 15 jours : il indique si le véhicule fait l’objet d’un gage ou d’une opposition empêchant le changement de titulaire.',
          '**Carnet d’entretien et factures** : non obligatoires légalement, mais indispensables pour juger l’historique du véhicule.',
          '**Facture d’achat** si le vendeur est un professionnel, avec les garanties applicables.',
          'Les doubles de clés, le manuel et, pour un véhicule électrique, les câbles de recharge fournis.',
        ],
      },
      { type: 'h2', id: 'immatriculation', text: 'Immatriculer le véhicule à votre nom' },
      {
        type: 'steps',
        items: [
          'Récupérez le code de cession et les documents ci-dessus au moment de la vente.',
          'Faites la demande de certificat d’immatriculation sur le site de l’ANTS (immatriculation.ants.gouv.fr) ou auprès d’un professionnel habilité, **dans le mois** qui suit l’achat.',
          'Réglez la taxe régionale, dont le montant varie selon la région et la puissance fiscale.',
          'Imprimez le certificat provisoire (CPI) pour circuler en attendant la nouvelle carte grise, envoyée par courrier.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Les démarches et tarifs évoluent : vérifiez la procédure à jour sur service-public.fr ou ants.gouv.fr. De nombreux professionnels habilités peuvent effectuer l’immatriculation pour vous.',
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Méfiez-vous d’un vendeur qui ne peut pas fournir le certificat de non-gage ou dont l’identité ne correspond pas à la carte grise. Voir aussi notre guide pour [vérifier l’historique d’un véhicule](/blog/verifier-historique-voiture-kilometrage-histovec).',
      },
      { type: 'h2', id: 'chez-nous', text: 'Un dossier complet à la livraison' },
      {
        type: 'p',
        text: 'Pour chaque véhicule de notre [stock](/voitures), nous préparons les documents de vente et vous indiquons ce qui sera remis à la livraison. Une question ? [Contactez-nous](/contact) : nous vendons et livrons en France et partout en Europe.',
      },
    ],
  },

  'verifier-historique-voiture-kilometrage-histovec': {
    title: 'Vérifier l’historique et le kilométrage d’une voiture d’occasion',
    description:
      'HistoVec, rapports de contrôle technique, factures d’entretien, signes d’un compteur trafiqué : comment contrôler le passé d’une voiture d’occasion.',
    blocks: [
      {
        type: 'p',
        text: 'Le kilométrage et l’historique d’entretien pèsent lourd dans le prix d’une voiture d’occasion. Ils sont aussi la cible de la fraude la plus courante : le compteur trafiqué. Heureusement, plusieurs sources permettent de recouper les informations avant d’acheter.',
      },
      { type: 'h2', id: 'histovec', text: 'HistoVec, le rapport officiel et gratuit' },
      {
        type: 'p',
        text: 'HistoVec est un service gratuit du ministère de l’Intérieur. Le titulaire de la carte grise génère un rapport et le partage avec l’acheteur (lien ou code). À la date de rédaction, ce rapport présente notamment :',
      },
      {
        type: 'list',
        items: [
          'les caractéristiques du véhicule et la date de première immatriculation ;',
          'le nombre de titulaires et les changements de propriétaire ;',
          'la situation administrative : gage, opposition, vol déclaré ;',
          'les sinistres ayant entraîné une procédure de véhicule endommagé ;',
          'l’historique des contrôles techniques, avec les kilométrages relevés lorsqu’ils sont disponibles.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Un vendeur sérieux n’a aucune raison de refuser de partager le rapport HistoVec. Un refus doit vous alerter.',
      },
      { type: 'h2', id: 'controle-technique', text: 'Lire les rapports de contrôle technique' },
      {
        type: 'p',
        text: 'Chaque procès-verbal indique le kilométrage relevé et les défaillances constatées. Comparez-les d’un contrôle à l’autre : le kilométrage doit toujours augmenter, de façon cohérente avec l’usage. Les défaillances mineures récurrentes (freins, pneus, éclairage) disent aussi beaucoup du sérieux de l’entretien.',
      },
      { type: 'h2', id: 'entretien', text: 'Recouper avec l’entretien' },
      {
        type: 'p',
        text: 'Le carnet d’entretien, papier ou numérique, et les factures de garage portent eux aussi un kilométrage et une date. Sur beaucoup de modèles récents, le réseau de la marque peut consulter l’historique d’entretien enregistré. Vérifiez que les grandes échéances (distribution, vidanges, freins) ont été respectées.',
      },
      { type: 'h2', id: 'signes-fraude', text: 'Les signes d’un compteur trafiqué' },
      {
        type: 'steps',
        items: [
          'Comparez le kilométrage affiché avec les relevés des contrôles techniques et des factures : un chiffre plus bas qu’un relevé antérieur est un signal d’alarme.',
          'Observez l’usure du volant, du pommeau de levier, des pédales et du siège conducteur : elle doit être cohérente avec le kilométrage annoncé.',
          'Méfiez-vous des factures ou carnets incomplets précisément sur la période récente.',
          'Demandez une lecture des calculateurs en atelier : certains modules enregistrent un kilométrage distinct de celui du tableau de bord.',
          'Rapprochez le kilométrage de l’âge : un écart très faible ou très élevé par rapport à l’usage habituel mérite une explication.',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Modifier un compteur kilométrique est une infraction. Si vous découvrez une fraude après l’achat, conservez toutes les preuves et rapprochez-vous d’un professionnel du droit ou d’une association de consommateurs.',
      },
      { type: 'h2', id: 'chez-nous', text: 'Des véhicules à l’historique vérifiable' },
      {
        type: 'p',
        text: 'Pour les véhicules de notre [stock](/voitures), demandez-nous l’historique disponible et les documents d’entretien avant de vous décider. Vous pouvez aussi lire notre guide sur [les documents à obtenir](/blog/documents-achat-voiture-occasion-france). Nous vendons et livrons en France et partout en Europe : [contactez-nous](/contact).',
      },
    ],
  },

  'voiture-occasion-ex-leasing-lld-loa': {
    title: 'Voitures d’occasion ex-LLD et ex-LOA : une bonne affaire ?',
    description:
      'Fin de contrats de location longue durée et LOA : pourquoi ces véhicules récents et suivis alimentent le marché de l’occasion, et ce qu’il faut vérifier.',
    blocks: [
      {
        type: 'p',
        text: 'Une grande partie des voitures récentes vendues en France ne sont pas achetées mais louées, en location longue durée (LLD) ou en location avec option d’achat (LOA). À la fin du contrat, beaucoup de ces véhicules sont restitués et reviennent sur le marché de l’occasion. Pour l’acheteur, c’est une source intéressante de voitures récentes, à condition de savoir quoi vérifier.',
      },
      { type: 'h2', id: 'origine', text: 'D’où viennent ces véhicules ?' },
      {
        type: 'p',
        text: 'En fin de LLD, le véhicule revient à la société qui le possède : loueur longue durée, société de financement liée à un constructeur (« captive ») ou établissement financier. En LOA, le client peut lever l’option d’achat ou rendre le véhicule. Les voitures restituées sont ensuite revendues, souvent à des professionnels, via des ventes aux enchères, des plateformes réservées aux professionnels ou des ventes directes.',
      },
      { type: 'h2', id: 'avantages', text: 'Pourquoi ces voitures sont intéressantes' },
      {
        type: 'list',
        items: [
          '**Des véhicules récents** : les contrats durent souvent entre 2 et 5 ans.',
          '**Un entretien en principe suivi** : beaucoup de contrats incluent ou imposent l’entretien selon le programme du constructeur, ce qui laisse des traces.',
          '**Un historique documenté** : un seul utilisateur principal et un rapport d’état établi à la restitution.',
          '**Des équipements récents** : aides à la conduite, connectivité, motorisations hybrides ou électriques.',
        ],
      },
      { type: 'h2', id: 'points-attention', text: 'Les points à vérifier' },
      {
        type: 'list',
        items: [
          '**Le kilométrage** : les véhicules de flotte d’entreprise peuvent avoir beaucoup roulé ; d’autres, à l’inverse, très peu. Comparez avec l’âge et l’usage.',
          '**L’usure et les petits dommages** : rayures, jantes frottées, sièges. Ils sont généralement listés dans le rapport de restitution, mais pas toujours réparés avant la revente.',
          '**Le rapport de restitution ou d’expertise** : demandez s’il est disponible. Il décrit l’état du véhicule au moment de son retour.',
          '**L’historique d’entretien** : vérifiez les factures ou le carnet numérique, et que les rappels constructeur ont été traités.',
          '**La carte grise** : le premier titulaire est souvent une société de location ou de financement. Ce n’est pas un problème, mais l’historique doit être cohérent.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Le rapport HistoVec reste utile pour un ex-LLD : il montre les titulaires successifs, la situation administrative et les contrôles techniques éventuels. Voir notre guide [pour vérifier l’historique](/blog/verifier-historique-voiture-kilometrage-histovec).',
      },
      { type: 'h2', id: 'professionnel', text: 'Le rôle du professionnel' },
      {
        type: 'p',
        text: 'L’accès à ces véhicules passe le plus souvent par des circuits réservés aux professionnels. Le revendeur sélectionne les véhicules, consulte les rapports d’état, prépare la voiture et la revend avec les garanties légales dues par un vendeur professionnel (voir [vos garanties](/blog/acheter-voiture-occasion-professionnel-garanties)).',
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Un ex-LLD n’est pas automatiquement en parfait état : chaque véhicule doit être examiné individuellement. Demandez toujours les documents disponibles avant d’acheter.',
      },
      { type: 'h2', id: 'chez-nous', text: 'Trouver un véhicule récent' },
      {
        type: 'p',
        text: 'Parcourez notre [stock de véhicules](/voitures) et interrogez-nous sur l’origine et l’historique de celui qui vous intéresse. Nous vendons et livrons en France et partout en Europe : [contactez-nous](/contact).',
      },
    ],
  },

  'financer-voiture-occasion-credit-loa': {
    title: 'Financer une voiture d’occasion : crédit affecté, prêt personnel ou LOA',
    description:
      'Crédit affecté, prêt personnel, LOA sur une occasion : fonctionnement, TAEG, assurance et délai de rétractation de 14 jours pour bien choisir.',
    blocks: [
      {
        type: 'p',
        text: 'Payer comptant n’est pas la seule option pour acheter une voiture d’occasion. Plusieurs solutions de financement existent, avec des protections différentes pour l’acheteur. Voici comment les comparer.',
      },
      { type: 'h2', id: 'credit-affecte', text: 'Le crédit affecté (ou crédit auto)' },
      {
        type: 'p',
        text: 'Le crédit affecté finance un achat précis, mentionné dans le contrat. La vente et le crédit sont liés : si le crédit est refusé, la vente est annulée ; si vous exercez votre droit de rétractation sur le crédit, la vente est en principe résolue elle aussi. C’est la formule la plus protectrice pour un consommateur.',
      },
      { type: 'h2', id: 'pret-personnel', text: 'Le prêt personnel' },
      {
        type: 'p',
        text: 'Le prêt personnel n’est pas lié à un achat : vous utilisez les fonds librement. Il peut être plus souple (vous négociez comme un acheteur comptant), mais si un problème survient avec la vente, le crédit continue de courir.',
      },
      { type: 'h2', id: 'loa', text: 'La LOA sur un véhicule d’occasion' },
      {
        type: 'p',
        text: 'La location avec option d’achat existe aussi pour l’occasion. Vous versez éventuellement un premier loyer majoré, puis des loyers mensuels ; à la fin, vous pouvez acheter le véhicule en levant l’option ou le restituer. Vérifiez le kilométrage annuel prévu, le coût des kilomètres supplémentaires, les frais de remise en état à la restitution et le coût total si vous levez l’option.',
      },
      { type: 'h2', id: 'comparer', text: 'Comment comparer les offres' },
      {
        type: 'list',
        items: [
          '**Le TAEG** (taux annuel effectif global) : il intègre les intérêts et les frais obligatoires. C’est l’indicateur à comparer entre deux offres.',
          '**Le coût total du crédit** : la somme que vous paierez en plus du prix du véhicule.',
          '**L’assurance emprunteur** : souvent proposée, parfois exigée par le prêteur ; son coût doit être indiqué séparément (TAEA). Vous pouvez en principe choisir une autre assurance offrant des garanties équivalentes.',
          '**La durée** : une durée longue réduit les mensualités mais augmente le coût total.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Pour un crédit à la consommation, y compris la LOA, l’emprunteur dispose en principe d’un délai de rétractation de **14 jours** à compter de la signature de l’offre. Vérifiez les règles à jour sur service-public.fr.',
      },
      {
        type: 'steps',
        items: [
          'Fixez votre budget total et la mensualité supportable.',
          'Demandez plusieurs offres et comparez le TAEG et le coût total.',
          'Lisez la fiche d’information précontractuelle et les conditions de l’assurance.',
          'Signez l’offre seulement une fois le véhicule choisi et les documents vérifiés.',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.',
      },
      { type: 'h2', id: 'chez-nous', text: 'Votre projet chez nous' },
      {
        type: 'p',
        text: 'Vous souhaitez financer un véhicule de notre [stock](/voitures) ? Renseignez-vous auprès de nous selon les solutions disponibles : nous pouvons vous aider à préparer votre dossier. Nous vendons et livrons en France et partout en Europe : [contactez-nous](/contact).',
      },
    ],
  },

  'essence-hybride-electrique-quelle-occasion-choisir': {
    title: 'Essence, hybride ou électrique : quelle voiture d’occasion choisir ?',
    description:
      'Usage, recharge, vignette Crit’Air, santé de la batterie (SoH), hybride rechargeable : les bons critères pour choisir la motorisation d’une occasion récente.',
    blocks: [
      {
        type: 'p',
        text: 'Sur le marché de l’occasion récente, l’offre s’est diversifiée : essence, hybride simple, hybride rechargeable, 100 % électrique, sans oublier le diesel. Aucune motorisation n’est la meilleure dans l’absolu ; tout dépend de votre usage et de vos possibilités de recharge.',
      },
      { type: 'h2', id: 'usage', text: 'Partir de votre usage' },
      {
        type: 'list',
        items: [
          '**Essence** : polyvalente, prix d’achat souvent plus bas, entretien simple. Adaptée aux petits et moyens kilométrages.',
          '**Hybride (non rechargeable)** : intéressante en ville et en périurbain, où elle réduit la consommation. Aucune recharge à prévoir.',
          '**Hybride rechargeable** : pertinente si vous pouvez recharger souvent et que vos trajets quotidiens tiennent dans l’autonomie électrique. Sans recharge régulière, elle consomme davantage qu’une hybride classique.',
          '**Électrique** : coût d’usage généralement bas si vous rechargez à domicile ou au travail. Vérifiez l’autonomie réelle sur vos trajets longs et l’accès aux bornes rapides.',
          '**Diesel** : encore adapté aux gros rouleurs sur route, mais plus exposé aux restrictions de circulation.',
        ],
      },
      { type: 'h2', id: 'crit-air', text: 'Vignette Crit’Air et restrictions de circulation' },
      {
        type: 'p',
        text: 'La vignette Crit’Air classe les véhicules selon leurs émissions polluantes. À la date de rédaction, les voitures électriques obtiennent la vignette verte (Crit’Air 0) ; les essence récentes (normes Euro 5 et 6) et la plupart des hybrides essence, rechargeables ou non, la Crit’Air 1 ; les diesels récents, la Crit’Air 2. Le classement exact figure sur la carte grise via la norme Euro et la date de première immatriculation.',
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Le cadre des zones à faibles émissions (ZFE) fait l’objet de débats et d’évolutions, et les règles varient d’une agglomération à l’autre. Vérifiez les restrictions applicables là où vous circulez avant de choisir.',
      },
      { type: 'h2', id: 'batterie', text: 'Électrique : la santé de la batterie' },
      {
        type: 'p',
        text: 'Sur une électrique d’occasion, la batterie est l’organe le plus coûteux. Demandez un **certificat d’état de santé de la batterie** (SoH, pour « State of Health »), établi par un outil de diagnostic : il exprime la capacité restante en pourcentage de la capacité d’origine. Vérifiez aussi la garantie constructeur de la batterie, souvent exprimée en années et en kilomètres avec un seuil de capacité minimal, et si elle est transférable.',
      },
      {
        type: 'steps',
        items: [
          'Demandez le certificat SoH et sa date.',
          'Vérifiez la garantie batterie restante (durée, kilométrage, seuil).',
          'Contrôlez les câbles fournis et la puissance de charge acceptée (AC et DC).',
          'Faites un essai incluant, si possible, une recharge.',
        ],
      },
      { type: 'h2', id: 'hybride-rechargeable', text: 'Hybride rechargeable : deux mécaniques à surveiller' },
      {
        type: 'p',
        text: 'Une hybride rechargeable cumule moteur thermique et batterie. Vérifiez l’entretien du moteur thermique comme pour une essence, et l’état de la batterie comme pour une électrique. L’historique de recharge, quand il est disponible, indique comment le véhicule a été utilisé.',
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Quelle que soit la motorisation, vérifiez l’historique et les documents : voir nos guides sur [l’historique du véhicule](/blog/verifier-historique-voiture-kilometrage-histovec) et [les documents d’achat](/blog/documents-achat-voiture-occasion-france).',
      },
      { type: 'h2', id: 'chez-nous', text: 'Trouver la bonne motorisation' },
      {
        type: 'p',
        text: 'Filtrez notre [stock de véhicules](/voitures) par énergie, ou décrivez-nous votre usage via le [formulaire de contact](/contact) : nous vous orientons vers les modèles adaptés. Nous vendons et livrons en France et partout en Europe.',
      },
    ],
  },
};
