# Velt.re — Portfolio de Djebarlen Tambon

Portfolio personnel full-stack avec panneau d'administration CMS intégré et analytics maison.

## Stack technique

- **Frontend** : React 18, Vite, TailwindCSS v3, Framer Motion, Lenis
- **Backend/DB** : Supabase (PostgreSQL, Auth, Storage, RLS)
- **Requêtes** : Axios, TanStack Query v5
- **Icônes** : Lucide React
- **Charts** : Recharts
- **Déploiement** : Vercel

---

## Mise en route

### 1. Cloner et installer

```bash
git clone https://github.com/ton-user/velt-portfolio.git
cd velt-portfolio
npm install
```

### 2. Configurer Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Aller dans **SQL Editor** et coller tout le contenu du commentaire SQL dans `src/lib/supabase.js`
3. Exécuter le script — toutes les tables, policies et données initiales seront créées
4. Récupérer les clés dans **Project Settings > API**

### 3. Variables d'environnement

Créer `.env` à la racine (copier `.env.example`) :

```env
VITE_SUPABASE_URL=https://ton-projet.supabase.co
VITE_SUPABASE_ANON_KEY=ta-clé-anon
VITE_SITE_URL=https://velt.re
```

### 4. Créer le compte admin

Dans le **Dashboard Supabase > Authentication > Users** :
1. Cliquer **"Add user"**
2. Saisir ton email et un mot de passe fort
3. Ce compte sera utilisé pour accéder à `/admin`

### 5. Lancer en développement

```bash
npm run dev
```

Le site est disponible sur `http://localhost:5173`
L'admin est accessible sur `http://localhost:5173/admin`

---

## Structure du projet

```
velt-portfolio/
├── public/
│   ├── favicon.svg
│   ├── site.webmanifest
│   └── robots.txt
│
├── src/
│   ├── App.jsx                      # Router principal + lazy loading
│   ├── main.jsx                     # Entry point, providers
│   ├── index.css                    # Styles globaux + design tokens
│   │
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminLayout.jsx      # Sidebar + layout admin
│   │   │   ├── AdminPageHeader.jsx  # Header réutilisable
│   │   │   ├── ConfirmDialog.jsx    # Dialog de confirmation
│   │   │   ├── Modal.jsx            # Modal réutilisable
│   │   │   └── ProtectedRoute.jsx   # Guard de route auth
│   │   ├── layout/
│   │   │   ├── Navbar.jsx           # Navigation principale
│   │   │   └── Footer.jsx           # Pied de page
│   │   ├── sections/
│   │   │   ├── Hero.jsx             # Section Hero
│   │   │   ├── About.jsx            # À propos + timeline
│   │   │   ├── Projects.jsx         # Grille projets filtrée
│   │   │   ├── Skills.jsx           # Compétences animées
│   │   │   └── Contact.jsx          # Formulaire de contact
│   │   └── ui/
│   │       ├── CustomCursor.jsx     # Curseur magnétique
│   │       └── SmoothScroll.jsx     # Lenis smooth scroll
│   │
│   ├── context/
│   │   └── AuthContext.jsx          # Auth Supabase
│   │
│   ├── hooks/
│   │   ├── useContacts.js           # CRUD messages
│   │   ├── useExperiences.js        # CRUD expériences + skills
│   │   ├── useProjects.js           # CRUD projets
│   │   └── useSettings.js          # CMS settings
│   │
│   ├── lib/
│   │   ├── supabase.js              # Client Supabase + schéma SQL
│   │   └── axios.js                 # Instance Axios
│   │
│   ├── pages/
│   │   ├── Home.jsx                 # Page d'accueil
│   │   ├── ProjectDetail.jsx        # Page projet détaillée
│   │   ├── NotFound.jsx             # Page 404
│   │   └── admin/
│   │       ├── Login.jsx            # Connexion admin
│   │       ├── Dashboard.jsx        # Dashboard analytics
│   │       ├── Projects.jsx         # CRUD projets
│   │       ├── Experiences.jsx      # CRUD expériences
│   │       ├── Skills.jsx           # CRUD compétences
│   │       ├── Contacts.jsx         # Gestion messages
│   │       └── AdminSettings.jsx    # CMS paramètres
│   │
│   └── utils/
│       ├── analytics.js             # Tracking maison (sans GA)
│       └── cn.js                    # Helper classNames
│
├── .env                             # Variables locales (gitignore)
├── .env.example                     # Template à copier
├── index.html                       # HTML avec SEO complet
├── tailwind.config.js               # Tokens design émeraude
└── vite.config.js                   # Build optimisé
```

---

## Déploiement sur Vercel

### Via CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Via GitHub (recommandé)

1. Pusher le repo sur GitHub
2. Aller sur [vercel.com](https://vercel.com) > **New Project**
3. Importer le repo GitHub
4. Dans **Environment Variables**, ajouter :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SITE_URL`
5. Cliquer **Deploy**

### Configuration SPA (important)

Créer `vercel.json` à la racine pour gérer le routing React :

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

> Ce fichier est déjà présent dans le projet.

---

## Commandes utiles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Prévisualiser le build
```

---

## Personnalisation du contenu

Tout le contenu est modifiable depuis le panneau admin (`/admin`) :

| Section | Admin |
|---|---|
| Texte Hero & CTA | Paramètres > Hero |
| Biographie, localisation | Paramètres > À propos |
| Réseaux sociaux | Paramètres > Réseaux |
| SEO (titre, description) | Paramètres > SEO |
| Projets | Projets > CRUD |
| Expériences | Expériences > CRUD |
| Compétences | Compétences > CRUD |
| Messages reçus | Messages |

---

## Analytics maison

Le tracking est entièrement géré dans Supabase, sans Google Analytics :

- **Page views** : chemin, referrer, device, browser, durée
- **Sessions** : pages visitées, appareil, référent
- **Dashboard** : graphiques 14 jours, top pages, appareils

Données consultables dans le Dashboard admin ou directement dans Supabase Table Editor.

---

## Licence

Usage personnel — Djebarlen Tambon © 2026