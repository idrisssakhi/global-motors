# SKH Global Motors

Site vitrine & catalogue de **SKH GLOBAL MOTORS** (SAS, SIREN 991 121 880, Argenteuil) :
vente de véhicules récents et premium en France et **export clé en main vers l’Algérie**.
Bilingue **français / arabe** (RTL), animations, vidéos, **simulateur de dédouanement Algérie**
et back-office.

## Stack

| Couche      | Techno                                                                 |
| ----------- | ---------------------------------------------------------------------- |
| Framework   | Next.js 16 (App Router, React 19, ISR, Server Actions)                 |
| Style       | Tailwind CSS v4 · Framer Motion · Lenis (smooth scroll) · Lucide       |
| i18n        | next-intl (FR à `/`, AR à `/ar`, RTL automatique)                      |
| Données     | Supabase (Postgres + RLS, Auth, Storage) — projet `global-motors`      |
| SEO         | JSON-LD (AutoDealer, Car, FAQ, Breadcrumb), sitemap, robots, hreflang  |

## Pages

| Route                         | Contenu                                                                          |
| ----------------------------- | -------------------------------------------------------------------------------- |
| `/`                           | Hero animé (voiture en fil doré, route, skyline Paris → Alger), marques, stock, vidéo scroll, route d’export animée, simulateur, FAQ, formulaire |
| `/voitures`, `/voitures/[slug]` | Stock filtrable · fiche véhicule (galerie, vidéo, estimation douane pré-remplie, demande) |
| `/simulateur-dedouanement`    | Simulateur complet + barème + demande d’offre                                    |
| `/a-propos`, `/contact`, `/mentions-legales` | Entreprise, formulaire + carte, mentions                          |
| `/admin`                      | Véhicules (CRUD + photos) · Demandes (leads) · Taux de dédouanement              |

## Démarrage

```bash
npm install
cp .env.example .env.local   # déjà présent en local
npm run dev                  # http://localhost:3000
```

Variables : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_HOSTNAME`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`.

### Supabase

Le schéma est versionné dans [`supabase/migrations/`](supabase/migrations/) et **déjà appliqué**
sur le projet `xnrzgkogakczrcbjnkje` (organisation Carveil).

```bash
npx supabase link --project-ref xnrzgkogakczrcbjnkje
npm run db:new ma_modif   # nouvelle migration
npm run db:push           # appliquer
```

Tables : `cars` (lecture publique, écriture admin), `leads` (insertion publique, lecture admin),
`customs_settings` (ligne unique, lecture publique, écriture admin), bucket `car-images`.

**Créer le compte admin** : Dashboard Supabase → Authentication → Users → *Add user*.

## Simulateur de dédouanement

Logique dans [`src/lib/customs.ts`](src/lib/customs.ts) :

1. Valeur en douane (CIF) = prix + fret + assurance, convertie en DA
2. Droit de douane (par défaut 15 % ≤ 1 500 cm³ et électrique, 30 % au-delà)
3. Contribution de solidarité 3 % · PRCT 2 % (sur CIF)
4. TVA 19 % sur CIF + D.D + C.S + PRCT
5. Abattement décret 23-74 (occasion < 3 ans) : 80 % électrique, 50 % ≤ 1 800 cm³, 20 % au-delà
6. Âge : si la douane évalue sur la cote (argus), la cote est prise hors TVA étrangère (×0,833) et dépréciée de 10 % par année après la première ; la valeur la plus élevée entre facture et cote est retenue
7. Régime CCR (retour définitif, LF 2026) : < 5 ans, ≤ 1 800 cm³, pas de diesel, sous plafond de valeur → exonération des droits et taxes ; restent droits de chancellerie et contrôle technique

Tous les taux (et le taux de change) se modifient dans **/admin/customs** sans redéploiement.
⚠️ Les valeurs par défaut proviennent de sources publiques (simulateurs, presse) : **à valider
avec un transitaire** avant mise en ligne.

## À compléter avant la mise en ligne

- `src/lib/site.ts` : téléphone, WhatsApp, e-mail, réseaux sociaux, URL du site.
- Mentions légales : coordonnées de l’hébergeur.
- Taux de change et taux douaniers dans l’admin.

## Crédits médias

- Vidéos : *2025 Monterey Ferrari F80* et *Aston Martin Valour* — VictorDoesCars, CC BY 4.0 (Wikimedia Commons).
