# 🚀 Mikolo Events - Backend API (Express.js & PostgreSQL)

Ce projet contient l'API REST complète pour l'application **Mikolo Events**, développée avec Node.js, Express.js et PostgreSQL.

---

## 🛠️ Architecture & Technologies

- **Framework** : Express.js
- **Base de données** : PostgreSQL (`pg` Connection Pool)
- **Authentification & Rôles (RBAC)** :
  - **`admin`** : Administrateur système (Accès complet)
  - **`superviseur`** : Superviseur terrain et régie
  - **`resp`** : Responsable événementiel / Chef de projet
- **Sécurité & Logs** : Helmet, CORS, Morgan, Hachage Bcrypt, JWT

---

## 📋 Configuration & Installation

### 1. Installation des dépendances

```bash
cd back-mikolo
npm install
```

### 2. Configuration des variables d'environnement (`.env`)

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=mikolo_events_super_secret_jwt_key_2024_@!
JWT_EXPIRES_IN=7d

# Paramètres PostgreSQL
DATABASE_URL=postgres://postgres:fanomezantsoa@localhost:5432/mikolo_events

PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=fanomezantsoa
PGDATABASE=mikolo_events

CORS_ORIGIN=http://localhost:3000
```

### 3. Création de la Base de données PostgreSQL

Assurez-vous que votre serveur PostgreSQL est démarré, puis créez la base de données :

```sql
CREATE DATABASE mikolo_events;
```

### 4. Initialisation des tables et des données de test

Exécutez le script d'initialisation automatique pour appliquer la structure SQL et créer les comptes de test :

```bash
npm run db:init
```

---

## 🔑 Identifiants de Test par Rôle (Mot de passe commun : `password123`)

| Rôle | Email | Mot de passe | Description |
|---|---|---|---|
| 👑 **Administrateur** (`admin`) | `admin@mikolo-events.fr` | `password123` | Gestion globale, utilisateurs et accès complet |
| 👁️ **Superviseur** (`superviseur`) | `superviseur@mikolo-events.fr` | `password123` | Supervision des équipes, régies et plannings |
| 📋 **Responsable** (`resp`) | `resp@mikolo-events.fr` | `password123` | Gestionnaire de projets événements et stocks |

---

## 📡 Endpoints de l'API

### 🔐 1. Authentification (`/api/auth`)
| Méthode | Route | Rôle requis | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Inscription (`role`: `'admin'`, `'superviseur'`, ou `'resp'`) |
| `POST` | `/api/auth/login` | Public | Connexion utilisateur (Retourne un Token JWT) |
| `GET` | `/api/auth/me` | Tous | Profil de l'utilisateur connecté |
| `GET` | `/api/auth/users` | `admin`, `superviseur` | Liste de tous les utilisateurs inscrits |

### 📅 2. Événements (`/api/events`)
| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/events` | Liste des événements |
| `POST` | `/api/events` | Créer un événement |
| `PUT` | `/api/events/:id` | Mettre à jour un événement |
| `DELETE` | `/api/events/:id` | Supprimer un événement |
| `POST` | `/api/events/:id/sessions` | Ajouter une session multi-date |
| `DELETE` | `/api/events/:id/sessions/:sessionId` | Supprimer une session |

### 🎙️ 3. Animateurs & Talents (`/api/animators`)
| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/animators` | Liste des animateurs |
| `POST` | `/api/animators` | Ajouter un animateur |
| `PUT` | `/api/animators/:id` | Modifier un animateur |
| `DELETE` | `/api/animators/:id` | Supprimer un animateur |

### 📦 4. Équipements & Stocks (`/api/stocks`)
| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/stocks` | Inventaire des équipements |
| `POST` | `/api/stocks` | Ajouter du matériel |
| `PUT` | `/api/stocks/:id` | Modifier les stocks |
| `DELETE` | `/api/stocks/:id` | Supprimer un équipement |

### 🗓️ 5. Planning & Dashboard (`/api/planning`, `/api/dashboard`)
| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/planning` | Agrégation calendrier |
| `GET` | `/api/dashboard/stats` | KPIs et métriques du tableau de bord |
