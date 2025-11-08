# Altus Finance Group - Projet Bancaire Professionnel

## Vue d'ensemble
Application bancaire complète pour comptes professionnels avec gestion de comptes, cartes, prêts, transferts, transactions et paramètres utilisateur.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui components + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Neon) avec Drizzle ORM
- **State Management**: React Query pour les données serveur, Zustand pour l'état local

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

### Améliorations futures recommandées
- Système d'authentification complet (login, sessions, JWT)
- Gestion d'erreurs plus détaillée sur toutes les pages
- Tests end-to-end
- Validation des formulaires avec Zod
- Pagination pour l'historique des transactions
- Notifications en temps réel
- Export PDF des relevés bancaires

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
