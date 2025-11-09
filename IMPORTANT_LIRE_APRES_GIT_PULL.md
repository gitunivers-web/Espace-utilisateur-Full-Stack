# ⚠️ IMPORTANT : À LIRE APRÈS CHAQUE GIT PULL

## 🔴 Pourquoi mes données (types de prêts) ont disparu ?

**C'est NORMAL !** Et voici pourquoi :

### 📦 Git sauvegarde le CODE, pas les DONNÉES

```
┌─────────────────────────────────────────────┐
│  CE QUI EST DANS GIT (✅ sauvegardé)       │
├─────────────────────────────────────────────┤
│  • Fichiers de code (.ts, .tsx, .css)      │
│  • Composants React                         │
│  • API Routes                               │
│  • Schéma de la base de données            │
│  • Script de seed (pour restaurer)         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  CE QUI N'EST PAS DANS GIT (❌ données)    │
├─────────────────────────────────────────────┤
│  • Les 10 types de prêts (dans PostgreSQL) │
│  • Les utilisateurs                         │
│  • Les comptes bancaires                    │
│  • Les transactions                         │
│  • Toutes les données en général           │
└─────────────────────────────────────────────┘
```

## ✅ Solution : 1 Commande pour Tout Restaurer

Après chaque `git pull`, exécutez simplement :

```bash
npm run reset-db
```

**C'est tout !** Vos 10 types de prêts seront restaurés en quelques secondes.

## 🎯 Processus Complet Recommandé

Chaque fois que vous rechargez le projet depuis Git :

```bash
# 1. Récupérer les dernières modifications
git pull

# 2. Installer les nouvelles dépendances (si nécessaire)
npm install

# 3. Synchroniser le schéma de la base de données
npm run db:push

# 4. Restaurer les données (types de prêts, etc.)
npm run reset-db

# 5. Lancer l'application
npm run dev
```

## 📋 Ce que le script `reset-db` fait

```
🔄 Réinitialisation de la base de données...

🗑️  Suppression des anciennes données...
   ✓ Types de prêts supprimés

📊 Insertion des types de prêts...
   ✓ Prêt Personnel
   ✓ Crédit Auto
   ✓ Prêt Travaux
   ✓ Crédit Immobilier Professionnel
   ✓ Prêt Création d'Entreprise
   ✓ Crédit Trésorerie Pro
   ✓ Financement Équipement
   ✓ Rachat de Fonds de Commerce
   ✓ Prêt Investissement PME
   ✓ Crédit-Bail Professionnel

✅ Base de données réinitialisée avec succès !
   📦 10 types de prêts restaurés
```

## 🤔 Pourquoi on ne met pas les données dans Git ?

1. **Taille** : Les bases de données peuvent contenir des millions d'enregistrements
2. **Sécurité** : Les données clients ne doivent jamais être dans Git
3. **Conflits** : Git n'est pas fait pour gérer des données qui changent constamment
4. **Séparation** : Le code (immuable) et les données (variables) doivent être séparés

## 💡 Astuce : Bookmark Cette Commande

Créez un alias ou mémorisez-la :

```bash
npm run reset-db
```

Vous l'utiliserez souvent au début, puis de moins en moins une fois que vous comprendrez le système.

## ❓ Questions Fréquentes

**Q : Est-ce que je perds mes données à chaque modification de code ?**  
R : Non ! Seulement quand vous faites `git pull` et rechargez depuis Git.

**Q : Est-ce que je dois faire `reset-db` à chaque fois ?**  
R : Oui, après chaque `git pull` ou clone du projet.

**Q : Mes vrais clients seront-ils affectés en production ?**  
R : Non ! Ce script est pour le **développement local**. En production, vos données sont dans une base séparée.

**Q : Je peux ajouter mes propres données de test ?**  
R : Oui ! Modifiez `scripts/reset-database.ts` pour ajouter vos propres données.

---

## 🎓 Pour Résumer

1. **Git = Code** (toujours sauvegardé)
2. **PostgreSQL = Données** (se recrée avec `npm run reset-db`)
3. **Après chaque `git pull` → exécutez `npm run reset-db`**

✅ **Vous ne perdrez plus jamais votre travail maintenant !**
