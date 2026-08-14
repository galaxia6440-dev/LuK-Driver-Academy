# LuK Driver Academy — Site web

Académie virtuelle de pilotage basée sur le jeu **Car Parking Multiplayer**.
Site complet : frontend React + backend Node/Express + base de données SQLite, interface d'administration incluse.

⚠️ Ce n'est pas une véritable auto-école : toutes les formations, courses et activités décrites se déroulent dans le jeu.

## Structure du projet

```
luk-driver-academy/
├── backend/          API Express + base SQLite + photos uploadées
│   ├── db/
│   │   ├── database.js        schéma de la base
│   │   ├── seed.js             script de peuplement initial
│   │   └── cars_seed.json      données réelles des 20 voitures fournies
│   ├── routes/                  routes API (voitures, moniteurs, formations, événements, candidatures...)
│   ├── uploads/                  photos (voitures, moniteurs, candidatures)
│   └── server.js
└── frontend/          Site React (Vite)
    └── src/
        ├── pages/                pages publiques + interface admin (pages/admin)
        ├── components/
        └── i18n/                 traductions FR / EN
```

## Installation

Prérequis : Node.js 18+ et npm.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run seed      # crée la base de données et importe les 20 voitures, catégories, moniteurs...
npm start          # démarre l'API sur http://localhost:4000
```

Un compte administrateur est créé automatiquement au premier seed :
- **Identifiant** : `admin`
- **Mot de passe** : `ChangeMe123!`

⚠️ Change ce mot de passe immédiatement après ta première connexion (page `/admin`, ou via la route `POST /api/auth/change-password`).

### 2. Frontend

Dans un second terminal :

```bash
cd frontend
npm install
npm run dev         # démarre le site sur http://localhost:5173
```

Le frontend redirige automatiquement les appels `/api` et `/uploads` vers le backend (voir `vite.config.js`).

### 3. Accéder au site

- Site public : http://localhost:5173
- Interface admin : http://localhost:5173/admin/login

## Fonctionnalités

- **Voitures de la flotte** : 20 voitures réelles importées depuis les dossiers fournis (aucune reconnaissance d'image, noms et catégories tirés des dossiers), avec niveau, statut, description, photo principale et galerie complète.
- **Statuts de voitures** : voiture de l'académie, voiture prêtée (avec rappel de restitution automatique), voiture de compétition, véhicule d'entraînement, + statuts additionnels ajoutés pendant la saisie (voiture personnelle de chaque apprenti, voiture basique, autres).
- **Moniteurs** : L. Dufour (France, boîte automatique) et MrBread (Malaisie, boîte manuelle).
- **Formations, catégories, courses/GPR, recrutement (formulaire + base de données de candidatures), contact, page Car Parking Multiplayer.**
- **Site multilingue FR/EN** avec sélecteur.
- **Interface d'administration complète** : CRUD voitures + photos (ajout multiple, suppression, photo principale), moniteurs, formations, événements, gestion des candidatures (changement de statut).
- Aucun classement, leaderboard ni résultat de course inventé, conformément au cahier des charges.

## Déploiement en production

Voir [`DEPLOYMENT.md`](./DEPLOYMENT.md) pour déployer gratuitement le backend (Render) et le frontend (Vercel) sur deux domaines séparés, avec CORS, authentification et URLs de photos configurés correctement.

## Prochaines étapes possibles

- Ajouter les photos des moniteurs (actuellement sans photo).
- Écrire les descriptions manquantes pour les voitures qui n'en ont pas.
- Ajouter des événements réels dans l'onglet admin "Événements".
- Déployer le backend (ex: Render, Railway) et le frontend (ex: Vercel, Netlify) — il faudra alors adapter l'URL de l'API dans le frontend en production.
- Passer le mot de passe admin par défaut.
