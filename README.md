# Todo Front

Application front-end de gestion de tâches en React + TypeScript pour une ToDo list par catégories.

Elle permet de :

- créer des catégories,
- filtrer les tâches par catégorie,
- ajouter de nouvelles tâches,
- marquer une tâche comme terminée,
- supprimer une tâche,
- afficher des erreurs backend avec notifications.

## Stack technique

- React 19
- TypeScript
- Vite
- Axios
- Tailwind CSS
- react-hot-toast
- Sentry

## Fonctionnalités

- Ajout rapide de catégories depuis le formulaire dédié
- Filtres pour afficher toutes les tâches ou seulement celles d’une catégorie
- Ajout de tâches en sélectionnant une catégorie
- Réalisation d’un toggle "complétée / non complétée"
- Suppression immédiate des tâches
- Gestion des erreurs API via interceptors Axios
- Notifications utilisateur via toast

## Prérequis

- Node.js 18+
- npm
- Un backend API exposant les routes `/api/categories` et `/api/tasks`

## Installation

```bash
npm install
```

## Configuration de l’environnement

Créez un fichier `.env` à la racine du projet avec la variable suivante :

```env
VITE_API_URL=http://localhost:8000
```

Remplacez l’URL par celle de votre API locale ou distante.

## Lancer le projet

En mode développement :

```bash
npm run dev
```

La commande démarre le serveur Vite. L’URL affichée dans le terminal (généralement `http://localhost:5173`) permet d’ouvrir l’application dans le navigateur.

## Build de production

```bash
npm run build
```

Le build est généré dans le dossier `dist/`.

## Vérification du code

```bash
npm run lint
```

## Structure du projet

```text
src/
  api/
    client.ts
  components/
    TaskList.tsx
    ToDo.tsx
  models/
    categories.ts
    tasks.ts
  App.tsx
  main.tsx
```

## Points d’intégration API

Le client Axios est configuré avec une base URL dynamique :

```ts
baseURL: `${import.meta.env.VITE_API_URL}/api`
```

Les appels principaux sont :

- `GET /categories/`
- `POST /categories/`
- `GET /tasks/`
- `POST /tasks/`
- `PATCH /tasks/:id/`
- `DELETE /tasks/:id/`

## Remarques

Le projet est conçu pour être utilisé avec un backend compatible Django REST Framework ou une API structurée avec les mêmes endpoints.

Si le serveur API est indisponible, l’application affiche un message d’erreur et la requête est rejetée proprement via les interceptors Axios.
