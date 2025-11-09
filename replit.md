# Altus Finance Group - Plateforme de Prêt en Ligne

## Vue d'ensemble
Plateforme de financement en ligne complète pour particuliers et professionnels, offrant des prêts personnalisés avec simulation en ligne, demandes de prêt multi-étapes, et espace client sécurisé ("Mon Espace").

## Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui components + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Render) avec Drizzle ORM + driver `pg`
- **State Management**: React Query pour les données serveur
- **Routing**: Architecture dual-layout (Public vs Protected)

## Dernières modifications (9 nov 2024 - Système de Réinitialisation de Mot de Passe)

### Système de réinitialisation de mot de passe sécurisé
**Implémentation complète avec email via Resend API:**
- ✅ Table `password_reset_tokens` avec tokens hashés (bcrypt) pour sécurité maximale
- ✅ Tokens avec expiration automatique (1 heure)
- ✅ Envoi d'emails via Resend API (100 emails/jour gratuits)
- ✅ Pages frontend : `/forgot-password` et `/reset-password`
- ✅ Lien "Mot de passe oublié ?" sur la page de connexion
- ✅ Validation complète côté backend (vérification token, expiration, etc.)

**Architecture sécurisée:**
```typescript
// Tokens hashés avant stockage (server/routes.ts)
const token = randomBytes(32).toString("hex");
const hashedToken = await bcrypt.hash(token, 10);

// Vérification par comparaison bcrypt
const allTokens = await storage.getAllPasswordResetTokens();
for (const dbToken of allTokens) {
  const isValid = await bcrypt.compare(token, dbToken.token);
  // ...
}
```

**Fichiers créés/modifiés:**
- `server/email.ts` - Service d'envoi d'emails avec Resend
- `client/src/pages/forgot-password.tsx` - Page de demande de réinitialisation
- `client/src/pages/reset-password.tsx` - Page de nouveau mot de passe
- `shared/schema.ts` - Table passwordResetTokens ajoutée
- `server/storage.ts` - Méthodes CRUD pour tokens
- `server/routes.ts` - 3 endpoints: demande reset, vérification token, nouveau mot de passe

### Séparation des parcours d'inscription
**Deux pages d'inscription distinctes:**
- ✅ `/register` - Page de choix du type de compte (particulier ou professionnel)
- ✅ `/register/particulier` - Formulaire pour comptes individuels
- ✅ `/register/professionnel` - Formulaire pour comptes professionnels
- ✅ Navigation avec flèches de retour sur toutes les pages d'authentification

**Design UX:**
- Interface claire avec cartes cliquables pour choisir le type de compte
- Formulaires adaptés selon le type (champs entreprise pour professionnels)
- Cohérence visuelle avec le reste de l'application

**Fichiers créés:**
- `client/src/pages/register.tsx` - Page de choix
- `client/src/pages/register-particular.tsx` - Inscription particuliers
- `client/src/pages/register-professional.tsx` - Inscription professionnels

### Améliorations UX Mobile
- ✅ Boutons de retour (flèche) ajoutés sur login, register, forgot-password
- ✅ Design responsive pour tous les formulaires d'authentification

### Configuration Email (Resend)
**Variables d'environnement requises:**
- `RESEND_API_KEY` - Clé API Resend (déjà configurée)
- Plan gratuit: 100 emails/jour, 3000 emails/mois

**Template email:**
- Email professionnel avec logo Altus Finance Group
- Lien de réinitialisation sécurisé avec expiration 1h
- Instructions claires en français

## Dernières modifications (9 nov 2024 - Précédentes)

### Base de Données PostgreSQL sur Render (9 nov 2024)
**Migration importante depuis Replit Agent:**
- ✅ Configuration PostgreSQL sur Render avec driver `pg` (compatible production)
- ✅ Base de données peuplée avec **10 types de prêts réalistes** basés sur le marché français 2024-2025
- ✅ Endpoint d'administration: `POST /api/admin/seed-loan-types` pour réinitialisation
- ✅ Traductions i18n complètes pour tous les types de prêts (7 langues)

**Types de prêts créés (données réalistes):**
- **Particuliers (4):** 
  - Prêt Personnel (500€-75k, TAEG 0.9%)
  - Crédit Auto (1k-75k, TAEG 0.9%)
  - Crédit Moto (500€-50k, TAEG 1.99%)
  - Prêt Travaux (1k-100k, TAEG 1.49%)
- **Professionnels (6):**
  - Prêt Professionnel (10k-500k, TAEG 2.9%)
  - Financement Équipement (5k-1M, TAEG 2.5%)
  - Crédit Trésorerie (5k-250k, TAEG 3.5%)
  - Crédit Immobilier Pro (50k-5M, TAEG 2.7%)
  - Leasing Professionnel (10k-500k, TAEG 3.2%)
  - Affacturage (10k-1M, TAEG 1.8%)

**Configuration technique:**
```typescript
// server/db.ts - Configuration PostgreSQL
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
```

## Dernières modifications (9 nov 2024 - Précédentes)

### Migration vers Plateforme de Prêt en Ligne
Le projet a été transformé d'une application bancaire complète vers une plateforme de prêt en ligne spécialisée avec deux interfaces distinctes:

1. **Site Public** - Pages marketing et simulation
   - Page d'accueil avec hero section et simulateur intégré
   - Catalogue d'offres de prêts (particuliers et professionnels)
   - Simulateur de prêt autonome avec calculs en temps réel
   - Pages institutionnelles (À propos, Contact, Comment ça marche)
   
2. **Mon Espace** - Tableau de bord client protégé
   - Dashboard avec vue d'ensemble des demandes
   - Gestion des demandes de prêts
   - Historique et suivi
   - Paramètres de compte

### Architecture Frontend
**Dual-Layout Pattern:**
- `PublicLayout` - Navigation top-bar pour pages publiques (/, /offres, /simulateur, etc.)
- `ProtectedRouter` - Sidebar avec SidebarProvider pour /mon-espace/*
- Séparation claire des contextes publics vs authentifiés

**Routing:**
- Routes publiques: `/`, `/offres`, `/simulateur`, `/a-propos`, `/contact`
- Routes protégées: `/mon-espace`, `/mon-espace/prets`, `/mon-espace/comptes`, etc.
- Route d'authentification: `/auth/connexion`

### Schéma de Base de Données Étendu (shared/schema.ts)

**Nouvelles tables:**
- `loan_types` - Catalogue de produits de prêt (6 types: Personnel, Auto, Travaux, Professionnel, Trésorerie, Équipement)
- `loan_simulations` - Historique des simulations (montant, durée, mensualités calculées)
- `loan_applications` - Demandes de prêts avec validation discriminée (particulier vs professionnel)

**Améliorations de sécurité:**
- Foreign keys avec CASCADE/RESTRICT appropriés
- Enums PostgreSQL pour `applicant_type` et `status`
- Validation stricte avec Zod (discriminatedUnion pour formulaires conditionnels)
- Champs obligatoires vs optionnels selon le type de demandeur

### API Backend (server/routes.ts)

**Endpoints publics:**
- `GET /api/loan-types` - Liste des types de prêts disponibles
- `POST /api/loan-simulator` - Calcul de simulation de prêt
- `GET /api/loan-types/:id` - Détails d'un type de prêt

**Endpoints protégés:**
- `POST /api/loan-applications` - Création d'une demande de prêt
- `GET /api/loan-applications` - Liste des demandes utilisateur
- `PATCH /api/loan-applications/:id` - Mise à jour statut

### Composants Réutilisables (client/src/components/)

**Loan Components:**
- `LoanCard` - Carte d'affichage d'un produit de prêt
- `LoanSimulator` - Simulateur interactif avec sliders
- `PublicLayout` - Layout pour pages publiques avec navigation

**Features:**
- Loading states systématiques
- Gestion d'erreurs avec toasts
- Responsive design adaptatif
- Accessibility (data-testid sur éléments interactifs)

### Hooks React Query (client/src/lib/queries.ts)

**Nouveaux hooks:**
- `useLoanTypes()` - Récupère le catalogue de prêts
- `useLoanSimulation(params)` - Calcul de simulation
- `useCreateLoanApplication()` - Mutation pour soumettre une demande

**Hooks existants conservés:**
- `useAuth()`, `useUser()`, `useAccounts()`, `useCards()`, `useLoans()`, etc.

### Données de Démonstration

**10 types de prêts réalistes (marché français 2024-2025):**
- **Particuliers (4):** Prêt Personnel (500€-75k, 0.9%), Crédit Auto (1k-75k, 0.9%), Crédit Moto (500€-50k, 1.99%), Prêt Travaux (1k-100k, 1.49%)
- **Professionnels (6):** Prêt Pro (10k-500k, 2.9%), Financement Équipement (5k-1M, 2.5%), Crédit Trésorerie (5k-250k, 3.5%), Crédit Immo Pro (50k-5M, 2.7%), Leasing (10k-500k, 3.2%), Affacturage (10k-1M, 1.8%)

## Dernières modifications (8 nov 2024)

### Intégration Backend-Frontend Complète
Toutes les pages de l'application ont été connectées aux API backend pour afficher des données réelles:

1. **Dashboard** - Affiche soldes, cartes, prêts et statistiques depuis la base de données
2. **Comptes & Cartes** - Liste les comptes et cartes bancaires de l'utilisateur  
3. **Prêts** - Affiche les prêts actifs avec progression de remboursement
4. **Transferts** - Permet d'effectuer des virements entre comptes (intégration API POST)
5. **Historique** - Affiche toutes les transactions via TransactionTable
6. **Paramètres** - Affiche et permet de modifier les informations utilisateur

### Hooks React Query (client/src/lib/api.ts)
- `useUser()` - Récupère les informations utilisateur
- `useAccounts()` - Liste des comptes bancaires
- `useCards()` - Cartes de paiement
- `useLoans()` - Prêts actifs
- `useTransactions(accountId)` - Transactions d'un compte
- `useTransfer()` - Mutation pour effectuer un virement
- `useUpdateUser()` - Mutation pour mettre à jour le profil

### Base de données
Schéma complet dans `shared/schema.ts` avec tables:
- users (utilisateurs)
- accounts (comptes bancaires)
- cards (cartes de paiement)
- loans (prêts)
- transactions (historique des opérations)

Données de démonstration créées pour "Sophie Martin" (sophie.martin@altusfinance.fr) avec comptes, cartes, transactions et prêt.

### Fonctionnalités implémentées
✅ Navigation entre toutes les pages
✅ Affichage de données réelles depuis PostgreSQL
✅ États de chargement pour toutes les requêtes
✅ Déconnexion (sidebar + topbar)
✅ Thème clair/sombre
✅ Responsive design (mobile, tablette, desktop)
✅ Formulaire de transfert fonctionnel
✅ Mise à jour du profil utilisateur
✅ Recherche dans l'historique des transactions

### Dernières modifications (9 nov 2024 - Suite)

**Script de Réinitialisation Base de Données**
- Création de `scripts/reset-database.ts` - Script automatique de restauration
- Ajout de `npm run reset-db` - Commande pour restaurer les 10 types de prêts
- Documentation complète : `IMPORTANT_LIRE_APRES_GIT_PULL.md`
- README.md créé avec instructions de démarrage

**Préparation Déploiement**
- Configuration CORS pour production (server/index.ts)
- Support variables d'environnement (VITE_API_URL)
- Fichiers de configuration : vercel.json, .env.example
- Guide de déploiement complet : DEPLOYMENT.md

### Internationalisation (i18n) - 9 nov 2024

**Implémentation complète sur 7 langues:**
- 🇫🇷 Français (FR) - Langue par défaut
- 🇬🇧 English (EN)
- 🇵🇹 Português (PT)
- 🇪🇸 Español (ES)
- 🇮🇹 Italiano (IT)
- 🇭🇺 Magyar (HU)
- 🇵🇱 Polski (PL)

**Architecture i18n:**
- Bibliothèque: `i18next` + `react-i18next`
- Configuration: `client/src/i18n/index.ts`
- Fichiers de traduction: `client/src/i18n/locales/{lang}.json` (340-350 clés par langue)
- Détection de langue: localStorage + navigateur
- Hook principal: `useTranslation()` pour accéder aux traductions dans les composants

**Organisation des traductions:**
```
{
  "app": { "name": "..." },
  "nav": { "home", "offers", "simulator", ... },
  "home": { "hero", "solutions", "professional", "whyUs" },
  "simulator": { "title", "loanType", "amount", ... },
  "loanApplication": { "step", "stepLoanType", "stepSimulation", ... },
  "legal": { "warning", "representativeExample", ... },
  "employmentStatus": { "cdi", "cdd", "freelance", ... },
  "loanStatus": { "pending", "under_review", "approved", ... }
}
```

**Composants traduits:**
- ✅ `home.tsx` - Page d'accueil avec hero et sections
- ✅ `LoanCard` - Cartes de produits de prêt
- ✅ `LoanSimulator` - Simulateur interactif
- ✅ `Stepper` - Barre de progression multi-étapes
- ✅ `StepLoanType` - Sélection du type de prêt
- ✅ `StepSimulation` - Simulation financière
- ✅ `StepConfirmation` - Confirmation de la demande
- ✅ `LegalNotice` - Mentions légales

**Validation architecte:**
- Toutes les chaînes codées en dur converties vers i18n
- Hiérarchie de clés bien organisée avec espaces de noms
- Traductions complètes et cohérentes sur les 7 langues
- Aucun littéral français orphelin dans les composants traduits
- Hot reloading fonctionnel

**Recommandations futures:**
- [ ] Tests automatisés de changement de locale
- [ ] Descriptions de loanType localisées dans le backend (si nécessaire)
- [ ] Documenter le workflow de traduction pour futurs contributeurs

### Prochaines étapes
- [ ] Formulaire de demande de prêt multi-étapes
- [ ] Adapter dashboard "Mon Espace" pour afficher et gérer les demandes de prêts
- [ ] Configurer le thème professionnel (index.css) avec couleurs financières appropriées
- [ ] Tests end-to-end du parcours complet (simulation → demande → suivi)
- [ ] Système de documents/justificatifs (upload de fichiers)
- [ ] Notifications email pour changements de statut
- [ ] Export PDF des simulations et contrats

## Structure du projet
```
client/          # Application React frontend
├── src/
│   ├── components/  # Composants réutilisables
│   ├── pages/       # Pages de l'application
│   ├── lib/         # Utilitaires (api.ts, store.ts)
│   └── hooks/       # Custom hooks React
server/          # Backend Express
├── routes.ts    # Définition des endpoints API
├── storage.ts   # Logique d'accès aux données
└── db.ts        # Configuration Drizzle
shared/
└── schema.ts    # Schéma de base de données Drizzle
```

## Commandes
```bash
npm run dev       # Démarre frontend + backend en développement
npm run db:push   # Synchronise le schéma avec la base de données
npm run reset-db  # ⚡ Restaure les 10 types de prêts et données de démo
```

## ⚠️ Important : Code vs Données

**Après chaque `git pull`, exécutez : `npm run reset-db`**

Les données (types de prêts, utilisateurs, etc.) sont dans PostgreSQL, PAS dans Git.
Le script `reset-db` restaure automatiquement :
- ✅ 10 types de prêts (3 particuliers + 7 professionnels)
- ✅ Toutes les données de démonstration

📖 Consultez `IMPORTANT_LIRE_APRES_GIT_PULL.md` pour plus de détails.

## Variables d'environnement
- `DATABASE_URL` - URL de connexion PostgreSQL (fourni par Replit)

## Préférences utilisateur
- Style de code: TypeScript strict, composants fonctionnels React
- Framework UI: shadcn/ui avec Tailwind CSS
- Gestion d'état: React Query pour serveur, Zustand pour local
- Base de données: PostgreSQL avec Drizzle ORM (pas de Prisma)
