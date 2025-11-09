# Altus Finance Group - Plateforme de Prêt en Ligne

## Vue d'ensemble
Plateforme de financement en ligne complète pour particuliers et professionnels, offrant des prêts personnalisés avec simulation en ligne, demandes de prêt multi-étapes, et espace client sécurisé ("Mon Espace").

## Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui components + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Neon) avec Drizzle ORM
- **State Management**: React Query pour les données serveur
- **Routing**: Architecture dual-layout (Public vs Protected)

## Dernières modifications (9 nov 2024)

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

**6 types de prêts pré-configurés:**
- **Particuliers:** Prêt Personnel (500€-75k, 0.5%), Crédit Auto (5k-75k, 0.8%), Prêt Travaux (1k-75k, 0.6%)
- **Professionnels:** Prêt Professionnel (10k-500k, 1.2%), Crédit Trésorerie (5k-250k, 1.5%), Financement Équipement (10k-1M, 1.0%)

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

### Prochaines étapes
- [ ] Formulaire de demande de prêt multi-étapes (étape 1: type, étape 2: montant/durée, étape 3: infos personnelles, étape 4: documents)
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
```

## Variables d'environnement
- `DATABASE_URL` - URL de connexion PostgreSQL (fourni par Replit)

## Préférences utilisateur
- Style de code: TypeScript strict, composants fonctionnels React
- Framework UI: shadcn/ui avec Tailwind CSS
- Gestion d'état: React Query pour serveur, Zustand pour local
- Base de données: PostgreSQL avec Drizzle ORM (pas de Prisma)
