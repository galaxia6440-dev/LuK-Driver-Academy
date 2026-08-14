# Déploiement en production — LuK Driver Academy

Ce guide déploie le **backend** (API + base de données) sur **Render** (gratuit) et le **frontend** (site React) sur **Vercel** (gratuit), sur deux domaines différents.

## ⚠️ À lire avant de commencer — limite du plan gratuit

Les instances gratuites Render utilisent un **disque éphémère** : à chaque redéploiement (et parfois après une longue période d'inactivité), le système de fichiers repart de zéro.

Concrètement :
- Les **20 voitures officielles, catégories, statuts, niveaux et moniteurs** sont automatiquement recréés à chaque démarrage (le script `seed` est relancé au boot — voir plus bas), donc le site de base fonctionne toujours.
- **Les changements faits depuis l'interface admin après le déploiement initial** (nouvelles voitures ajoutées, photos uploadées, candidatures reçues, modifications) **seront perdus** au prochain redéploiement ou redémarrage du service.

Pour une vraie persistance en production, il faudra migrer vers une base de données hébergée (ex: PostgreSQL gratuit sur Neon ou Supabase) et un stockage de fichiers externe (ex: Cloudinary, gratuit jusqu'à 25 Go). Je peux faire cette migration si tu veux une persistance complète — dis-le-moi. Pour une démo ou un lancement initial, la configuration ci-dessous fonctionne très bien.

---

## Étape 0 — Mettre le projet sur GitHub

Render et Vercel se connectent tous les deux à un dépôt Git.

```bash
cd luk-driver-academy
git init
git add .
git commit -m "Initial commit"
```

Crée un dépôt vide sur GitHub (ex: `luk-driver-academy`), puis :

```bash
git remote add origin https://github.com/TON-COMPTE/luk-driver-academy.git
git branch -M main
git push -u origin main
```

---

## Étape 1 — Déployer le backend sur Render

1. Va sur [render.com](https://render.com) et crée un compte (gratuit).
2. **New +** → **Web Service** → connecte ton dépôt GitHub `luk-driver-academy`.
3. Configure le service :
   - **Root Directory** : `backend`
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm run seed && npm start`
   - **Instance Type** : `Free`
4. Dans **Environment Variables**, ajoute :
   - `JWT_SECRET` → clique "Generate" pour une valeur aléatoire sécurisée (ou saisis-en une toi-même, longue et unique)
   - `FRONTEND_URL` → laisse vide pour l'instant, on le remplira à l'étape 3
   - (Ne définis **pas** `PORT` : Render l'injecte automatiquement.)
5. Clique **Create Web Service**. Le premier déploiement prend quelques minutes.
6. Une fois déployé, note l'URL générée, par ex. `https://luk-driver-academy-api.onrender.com`.
7. Vérifie que l'API répond : ouvre `https://luk-driver-academy-api.onrender.com/api/health` dans le navigateur → tu dois voir `{"ok":true}`.

> Le fichier `backend/render.yaml` fourni décrit cette même configuration si tu préfères déployer via un "Blueprint" Render (New + → Blueprint).

> Note : sur le plan gratuit, le service se met en veille après une période d'inactivité. La première requête après une veille peut prendre 30 à 60 secondes (cold start) — c'est normal.

---

## Étape 2 — Déployer le frontend sur Vercel

1. Va sur [vercel.com](https://vercel.com) et crée un compte (gratuit).
2. **Add New...** → **Project** → importe le dépôt GitHub `luk-driver-academy`.
3. Configure le projet :
   - **Root Directory** : `frontend`
   - **Framework Preset** : `Vite` (détecté automatiquement)
   - **Build Command** : `npm run build` (par défaut)
   - **Output Directory** : `dist` (par défaut)
4. Dans **Environment Variables**, ajoute :
   - `VITE_API_URL` → l'URL Render de l'étape 1, ex. `https://luk-driver-academy-api.onrender.com`
5. Clique **Deploy**.
6. Une fois déployé, note l'URL générée, par ex. `https://luk-driver-academy.vercel.app`.

> Le fichier `frontend/vercel.json` fourni configure déjà le routage SPA (React Router) pour que les URLs comme `/flotte/audi-r8-gt3` fonctionnent au rechargement de page. Si tu déploies sur Netlify à la place, utilise `frontend/netlify.toml` (même logique).

---

## Étape 3 — Autoriser le frontend dans le backend (CORS)

1. Retourne sur Render → ton service backend → **Environment**.
2. Modifie `FRONTEND_URL` avec l'URL Vercel obtenue à l'étape 2, ex. :
   ```
   FRONTEND_URL=https://luk-driver-academy.vercel.app
   ```
   (Plusieurs domaines possibles, séparés par des virgules, si tu ajoutes un nom de domaine personnalisé plus tard.)
3. Sauvegarde → Render redéploie automatiquement le service.

Sans cette étape, le navigateur bloquera les appels du frontend vers l'API (erreur CORS dans la console).

---

## Étape 4 — Vérifications finales

- Ouvre `https://luk-driver-academy.vercel.app` → la page d'accueil doit charger les voitures, moniteurs, etc.
- Va sur `/admin/login`, connecte-toi avec `admin` / `ChangeMe123!`.
- **Change immédiatement ce mot de passe** (aucune interface dédiée dans l'admin actuellement — utilise la route API directement, par ex. avec curl) :
  ```bash
  curl -X POST https://luk-driver-academy-api.onrender.com/api/auth/change-password \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","currentPassword":"ChangeMe123!","newPassword":"TON-NOUVEAU-MOT-DE-PASSE"}'
  ```
- Teste l'ajout d'une voiture ou d'une photo depuis l'admin pour confirmer que tout communique bien entre les deux domaines.

---

## Récapitulatif des variables d'environnement

| Où | Variable | Valeur |
|---|---|---|
| Backend (Render) | `JWT_SECRET` | valeur aléatoire générée |
| Backend (Render) | `FRONTEND_URL` | URL du frontend déployé (Vercel) |
| Frontend (Vercel) | `VITE_API_URL` | URL du backend déployé (Render) |

## En local (rien ne change)

Le développement local continue de fonctionner exactement comme avant (`npm run dev` côté frontend avec le proxy Vite vers `localhost:4000`) : aucune variable d'environnement n'est nécessaire en local, `VITE_API_URL` et `FRONTEND_URL` peuvent rester vides.
