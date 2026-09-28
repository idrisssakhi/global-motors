/**
 * Long-form legal documents (privacy policy, terms of use, cookie policy).
 * Kept here rather than in messages/*.json because they are prose, not UI
 * strings. Company facts are interpolated from SITE so they stay in sync.
 *
 * Inline links use Markdown syntax: [label](/path) or [label](https://…).
 * The French text prevails; the Arabic one is a courtesy translation.
 */
import { SITE } from '@/lib/site';

export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] };

export interface LegalSection {
  id: string;
  title: string;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  title: string;
  metaDescription: string;
  intro: string;
  sections: LegalSection[];
}

export type LegalDocKey = 'privacy' | 'terms' | 'cookies';

const p = (text: string): LegalBlock => ({ type: 'p', text });
const list = (...items: string[]): LegalBlock => ({ type: 'list', items });

const L = SITE.legal;
const address = `${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city}, ${SITE.address.country}`;
const years = SITE.leadRetentionMonths / 12;
const contactFr = [
  SITE.phone && `par téléphone ou WhatsApp au ${SITE.phone}`,
  SITE.email && `par e-mail à ${SITE.email}`,
  `par courrier à ${L.name}, ${address}`,
  'via le [formulaire de contact](/contact)',
]
  .filter(Boolean)
  .join(', ');
const contactAr = [
  SITE.phone && `عبر الهاتف أو واتساب على الرقم ${SITE.phone}`,
  SITE.email && `عبر البريد الإلكتروني ${SITE.email}`,
  `عبر البريد إلى ${L.name}، ${address}`,
  'عبر [نموذج الاتصال](/contact)',
]
  .filter(Boolean)
  .join('، ');

// ─────────────────────────────── FR ───────────────────────────────

const privacyFr: LegalDoc = {
  title: 'Politique de confidentialité',
  metaDescription: `Comment ${SITE.name} collecte, utilise et protège vos données personnelles (RGPD) : finalités, durées de conservation, destinataires et droits.`,
  intro: `${L.name} attache une grande importance à la protection de vos données personnelles. Cette politique explique quelles données nous collectons sur ${SITE.url.replace(/^https?:\/\//, '')}, pourquoi, combien de temps nous les gardons et comment exercer vos droits, conformément au Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.`,
  sections: [
    {
      id: 'responsable',
      title: '1. Responsable du traitement',
      blocks: [
        p(`Le responsable du traitement est ${L.name}, ${L.legalForm} immatriculée au ${L.rcs}, dont le siège est situé ${address}.`),
        p(`Vous pouvez nous contacter ${contactFr}. Compte tenu de son activité, ${L.name} n’a pas désigné de délégué à la protection des données.`),
      ],
    },
    {
      id: 'donnees',
      title: '2. Données collectées',
      blocks: [
        p('Nous ne collectons que les données nécessaires pour traiter votre demande :'),
        list(
          'Formulaires de contact, de demande de véhicule ou de recherche : nom, numéro de téléphone, e-mail (facultatif), message (facultatif), langue du site et, le cas échéant, le véhicule concerné.',
          'Demande d’offre depuis le simulateur de dédouanement : en plus des données ci-dessus, les paramètres de la simulation (régime, carburant, âge et cylindrée du véhicule, prix, frais de transport et d’assurance, statut étudiant pour le régime CCR, montant estimé).',
          'Journaux techniques de l’hébergeur : adresse IP, date et heure, page demandée et type de navigateur, utilisés uniquement pour la sécurité et le bon fonctionnement du site.'
        ),
        p('Le site ne demande la création d’aucun compte visiteur et n’utilise aucun outil de mesure d’audience, de publicité ou de profilage. Merci de ne pas transmettre dans vos messages de données sensibles ni de copies de pièces d’identité : nous vous les demanderons, si nécessaire, au moment de la vente.'),
      ],
    },
    {
      id: 'finalites',
      title: '3. Finalités et bases légales',
      blocks: [
        {
          type: 'table',
          head: ['Finalité', 'Base légale (art. 6 RGPD)'],
          rows: [
            ['Répondre à votre demande, vous rappeler, établir un devis ou une offre', 'Mesures précontractuelles prises à votre demande (6.1.b)'],
            ['Suivi de nos échanges commerciaux et amélioration de notre service', 'Intérêt légitime à gérer notre relation client (6.1.f)'],
            ['Sécurité du site, prévention du spam et des abus', 'Intérêt légitime (6.1.f)'],
            ['Affichage de contenus externes (carte, vidéos)', 'Votre consentement (6.1.a)'],
            ['Facturation et comptabilité si vous devenez client', 'Obligation légale (6.1.c)'],
          ],
        },
      ],
    },
    {
      id: 'destinataires',
      title: '4. Destinataires',
      blocks: [
        p(`Vos données sont réservées au personnel habilité de ${L.name}. Elles ne sont jamais vendues, louées ni cédées à des tiers à des fins commerciales. Nous faisons appel aux sous-traitants techniques suivants, liés par un accord de traitement des données :`),
        list(
          `${SITE.hosting.name} (${SITE.hosting.url}) — hébergement du site ;`,
          `${SITE.dataHost.name} (${SITE.dataHost.url}) — base de données, hébergée dans l’${SITE.dataHost.location}.`
        ),
        p('Si vous choisissez de nous écrire sur WhatsApp ou via nos réseaux sociaux, les données échangées sont également traitées par ces plateformes selon leurs propres politiques de confidentialité.'),
      ],
    },
    {
      id: 'transferts',
      title: '5. Transferts hors de l’Union européenne',
      blocks: [
        p(`Vos demandes sont stockées dans l’Union européenne. Nos prestataires ${SITE.hosting.name} (États-Unis) et ${SITE.dataHost.name} (Singapour) peuvent toutefois y accéder pour les besoins du service. Ces transferts sont encadrés par les clauses contractuelles types de la Commission européenne et, le cas échéant, par le Data Privacy Framework UE–États-Unis.`),
      ],
    },
    {
      id: 'conservation',
      title: '6. Durées de conservation',
      blocks: [
        list(
          `Demandes envoyées via le site : ${years} ans à compter de leur envoi, puis suppression automatique.`,
          'Données des clients : pendant la relation commerciale, puis archivées pendant les délais légaux (10 ans pour les pièces comptables).',
          'Journaux techniques : 12 mois au maximum.',
          `Votre choix concernant les cookies : ${SITE.consentMaxAgeMonths} mois.`
        ),
      ],
    },
    {
      id: 'droits',
      title: '7. Vos droits',
      blocks: [
        p('Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation et de portabilité de vos données, d’un droit d’opposition au traitement fondé sur notre intérêt légitime, du droit de retirer votre consentement à tout moment et du droit de définir des directives relatives au sort de vos données après votre décès.'),
        p(`Pour exercer ces droits, contactez-nous ${contactFr}. Nous répondons dans un délai d’un mois. En cas de doute raisonnable sur votre identité, nous pourrons vous demander un justificatif.`),
        p('Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL, 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 ([www.cnil.fr](https://www.cnil.fr/fr/plaintes)).'),
        p('Si vous ne souhaitez pas faire l’objet de prospection commerciale par téléphone, vous pouvez vous inscrire gratuitement sur la liste d’opposition Bloctel ([www.bloctel.gouv.fr](https://www.bloctel.gouv.fr)).'),
      ],
    },
    {
      id: 'securite',
      title: '8. Sécurité',
      blocks: [
        p('Le site est servi exclusivement en HTTPS. L’accès aux demandes est réservé aux personnes authentifiées de notre équipe, et la base de données applique un contrôle d’accès qui empêche tout visiteur de lire les demandes des autres.'),
      ],
    },
    {
      id: 'cookies',
      title: '9. Cookies',
      blocks: [p('L’utilisation de cookies et d’autres traceurs est détaillée dans notre [politique de cookies](/cookies).')],
    },
    {
      id: 'modifications',
      title: '10. Modifications',
      blocks: [p('Nous pouvons faire évoluer cette politique, notamment en cas de changement légal ou de nouveau service. La date de dernière mise à jour figure en haut de cette page.')],
    },
  ],
};

const mediator: { name: string; address: string; url: string } = L.mediator;
const termsFr: LegalDoc = {
  title: 'Conditions générales d’utilisation',
  metaDescription: `Conditions d’utilisation du site ${SITE.name} : annonces de véhicules, simulateur de dédouanement, responsabilité et propriété intellectuelle.`,
  intro: `Les présentes conditions générales d’utilisation (CGU) encadrent l’accès et l’utilisation du site ${SITE.url.replace(/^https?:\/\//, '')}, édité par ${L.name}. En naviguant sur le site, vous acceptez ces CGU.`,
  sections: [
    {
      id: 'editeur',
      title: '1. Éditeur',
      blocks: [p(`Le site est édité par ${L.name}, ${L.legalForm} immatriculée au ${L.rcs}, ${address}. Toutes les informations légales figurent dans les [mentions légales](/mentions-legales).`)],
    },
    {
      id: 'acces',
      title: '2. Accès au site',
      blocks: [p('Le site est accessible gratuitement, sans inscription. Nous nous efforçons de le maintenir disponible, sans pouvoir le garantir : il peut être interrompu pour maintenance, mise à jour ou raison technique, sans que cela ouvre droit à indemnisation.')],
    },
    {
      id: 'vehicules',
      title: '3. Annonces de véhicules',
      blocks: [
        list(
          'Les annonces sont publiées à titre informatif et sous réserve de disponibilité : un véhicule peut être vendu entre-temps.',
          'Les prix sont indiqués en euros toutes taxes comprises (TTC), sauf mention « HT ». Ils peuvent être modifiés à tout moment ; le prix applicable est celui indiqué sur le bon de commande.',
          'Les photos, vidéos et caractéristiques sont fournies avec le plus grand soin mais ne sont pas contractuelles. Seuls le bon de commande et les documents du véhicule font foi.',
          'L’envoi d’un formulaire n’est ni une commande ni une réservation. La vente n’est formée qu’à la signature d’un bon de commande avec ' + L.name + ', et une réservation n’est confirmée que par écrit.'
        ),
      ],
    },
    {
      id: 'simulateur',
      title: '4. Simulateur de dédouanement et export',
      blocks: [
        p('Le simulateur de dédouanement fournit une estimation indicative, à partir de taux et de règles publics susceptibles d’évoluer. Il ne constitue ni un conseil fiscal ou douanier, ni un engagement sur le montant réellement dû : seuls les services des douanes algériennes déterminent les droits et taxes exigibles.'),
        p('Nous vous accompagnons dans les démarches d’export, mais il appartient à l’acheteur de vérifier que le véhicule et sa situation personnelle remplissent les conditions d’importation en vigueur dans le pays de destination.'),
      ],
    },
    {
      id: 'utilisation',
      title: '5. Utilisation des formulaires',
      blocks: [p('Vous vous engagez à fournir des informations exactes et à ne transmettre aucun contenu illicite, injurieux ou portant atteinte aux droits de tiers. Nous nous réservons le droit de ne pas donner suite aux demandes abusives ou automatisées.')],
    },
    {
      id: 'propriete',
      title: '6. Propriété intellectuelle',
      blocks: [p(`Les textes, logos, marques, photos, vidéos et éléments graphiques du site sont la propriété de ${L.name} ou de ses partenaires, ou utilisés sous licence. Toute reproduction sans autorisation écrite est interdite. Les médias sous licence Creative Commons sont crédités dans les [mentions légales](/mentions-legales) et restent soumis à leur licence.`)],
    },
    {
      id: 'liens',
      title: '7. Liens externes',
      blocks: [p('Le site contient des liens vers des services tiers (WhatsApp, réseaux sociaux, cartes). Nous n’exerçons aucun contrôle sur ces services et ne sommes pas responsables de leur contenu ni de leurs pratiques.')],
    },
    {
      id: 'responsabilite',
      title: '8. Responsabilité',
      blocks: [p(`${L.name} ne saurait être tenue responsable des dommages indirects liés à l’utilisation du site, d’une indisponibilité temporaire, ni d’une décision prise sur la seule base d’une information indicative (annonce, simulation). Rien dans ces CGU ne limite les droits dont vous disposez en tant que consommateur.`)],
    },
    {
      id: 'donnees',
      title: '9. Données personnelles',
      blocks: [p('Le traitement de vos données est décrit dans notre [politique de confidentialité](/confidentialite) et notre [politique de cookies](/cookies).')],
    },
    {
      id: 'litiges',
      title: '10. Réclamations, médiation et droit applicable',
      blocks: [
        p(`Pour toute réclamation, contactez-nous ${contactFr} : nous cherchons toujours une solution amiable.`),
        ...(mediator.name
          ? [
              p(
                `Conformément aux articles L611-1 et suivants du Code de la consommation, si votre réclamation écrite n’a pas abouti, vous pouvez recourir gratuitement au médiateur de la consommation : ${mediator.name}${mediator.address ? `, ${mediator.address}` : ''}${mediator.url ? ` ([${mediator.url.replace(/^https?:\/\//, '')}](${mediator.url}))` : ''}.`
              ),
            ]
          : []),
        p('Les présentes CGU sont soumises au droit français. En cas de litige, et à défaut d’accord amiable, les tribunaux compétents sont ceux désignés par la loi ; entre professionnels, compétence est attribuée aux tribunaux du ressort de Pontoise.'),
      ],
    },
    {
      id: 'modification',
      title: '11. Modification des CGU',
      blocks: [p('Nous pouvons modifier ces CGU à tout moment. La version applicable est celle en ligne lors de votre visite.')],
    },
  ],
};

const cookiesFr: LegalDoc = {
  title: 'Politique de cookies',
  metaDescription: `Cookies et traceurs utilisés sur le site ${SITE.name} : aucun cookie publicitaire ni de mesure d’audience, contenus externes soumis à votre accord.`,
  intro: 'Un cookie (ou traceur) est une petite information enregistrée dans votre navigateur. Nous en utilisons le moins possible : aucun cookie publicitaire, aucun outil de mesure d’audience, aucun profilage.',
  sections: [
    {
      id: 'necessaires',
      title: '1. Traceurs strictement nécessaires',
      blocks: [
        p('Ces traceurs sont indispensables au fonctionnement du site ou à la mémorisation de vos choix. Ils sont exemptés de consentement (article 82 de la loi Informatique et Libertés).'),
        {
          type: 'table',
          head: ['Nom', 'Rôle', 'Durée'],
          rows: [
            ['NEXT_LOCALE (cookie)', 'Mémorise la langue choisie (français ou arabe)', 'Session du navigateur'],
            ['skh-consent-v1 (stockage local)', 'Mémorise votre choix concernant les contenus externes', `${SITE.consentMaxAgeMonths} mois`],
            ['sb-… (cookies)', 'Connexion de notre équipe à l’espace d’administration, jamais déposés pour les visiteurs', 'Session de connexion'],
          ],
        },
      ],
    },
    {
      id: 'externes',
      title: '2. Contenus externes (soumis à votre accord)',
      blocks: [
        p('Certaines pages proposent des contenus hébergés par des tiers. Ils ne sont chargés qu’après votre accord : tant que vous ne les avez pas autorisés, un encadré les remplace et aucune donnée n’est transmise à ces services.'),
        {
          type: 'table',
          head: ['Service', 'Où', 'Données'],
          rows: [
            ['OpenStreetMap (OpenStreetMap Foundation, Royaume-Uni)', 'Carte de la page Contact', 'Adresse IP, données techniques du navigateur'],
            ['YouTube, en mode confidentialité renforcée (Google Ireland Ltd)', 'Vidéos de certaines fiches véhicules', 'Adresse IP, traceurs déposés par YouTube lors de la lecture'],
          ],
        },
        p('Consultez les politiques de ces services : [OpenStreetMap](https://osmfoundation.org/wiki/Privacy_Policy) et [Google](https://policies.google.com/privacy).'),
      ],
    },
    {
      id: 'gerer',
      title: '3. Gérer vos choix',
      blocks: [
        p(`Vous pouvez accepter ou refuser les contenus externes, puis changer d’avis à tout moment grâce au bouton ci-dessous ou au lien « Gérer les cookies » en bas de chaque page. Votre choix est conservé ${SITE.consentMaxAgeMonths} mois, puis vous est redemandé. Vous pouvez aussi supprimer les cookies depuis les réglages de votre navigateur.`),
      ],
    },
    {
      id: 'plus',
      title: '4. En savoir plus',
      blocks: [p('Pour en savoir plus sur vos données, consultez notre [politique de confidentialité](/confidentialite) ou le site de la CNIL ([www.cnil.fr](https://www.cnil.fr/fr/cookies-et-autres-traceurs)).')],
    },
  ],
};

// ─────────────────────────────── AR ───────────────────────────────

const arNotice = p('هذه ترجمة للتسهيل؛ وفي حال وجود أي اختلاف، تكون النسخة الفرنسية هي المرجع.');

const privacyAr: LegalDoc = {
  title: 'سياسة الخصوصية',
  metaDescription: `كيف تجمع ${SITE.name} بياناتكم الشخصية وتستخدمها وتحميها (RGPD): الأغراض، مدة الحفظ، الجهات المتلقية والحقوق.`,
  intro: `تولي ${L.name} أهمية كبيرة لحماية بياناتكم الشخصية. توضح هذه السياسة البيانات التي نجمعها عبر الموقع، وأسباب جمعها، ومدة حفظها، وكيفية ممارسة حقوقكم، وفقاً للنظام الأوروبي العام لحماية البيانات (RGPD) والقانون الفرنسي للمعلوماتية والحريات.`,
  sections: [
    {
      id: 'responsable',
      title: '1. المسؤول عن المعالجة',
      blocks: [
        arNotice,
        p(`المسؤول عن المعالجة هو ${L.name}، شركة ${L.legalForm} مسجلة في ${L.rcs}، ومقرها ${address}.`),
        p(`يمكنكم التواصل معنا ${contactAr}. نظراً لطبيعة نشاطها، لم تعيّن ${L.name} مندوباً لحماية البيانات.`),
      ],
    },
    {
      id: 'donnees',
      title: '2. البيانات التي نجمعها',
      blocks: [
        p('نجمع فقط البيانات الضرورية لمعالجة طلبكم:'),
        list(
          'نماذج الاتصال أو طلب سيارة أو البحث: الاسم، رقم الهاتف، البريد الإلكتروني (اختياري)، الرسالة (اختيارية)، لغة الموقع، والسيارة المعنية عند الاقتضاء.',
          'طلب عرض من محاكي الجمركة: إضافةً إلى ما سبق، معطيات المحاكاة (النظام، الوقود، عمر السيارة وسعة المحرك، السعر، مصاريف الشحن والتأمين، صفة الطالب لنظام CCR، المبلغ التقديري).',
          'السجلات التقنية لدى مزوّد الاستضافة: عنوان IP، التاريخ والوقت، الصفحة المطلوبة ونوع المتصفح، وتُستخدم فقط لأمن الموقع وحسن سيره.'
        ),
        p('لا يتطلب الموقع إنشاء أي حساب للزوار، ولا يستخدم أي أداة لقياس الجمهور أو الإعلان أو التنميط. نرجو عدم إرسال بيانات حساسة أو نسخ من وثائق الهوية في رسائلكم: سنطلبها عند الحاجة وقت البيع.'),
      ],
    },
    {
      id: 'finalites',
      title: '3. الأغراض والأسس القانونية',
      blocks: [
        {
          type: 'table',
          head: ['الغرض', 'الأساس القانوني (المادة 6 من RGPD)'],
          rows: [
            ['الرد على طلبكم، معاودة الاتصال بكم، إعداد عرض سعر', 'إجراءات سابقة للتعاقد بناءً على طلبكم (6.1.b)'],
            ['متابعة مراسلاتنا التجارية وتحسين خدمتنا', 'المصلحة المشروعة في إدارة علاقتنا بالعملاء (6.1.f)'],
            ['أمن الموقع ومكافحة الرسائل المزعجة والتجاوزات', 'المصلحة المشروعة (6.1.f)'],
            ['عرض المحتويات الخارجية (الخريطة، الفيديوهات)', 'موافقتكم (6.1.a)'],
            ['الفوترة والمحاسبة إذا أصبحتم عملاء', 'التزام قانوني (6.1.c)'],
          ],
        },
      ],
    },
    {
      id: 'destinataires',
      title: '4. الجهات المتلقية',
      blocks: [
        p(`بياناتكم مخصصة للموظفين المؤهلين في ${L.name} فقط، ولا تُباع ولا تُؤجَّر ولا تُمنح لأطراف ثالثة لأغراض تجارية. نستعين بالمتعاقدين التقنيين التاليين، المرتبطين باتفاقية لمعالجة البيانات:`),
        list(
          `${SITE.hosting.name} (${SITE.hosting.url}) — استضافة الموقع؛`,
          `${SITE.dataHost.name} (${SITE.dataHost.url}) — قاعدة البيانات، المستضافة داخل الاتحاد الأوروبي (إيرلندا).`
        ),
        p('إذا اخترتم مراسلتنا عبر واتساب أو شبكاتنا الاجتماعية، فإن هذه المنصات تعالج أيضاً البيانات المتبادلة وفق سياسات الخصوصية الخاصة بها.'),
      ],
    },
    {
      id: 'transferts',
      title: '5. النقل خارج الاتحاد الأوروبي',
      blocks: [p(`تُخزَّن طلباتكم داخل الاتحاد الأوروبي، غير أن مزوّدَينا ${SITE.hosting.name} (الولايات المتحدة) و${SITE.dataHost.name} (سنغافورة) قد يطّلعان عليها لأغراض الخدمة. ويخضع هذا النقل للبنود التعاقدية النموذجية للمفوضية الأوروبية، وعند الاقتضاء لإطار خصوصية البيانات بين الاتحاد الأوروبي والولايات المتحدة.`)],
    },
    {
      id: 'conservation',
      title: '6. مدة الحفظ',
      blocks: [
        list(
          `الطلبات المرسلة عبر الموقع: ${years} سنوات من تاريخ إرسالها، ثم تُحذف تلقائياً.`,
          'بيانات العملاء: طوال مدة العلاقة التجارية، ثم تُؤرشف خلال المدد القانونية (10 سنوات للوثائق المحاسبية).',
          'السجلات التقنية: 12 شهراً كحد أقصى.',
          `اختياركم بشأن ملفات تعريف الارتباط: ${SITE.consentMaxAgeMonths} أشهر.`
        ),
      ],
    },
    {
      id: 'droits',
      title: '7. حقوقكم',
      blocks: [
        p('لكم الحق في الاطلاع على بياناتكم وتصحيحها ومحوها وتقييد معالجتها ونقلها، والحق في الاعتراض على المعالجة القائمة على مصلحتنا المشروعة، والحق في سحب موافقتكم في أي وقت، والحق في تحديد توجيهات بشأن مصير بياناتكم بعد الوفاة.'),
        p(`لممارسة هذه الحقوق، تواصلوا معنا ${contactAr}. نرد خلال شهر واحد، وقد نطلب إثباتاً للهوية في حال وجود شك معقول.`),
        p('إذا رأيتم أن حقوقكم لم تُحترم، يمكنكم تقديم شكوى إلى اللجنة الوطنية للمعلوماتية والحريات CNIL، ‏3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 ‏([www.cnil.fr](https://www.cnil.fr/fr/plaintes)).'),
        p('إذا كنتم لا ترغبون في تلقي اتصالات تسويقية هاتفية، يمكنكم التسجيل مجاناً في قائمة الاعتراض Bloctel ‏([www.bloctel.gouv.fr](https://www.bloctel.gouv.fr)).'),
      ],
    },
    {
      id: 'securite',
      title: '8. الأمان',
      blocks: [p('يُقدَّم الموقع حصرياً عبر HTTPS. الاطلاع على الطلبات مقتصر على أعضاء فريقنا بعد تسجيل الدخول، وتطبّق قاعدة البيانات مراقبة للوصول تمنع أي زائر من قراءة طلبات الآخرين.')],
    },
    {
      id: 'cookies',
      title: '9. ملفات تعريف الارتباط',
      blocks: [p('يُفصَّل استخدام ملفات تعريف الارتباط وأدوات التتبع الأخرى في [سياسة ملفات تعريف الارتباط](/cookies).')],
    },
    {
      id: 'modifications',
      title: '10. التعديلات',
      blocks: [p('قد نُحدّث هذه السياسة، لا سيما عند تغيّر القانون أو إضافة خدمة جديدة. يظهر تاريخ آخر تحديث أعلى هذه الصفحة.')],
    },
  ],
};

const termsAr: LegalDoc = {
  title: 'شروط الاستخدام العامة',
  metaDescription: `شروط استخدام موقع ${SITE.name}: إعلانات السيارات، محاكي الجمركة، المسؤولية والملكية الفكرية.`,
  intro: `تنظّم شروط الاستخدام العامة هذه الدخول إلى الموقع الذي تنشره ${L.name} واستخدامه. بتصفحكم الموقع، فإنكم توافقون على هذه الشروط.`,
  sections: [
    {
      id: 'editeur',
      title: '1. الناشر',
      blocks: [
        arNotice,
        p(`ينشر الموقعَ ${L.name}، شركة ${L.legalForm} مسجلة في ${L.rcs}، ${address}. تجدون جميع المعلومات القانونية في [الإشعارات القانونية](/mentions-legales).`),
      ],
    },
    {
      id: 'acces',
      title: '2. الدخول إلى الموقع',
      blocks: [p('الدخول إلى الموقع مجاني ولا يتطلب التسجيل. نسعى إلى إبقائه متاحاً دون أن نضمن ذلك: قد يتوقف للصيانة أو التحديث أو لأسباب تقنية، دون أن يترتب على ذلك أي تعويض.')],
    },
    {
      id: 'vehicules',
      title: '3. إعلانات السيارات',
      blocks: [
        list(
          'تُنشر الإعلانات على سبيل الإعلام ورهناً بالتوفر: قد تُباع السيارة في الأثناء.',
          'الأسعار معروضة باليورو شاملة جميع الضرائب، إلا إذا ذُكر «HT». قد تتغير في أي وقت، والسعر المعتمد هو المذكور في طلب الشراء.',
          'الصور والفيديوهات والمواصفات مقدَّمة بعناية لكنها غير تعاقدية. وحدهما طلب الشراء ووثائق السيارة يُعتدّ بهما.',
          `إرسال نموذج لا يُعدّ طلب شراء ولا حجزاً. لا ينعقد البيع إلا بتوقيع طلب شراء مع ${L.name}، ولا يُؤكَّد الحجز إلا كتابياً.`
        ),
      ],
    },
    {
      id: 'simulateur',
      title: '4. محاكي الجمركة والتصدير',
      blocks: [
        p('يقدّم محاكي الجمركة تقديراً إرشادياً مبنياً على نسب وقواعد عامة قابلة للتغيير. وهو ليس استشارة جبائية أو جمركية ولا التزاماً بالمبلغ المستحق فعلياً: مصالح الجمارك الجزائرية وحدها تحدد الحقوق والرسوم الواجبة.'),
        p('نرافقكم في إجراءات التصدير، لكن على المشتري التأكد من أن السيارة ووضعيته الشخصية يستوفيان شروط الاستيراد السارية في بلد الوجهة.'),
      ],
    },
    {
      id: 'utilisation',
      title: '5. استخدام النماذج',
      blocks: [p('تلتزمون بتقديم معلومات صحيحة وعدم إرسال أي محتوى غير قانوني أو مسيء أو ماسّ بحقوق الغير. نحتفظ بحق عدم الرد على الطلبات التعسفية أو الآلية.')],
    },
    {
      id: 'propriete',
      title: '6. الملكية الفكرية',
      blocks: [p(`النصوص والشعارات والعلامات والصور والفيديوهات والعناصر الرسومية في الموقع مملوكة لـ${L.name} أو لشركائها، أو مستخدمة بموجب ترخيص. يُمنع أي نسخ دون إذن كتابي. الوسائط المرخصة بموجب Creative Commons مذكورة في [الإشعارات القانونية](/mentions-legales) وتبقى خاضعة لترخيصها.`)],
    },
    {
      id: 'liens',
      title: '7. الروابط الخارجية',
      blocks: [p('يحتوي الموقع على روابط لخدمات خارجية (واتساب، الشبكات الاجتماعية، الخرائط). لا نتحكم في هذه الخدمات ولسنا مسؤولين عن محتواها أو ممارساتها.')],
    },
    {
      id: 'responsabilite',
      title: '8. المسؤولية',
      blocks: [p(`لا تتحمل ${L.name} مسؤولية الأضرار غير المباشرة المرتبطة باستخدام الموقع أو بتوقفه المؤقت، ولا عن قرار اتُّخذ بناءً على معلومة إرشادية فقط (إعلان، محاكاة). لا يحدّ أي بند من هذه الشروط من حقوقكم بصفتكم مستهلكين.`)],
    },
    {
      id: 'donnees',
      title: '9. البيانات الشخصية',
      blocks: [p('تُوصف معالجة بياناتكم في [سياسة الخصوصية](/confidentialite) و[سياسة ملفات تعريف الارتباط](/cookies).')],
    },
    {
      id: 'litiges',
      title: '10. الشكاوى والوساطة والقانون المطبق',
      blocks: [
        p(`لأي شكوى، تواصلوا معنا ${contactAr}: نسعى دائماً إلى حل ودي.`),
        ...(mediator.name
          ? [
              p(
                `وفقاً للمواد L611-1 وما يليها من قانون الاستهلاك الفرنسي، إذا لم تُفضِ شكواكم الكتابية إلى حل، يمكنكم اللجوء مجاناً إلى وسيط الاستهلاك: ${mediator.name}${mediator.address ? `، ${mediator.address}` : ''}${mediator.url ? ` ([${mediator.url.replace(/^https?:\/\//, '')}](${mediator.url}))` : ''}.`
              ),
            ]
          : []),
        p('تخضع هذه الشروط للقانون الفرنسي. في حال النزاع، وعند تعذّر الحل الودي، تكون المحاكم المختصة هي التي يحددها القانون؛ وبين المهنيين، يعود الاختصاص لمحاكم دائرة Pontoise.'),
      ],
    },
    {
      id: 'modification',
      title: '11. تعديل الشروط',
      blocks: [p('يمكننا تعديل هذه الشروط في أي وقت. النسخة السارية هي المنشورة على الموقع وقت زيارتكم.')],
    },
  ],
};

const cookiesAr: LegalDoc = {
  title: 'سياسة ملفات تعريف الارتباط',
  metaDescription: `ملفات تعريف الارتباط وأدوات التتبع في موقع ${SITE.name}: لا إعلانات ولا قياس للجمهور، والمحتويات الخارجية رهن موافقتكم.`,
  intro: 'ملف تعريف الارتباط (كوكي) أو أداة التتبع هو معلومة صغيرة تُحفظ في متصفحكم. نستخدم أقل قدر ممكن منها: لا كوكيز إعلانية، ولا أدوات لقياس الجمهور، ولا تنميط.',
  sections: [
    {
      id: 'necessaires',
      title: '1. أدوات التتبع الضرورية',
      blocks: [
        arNotice,
        p('هذه الأدوات ضرورية لعمل الموقع أو لحفظ اختياراتكم، وهي معفاة من الموافقة (المادة 82 من القانون الفرنسي للمعلوماتية والحريات).'),
        {
          type: 'table',
          head: ['الاسم', 'الدور', 'المدة'],
          rows: [
            ['NEXT_LOCALE (كوكي)', 'حفظ اللغة المختارة (الفرنسية أو العربية)', 'مدة جلسة المتصفح'],
            ['skh-consent-v1 (تخزين محلي)', 'حفظ اختياركم بشأن المحتويات الخارجية', `${SITE.consentMaxAgeMonths} أشهر`],
            ['sb-… (كوكيز)', 'تسجيل دخول فريقنا إلى لوحة الإدارة، ولا تُوضع أبداً للزوار', 'مدة جلسة الدخول'],
          ],
        },
      ],
    },
    {
      id: 'externes',
      title: '2. المحتويات الخارجية (رهن موافقتكم)',
      blocks: [
        p('تعرض بعض الصفحات محتويات مستضافة لدى أطراف ثالثة، ولا تُحمَّل إلا بعد موافقتكم: ما لم توافقوا، يحلّ محلها إطار بديل ولا تُرسل أي بيانات إلى هذه الخدمات.'),
        {
          type: 'table',
          head: ['الخدمة', 'المكان', 'البيانات'],
          rows: [
            ['OpenStreetMap (مؤسسة OpenStreetMap، المملكة المتحدة)', 'خريطة صفحة الاتصال', 'عنوان IP، بيانات المتصفح التقنية'],
            ['YouTube بوضع الخصوصية المعزّزة (Google Ireland Ltd)', 'فيديوهات بعض صفحات السيارات', 'عنوان IP، أدوات تتبع يضعها YouTube عند التشغيل'],
          ],
        },
        p('راجعوا سياسات هذه الخدمات: [OpenStreetMap](https://osmfoundation.org/wiki/Privacy_Policy) و[Google](https://policies.google.com/privacy).'),
      ],
    },
    {
      id: 'gerer',
      title: '3. إدارة اختياراتكم',
      blocks: [p(`يمكنكم قبول المحتويات الخارجية أو رفضها، ثم تغيير رأيكم في أي وقت عبر الزر أدناه أو رابط «إدارة ملفات تعريف الارتباط» أسفل كل صفحة. يُحفظ اختياركم ${SITE.consentMaxAgeMonths} أشهر ثم يُطلب منكم مجدداً. يمكنكم أيضاً حذف الكوكيز من إعدادات متصفحكم.`)],
    },
    {
      id: 'plus',
      title: '4. لمعرفة المزيد',
      blocks: [p('لمعرفة المزيد عن بياناتكم، راجعوا [سياسة الخصوصية](/confidentialite) أو موقع CNIL ‏([www.cnil.fr](https://www.cnil.fr/fr/cookies-et-autres-traceurs)).')],
    },
  ],
};

const DOCS: Record<'fr' | 'ar', Record<LegalDocKey, LegalDoc>> = {
  fr: { privacy: privacyFr, terms: termsFr, cookies: cookiesFr },
  ar: { privacy: privacyAr, terms: termsAr, cookies: cookiesAr },
};

export function getLegalDoc(locale: string, key: LegalDocKey): LegalDoc {
  return DOCS[locale === 'ar' ? 'ar' : 'fr'][key];
}

export const LEGAL_PATHS: Record<LegalDocKey, string> = {
  privacy: '/confidentialite',
  terms: '/conditions-utilisation',
  cookies: '/cookies',
};
