# Todo Backend — NestJS + Prisma + MySQL

API REST pour la gestion d'une liste de tâches (todo list). Service backend du projet **Todo Docker** (devoir Docker).

> **Repo frontend associé :** [`todo-frontend`](../todo-frontend) — Next.js client.

---

## 🛠️ Stack technique

| Couche | Technologie | Version cible |
|---|---|---|
| Runtime | Node.js | `20-alpine` |
| Framework | NestJS | `^10` |
| ORM | Prisma | `^5` |
| Base de données | MySQL | `8.0` |
| Conteneurisation | Docker + docker-compose | — |

---

## 📁 Structure du projet

```
todo-backend/
├── src/                    # Code source NestJS
│   ├── main.ts            # Point d'entrée
│   ├── app.module.ts
│   └── todos/             # Module todo (controller, service, dto)
├── prisma/
│   ├── schema.prisma      # Schéma Prisma (modèle Todo)
│   └── migrations/        # Migrations SQL générées
├── Dockerfile             # Multi-stage (builder → runner)
├── docker-compose.yml     # Orchestration mysql + backend + frontend
├── .dockerignore
├── .env.example
└── README.md
```

---

## 🚀 Démarrage rapide (Docker)

### Pré-requis
- Docker `>= 24`
- docker-compose `>= 2.20`
- Le repo `todo-frontend` cloné **à côté** de ce repo (même dossier parent) :
  ```
  parent/
  ├── todo-backend/   ← vous êtes ici
  └── todo-frontend/
  ```

### Étapes

```bash
# 1. Copier les variables d'environnement
cp .env.example .env

# 2. Lancer toute la stack (mysql + backend + frontend)
docker compose up --build

# 3. Accès
# - Frontend : http://localhost:3000
# - Backend  : http://localhost:4000
# - MySQL    : localhost:3306 (depuis l'hôte)
```

Les migrations Prisma (`prisma migrate deploy`) s'exécutent automatiquement au démarrage du container backend.

### Arrêt
```bash
docker compose down              # arrête les containers
docker compose down -v           # + supprime le volume MySQL (⚠️ efface les données)
```

---

## 💻 Démarrage local (sans Docker)

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer .env (DATABASE_URL pointant vers votre MySQL)
cp .env.example .env

# 3. Générer le client Prisma + migrer
npx prisma generate
npx prisma migrate dev

# 4. Lancer en dev
npm run start:dev
```

API disponible sur `http://localhost:4000`.

---

## 🐳 Architecture Docker

### Image backend (Dockerfile multi-stage)

| Stage | Rôle |
|---|---|
| `builder` | Installe **toutes** les dépendances (dev incluses), génère Prisma Client, compile TypeScript → `dist/` |
| `runner` | Image finale légère (`node:20-alpine`), copie uniquement `dist/`, `node_modules` de prod et le client Prisma. Lance `prisma migrate deploy` puis `node dist/main`. |

### docker-compose

3 services dans un **réseau bridge** dédié `todo-network` :

| Service | Image | Port hôte:container |
|---|---|---|
| `mysql` | `mysql:8.0` | `3306:3306` |
| `backend` | build local | `4000:4000` |
| `frontend` | build `../todo-frontend` | `3000:3000` |

**Volume persistant** : `mysql_data` → monté sur `/var/lib/mysql`. Les données survivent à `docker compose down`.

---

## 🌿 Conventions Git

### Branches

- `main` → branche stable, code mergé uniquement après validation.
- Une branche **par fonctionnalité** : `feat/<nom-court>`
  - Exemple : `feat/todo-crud`, `feat/todo-filter`

### Commits — Conventional Commits

Format standard :
```
<type>(<scope>): <description courte>

[corps optionnel]
[footer optionnel — ex: BREAKING CHANGE ou références issue]
```

| Type | Usage | Exemple |
|---|---|---|
| `feat` | Nouvelle fonctionnalité | `feat(todo): add create endpoint` |
| `fix` | Correction de bug | `fix(todo): prevent empty title` |
| `refactor` | Refactor sans changement de comportement | `refactor(prisma): extract todo repository` |
| `test` | Ajout/modif de tests | `test(todo): add unit tests for service` |
| `docs` | Documentation | `docs(readme): add Docker setup` |
| `chore` | Maintenance (deps, config) | `chore(deps): bump nestjs to 10.4` |
| `ci` | Pipeline CI/CD | `ci: add lint job` |
| `perf` | Performance | `perf(todo): add index on userId` |

---

## 📚 Exemple d'utilisation de l'API

> ⚠️ Endpoints à compléter au fil du développement.

### Créer une tâche
```bash
curl -X POST http://localhost:4000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Apprendre Docker", "completed": false}'
```

### Lister les tâches
```bash
curl http://localhost:4000/todos
```

---

## 🔐 Variables d'environnement

Voir [`.env.example`](./.env.example).

| Variable | Description | Exemple |
|---|---|---|
| `DATABASE_URL` | URL de connexion MySQL pour Prisma | `mysql://todo:todo@mysql:3306/tododb` |
| `PORT` | Port d'écoute du backend | `4000` |
| `NODE_ENV` | Environnement | `production` |

---

## 📝 Licence

Projet pédagogique — usage libre.
