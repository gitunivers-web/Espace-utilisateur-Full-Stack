# 🚀 Guide de Déploiement - Altus Finance

Ce guide vous explique comment déployer votre application sur Vercel (frontend) et Render (backend + PostgreSQL).

## 📋 Vue d'ensemble de l'architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Vercel        │─────▶│   Render        │─────▶│  PostgreSQL     │
│   (Frontend)    │      │   (Backend)     │      │  (Database)     │
│   React + Vite  │      │   Express API   │      │  Render         │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## 🎯 Partie 1 : Déploiement de la Base de Données sur Render

### Étape 1.1 : Créer une base PostgreSQL sur Render

1. Allez sur [Render.com](https://render.com) et connectez-vous
2. Cliquez sur **"New +"** → **"PostgreSQL"**
3. Configurez :
   - **Name** : `altus-finance-db`
   - **Region** : Choisissez la région la plus proche (Europe West recommended)
   - **PostgreSQL Version** : 16 (ou la plus récente)
   - **Plan** : Free (pour commencer)
4. Cliquez sur **"Create Database"**
5. ⚠️ **IMPORTANT** : Sauvegardez les informations de connexion :
   - **Internal Database URL** (pour le backend Render)
   - **External Database URL** (pour votre environnement local)

### Étape 1.2 : Initialiser la base de données

Une fois la base créée :

1. Dans le dashboard Render de votre base de données, cliquez sur **"Connect"**
2. Copiez la commande PSQL ou utilisez un client PostgreSQL
3. Exécutez ces commandes pour initialiser le schéma :

```bash
# Option 1 : Depuis votre machine locale (recommandé)
# Remplacez DATABASE_URL par votre External Database URL
DATABASE_URL="postgresql://..." npm run db:push

# Option 2 : Via le Web Shell de Render (dans le dashboard de la DB)
# Le schéma sera créé automatiquement au premier démarrage du backend
```

4. Seedez les types de prêts (après le déploiement du backend) :

```bash
# Depuis votre backend Render via le Shell
tsx server/seed-loan-types.ts
```

## 🎯 Partie 2 : Déploiement du Backend sur Render

### Étape 2.1 : Préparer le projet

Assurez-vous que votre `package.json` contient les bons scripts :

```json
{
  "scripts": {
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js"
  }
}
```

✅ Ces scripts sont déjà configurés dans votre projet.

### Étape 2.2 : Déployer le backend

1. Sur Render, cliquez sur **"New +"** → **"Web Service"**
2. Connectez votre dépôt Git (GitHub/GitLab)
3. Configurez :
   - **Name** : `altus-finance-api`
   - **Region** : Europe West (même région que la DB)
   - **Branch** : `main`
   - **Root Directory** : (laissez vide)
   - **Runtime** : `Node`
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm run start`
   - **Plan** : Free

4. **Variables d'environnement** (Section "Environment") :

```bash
DATABASE_URL=<Votre Internal Database URL depuis Render>
NODE_ENV=production
SESSION_SECRET=<Générez une clé secrète aléatoire>
```

Pour générer SESSION_SECRET :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. Cliquez sur **"Create Web Service"**

### Étape 2.3 : Vérifier le déploiement backend

1. Attendez que le build se termine (5-10 minutes)
2. Votre API sera disponible sur : `https://altus-finance-api.onrender.com`
3. Testez : `https://altus-finance-api.onrender.com/api/loan-types`
4. Si vous voyez les 10 types de prêts en JSON → ✅ Backend OK !

## 🎯 Partie 3 : Déploiement du Frontend sur Vercel

### Étape 3.1 : Préparer le projet pour Vercel

1. Créez un fichier `vercel.json` à la racine du projet :

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

2. Créez un fichier `.env.production` :

```bash
VITE_API_URL=https://altus-finance-api.onrender.com
```

### Étape 3.2 : Modifier le client pour utiliser l'API backend

Mettez à jour `client/src/lib/queryClient.ts` :

```typescript
// Détection automatique de l'URL de l'API
const API_URL = import.meta.env.VITE_API_URL || '';

// ... reste du code avec API_URL
```

### Étape 3.3 : Déployer sur Vercel

1. Allez sur [Vercel.com](https://vercel.com) et connectez-vous
2. Cliquez sur **"Add New..."** → **"Project"**
3. Importez votre dépôt Git
4. Configurez :
   - **Framework Preset** : Vite
   - **Root Directory** : `client`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`

5. **Variables d'environnement** :

```bash
VITE_API_URL=https://altus-finance-api.onrender.com
```

6. Cliquez sur **"Deploy"**

### Étape 3.4 : Configurer CORS sur le Backend

Pour permettre à Vercel d'accéder à votre API Render, ajoutez cette configuration dans `server/index.ts` :

```typescript
import cors from 'cors';

// Après les autres middleware
app.use(cors({
  origin: [
    'https://votre-app.vercel.app',
    'http://localhost:5173' // Pour le dev local
  ],
  credentials: true
}));
```

Et installez le package :
```bash
npm install cors @types/cors
```

⚠️ **IMPORTANT** : Redéployez le backend sur Render après cette modification.

## 🎯 Partie 4 : Configuration Finale

### 4.1 : Seed des données de production

Une fois le backend déployé :

1. Allez sur le dashboard Render de votre Web Service
2. Ouvrez le **"Shell"** (onglet Shell)
3. Exécutez :

```bash
tsx server/seed-loan-types.ts
```

Cela ajoutera les 10 types de prêts à votre base de données de production.

### 4.2 : Tester le déploiement complet

1. Ouvrez votre site Vercel : `https://votre-app.vercel.app`
2. Testez les fonctionnalités :
   - ✅ Page d'accueil avec simulateur
   - ✅ Page /offres avec les 10 types de prêts
   - ✅ Page /simulateur
   - ✅ Connexion/Inscription
   - ✅ Espace client

## 📊 Résumé des URLs

```
Frontend (Vercel)  : https://votre-app.vercel.app
Backend (Render)   : https://altus-finance-api.onrender.com
Database (Render)  : Internal connection (non-public)
```

## 🔧 Maintenance et Redéploiement

### Redéployer après des modifications

**Frontend** : Push sur Git → Vercel redéploie automatiquement ✨

**Backend** : Push sur Git → Render redéploie automatiquement ✨

### Réinitialiser les données de production

Si vous perdez les types de prêts en production :

```bash
# Via le Shell de Render (Web Service)
tsx server/seed-loan-types.ts
```

## ⚠️ Points d'attention

1. **Free Tier Render** : 
   - Le backend s'endort après 15 minutes d'inactivité
   - Premier chargement = ~30 secondes (cold start)
   - Considérez un plan payant pour la production

2. **Base de données Free** :
   - 90 jours d'expiration sur le plan gratuit
   - Exportez régulièrement vos données
   - Upgrade recommandé pour la production

3. **Variables d'environnement** :
   - Ne jamais commiter les .env dans Git ✅ Déjà dans .gitignore
   - Utilisez les interfaces Vercel/Render pour les gérer

4. **CORS** :
   - Configurez correctement les origines autorisées
   - Ne jamais utiliser `origin: '*'` en production

## 🚨 Résolution des problèmes

### Le frontend ne se connecte pas au backend

- Vérifiez `VITE_API_URL` dans Vercel
- Vérifiez CORS dans le backend
- Vérifiez les logs Render (onglet Logs)

### Les types de prêts n'apparaissent pas

- Exécutez le seed : `tsx server/seed-loan-types.ts` via Shell Render
- Vérifiez DATABASE_URL dans les variables d'environnement

### Erreur 500 sur le backend

- Vérifiez les logs Render (onglet Logs)
- Vérifiez que DATABASE_URL est correcte
- Vérifiez que SESSION_SECRET est défini

## 📞 Support

Pour toute question, consultez :
- [Documentation Render](https://render.com/docs)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Vite](https://vitejs.dev/guide/)

---

🎉 **Votre application Altus Finance est maintenant déployée en production !**
