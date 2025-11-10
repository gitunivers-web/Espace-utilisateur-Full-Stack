# 🏦 Lendia Group - Plateforme de Prêt en Ligne

Plateforme de financement complète pour particuliers et professionnels, avec simulation de prêts en ligne et espace client sécurisé.

## 🚀 Démarrage Rapide

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer la base de données
```bash
# Synchroniser le schéma de la base de données
npm run db:push

# Restaurer les 10 types de prêts
npm run reset-db
```

### 3. Lancer l'application
```bash
npm run dev
```

L'application sera accessible sur **http://localhost:5000**

## 🔄 Restaurer les Données Après un Git Pull

**C'est normal que les données disparaissent après un `git pull` !**

Les données (types de prêts, utilisateurs, etc.) sont dans la **base de données PostgreSQL**, pas dans Git.

### ⚡ Solution en 1 commande :
```bash
npm run reset-db
```

Ce script restaure automatiquement :
- ✅ 10 types de prêts (3 pour particuliers, 7 pour professionnels)
- ✅ Toutes les données de démonstration

## 📊 Structure du Projet

```
lendia/
├── client/              # Frontend React + Vite
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── pages/       # Pages de l'application
│   │   ├── lib/         # Utilitaires et API client
│   │   └── hooks/       # Custom React hooks
├── server/              # Backend Express
│   ├── routes.ts        # API endpoints
│   ├── storage.ts       # Accès aux données
│   ├── auth.ts          # Authentification
│   └── db.ts            # Configuration Drizzle
├── shared/
│   └── schema.ts        # Schéma de base de données
└── scripts/
    └── reset-database.ts # Script de réinitialisation
```

## 🗄️ Base de Données

### Schéma
- **users** - Utilisateurs de la plateforme
- **accounts** - Comptes bancaires
- **cards** - Cartes de paiement
- **loans** - Prêts actifs
- **transactions** - Historique des opérations
- **loan_types** - Catalogue de produits de prêt (10 types)
- **loan_applications** - Demandes de prêts
- **loan_simulations** - Simulations effectuées

### Commandes Utiles

```bash
# Synchroniser le schéma (après modification de shared/schema.ts)
npm run db:push

# Restaurer les données de démonstration
npm run reset-db

# Vérifier les types TypeScript
npm run check
```

## 🎯 Fonctionnalités

### Site Public
- 🏠 Page d'accueil avec simulateur intégré
- 💳 Catalogue de 10 offres de prêts
- 🧮 Simulateur de prêt interactif
- 📄 Pages institutionnelles (À propos, Contact, etc.)

### Espace Client ("Mon Espace")
- 📊 Dashboard avec vue d'ensemble
- 📝 Gestion des demandes de prêts
- 💰 Suivi des comptes et cartes
- 💸 Transferts entre comptes
- 📈 Historique des transactions
- ⚙️ Paramètres du compte

## 🔐 Authentification

Le système utilise Passport.js avec sessions pour l'authentification.

Utilisateur de test :
- Email : `sophie.martin@lendia.fr`
- Mot de passe : `Sophie123!`

## 🛠️ Technologies

- **Frontend** : React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend** : Express.js, TypeScript
- **Base de données** : PostgreSQL avec Drizzle ORM
- **État** : React Query (serveur), Zustand (local)
- **Authentification** : Passport.js
- **Validation** : Zod

## 📝 Scripts Disponibles

```bash
npm run dev          # Démarre le serveur de développement
npm run build        # Build frontend + backend pour production
npm run build:client # Build frontend seulement (pour Vercel)
npm run start        # Démarre le serveur de production
npm run check        # Vérification TypeScript
npm run db:push      # Synchronise le schéma avec la DB
npm run reset-db     # Restaure les données de démonstration
```

## 🚨 Important : Code vs Données

### ✅ Sauvegardé dans Git
- Tout le code source
- Les composants et pages
- Le schéma de la base de données
- Les scripts de seed

### ❌ PAS dans Git (c'est normal !)
- Les données dans PostgreSQL
- Les fichiers `.env`
- Les `node_modules`
- Les fichiers de build (`dist/`)

**Après chaque `git pull`, exécutez `npm run reset-db` pour restaurer vos données !**

## 🌐 Déploiement

Pour déployer en production, consultez `DEPLOYMENT.md` qui contient :
- Guide complet pour Vercel (frontend)
- Configuration Render (backend + PostgreSQL)
- Variables d'environnement nécessaires
- Instructions de migration

## 📞 Support

Pour toute question sur le projet, consultez :
- `DEPLOYMENT.md` - Guide de déploiement
- `FICHIERS_MODIFIES.md` - Historique des modifications
- `replit.md` - Documentation technique détaillée

---

**Développé avec ❤️ pour Lendia Group**
