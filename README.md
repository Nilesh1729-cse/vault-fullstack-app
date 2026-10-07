# 🔐 Vault — Full-Stack Authentication App

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8%2B-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JavaScript](https://img.shields.io/badge/Frontend-Vanilla%20JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge)](https://jwt.io/)

Vault is a clean, extensible **full-stack authentication reference application** built with a vanilla JavaScript frontend, a Node.js + Express backend, and a MySQL database.

It demonstrates the complete authentication lifecycle:

```text
Register
   ↓
Validate input
   ↓
Hash password with bcrypt
   ↓
Store user in MySQL
   ↓
Issue JWT
   ↓
Login
   ↓
Verify password
   ↓
Record login history
   ↓
Protect /api/auth/me with JWT
```

> **Stack note:** this is intentionally **not MERN** because the database is MySQL rather than MongoDB. The current stack is Vanilla JS + Express + Node.js + MySQL + JWT + bcrypt.

---

## 📚 Documentation

The README is the quick-start and project overview.

For the full technical reference—including architecture, database design, request flows, security model, API details, frontend behavior, extension patterns, and viva explanation—see:

### [📘 DOCUMENTATION.md](DOCUMENTATION.md)

---

## ✨ Features

- User registration with server-side validation.
- Password hashing using `bcryptjs`.
- JWT-based authentication.
- Protected `GET /api/auth/me` endpoint.
- MySQL persistence through a reusable connection pool.
- Login-history recording with IP address and user-agent data.
- Live `/api/health` endpoint with database connectivity check.
- Client-side form validation and loading/error states.
- Live frontend API status indicator refreshed every 15 seconds.
- Centralized API client and reusable UI helpers.
- MVC-style backend structure designed for easy feature expansion.
- Reusable role-checking middleware for future role-protected routes.

---

## 🏗️ Architecture

```text
┌──────────────────────────────────────────────┐
│              Vanilla JS Frontend             │
│                                              │
│ index.html  register.html  dashboard.html   │
│      │             │              │          │
│      └─────────────┴──────┬───────┘          │
│                           ↓                  │
│                       js/api.js              │
└───────────────────────────┬──────────────────┘
                            │ HTTP / JSON
                            ↓
┌──────────────────────────────────────────────┐
│               Node.js + Express              │
│                                              │
│ /api/auth/register                           │
│ /api/auth/login                              │
│ /api/auth/me                                 │
│ /api/health                                  │
│        ↓                                     │
│ validators → controller → model              │
└───────────────────────────┬──────────────────┘
                            │ mysql2/promise
                            ↓
┌──────────────────────────────────────────────┐
│                    MySQL                     │
│                                              │
│ users                 login_history          │
└──────────────────────────────────────────────┘
```

The backend follows a simple layered structure:

```text
Routes → Middleware → Controllers → Models → MySQL
```

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API
- Responsive custom styling
- No framework
- No build step

### Backend

- Node.js 18+
- Express 4
- CommonJS
- `express-validator`
- `jsonwebtoken`
- `bcryptjs`
- `mysql2/promise`
- `dotenv`
- `cors`
- Nodemon for development

### Database

- MySQL
- InnoDB
- `utf8mb4`

---

## 📂 Project Structure

```text
vault-fullstack-app/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── authController.js
│   ├── database/
│   │   ├── schema.sql
│   │   └── init.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── validators.js
│   ├── models/
│   │   └── userModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── index.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── api.js
│   │   ├── dashboard.js
│   │   ├── login.js
│   │   ├── register.js
│   │   ├── status.js
│   │   └── ui.js
│   ├── dashboard.html
│   ├── index.html
│   └── register.html
│
├── README.md
├── DOCUMENTATION.md
└── package-lock.json
```

---

## 🚀 Getting Started

### Prerequisites

Install:

- Node.js **18+**
- npm
- MySQL Server
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Nilesh1729-cse/vault-fullstack-app.git
cd vault-fullstack-app
```

### 2. Configure the backend

```bash
cd backend
```

Copy `.env.example` to `.env` and set your MySQL credentials plus a strong JWT secret.

Example:

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5500

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=auth_app

JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
```

> Never commit your real `.env` file.

### 3. Install dependencies

```bash
npm install
```

### 4. Initialize the database

```bash
npm run db:init
```

This executes `backend/database/schema.sql` and creates the `auth_app` database with the `users` and `login_history` tables.

### 5. Start the backend

Development:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

Backend:

```text
http://localhost:5000
```

### 6. Start the frontend

Open a second terminal:

```bash
cd frontend
npx serve -l 5500
```

Or use the VS Code Live Server extension.

Frontend:

```text
http://localhost:5500
```

---

## ✅ Verify the Backend

Open:

```text
http://localhost:5000/api/health
```

Healthy response:

```json
{
  "status": "ok",
  "db": "connected",
  "time": "2026-10-07T12:00:00.000Z"
}
```

When MySQL is unavailable, the endpoint returns HTTP `503` and a degraded status.

---

## 🔐 Authentication Flow

### Registration

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "StrongPassword123"
}
```

The server:

1. validates the request;
2. checks for an existing email;
3. hashes the password with bcrypt;
4. inserts the user into MySQL;
5. creates a JWT;
6. returns the token and safe user data.

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "ada@example.com",
  "password": "StrongPassword123"
}
```

The server verifies the password hash, records login history, signs a JWT, and returns the token.

### Protected Profile

```http
GET /api/auth/me
Authorization: Bearer <JWT>
```

Returns the authenticated user's public profile.

---

## 📡 API Reference

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/health` | No | Check API + MySQL connectivity |
| `POST` | `/api/auth/register` | No | Create an account |
| `POST` | `/api/auth/login` | No | Authenticate user |
| `GET` | `/api/auth/me` | Yes | Get authenticated user |

### Common responses

| Code | Meaning |
|---:|---|
| `200` | Success |
| `201` | Account created |
| `401` | Authentication failed / token missing or invalid |
| `404` | Route or user not found |
| `409` | Duplicate record |
| `422` | Validation failed |
| `500` | Internal server error |
| `503` | Database unavailable for health check |

---

## 🗄️ Database Design

The project uses two tables:

### `users`

```text
id
name
email
password_hash
role
is_active
created_at
updated_at
```

### `login_history`

```text
id
user_id
ip_address
user_agent
created_at
```

Relationship:

```text
users 1 ─────────── N login_history
```

The `email` field is unique, `role` defaults to `user`, and `login_history.user_id` references `users.id` with cascading delete.

---

## 🧩 Frontend Pages

### `index.html`

Login page with:

- email/password inputs;
- client-side validation;
- loading state;
- error alerts;
- connection status indicator.

### `register.html`

Registration page with:

- name/email/password fields;
- password confirmation;
- client-side validation;
- server validation error display;
- connection status indicator.

### `dashboard.html`

Protected account page showing:

- name;
- email;
- role;
- member-since date;
- sign-out control.

---

## 🧠 Shared Frontend Code

### `js/api.js`

Central API client that handles:

- API base URL;
- fetch requests;
- JWT storage;
- Authorization header;
- normalized API errors.

Default API URL:

```text
http://localhost:5000/api
```

Override it before `api.js` loads with:

```html
<script>
  window.API_BASE_URL = 'https://your-api.example.com/api';
</script>
```

### `js/ui.js`

Reusable helpers for alerts, loading states, and field errors.

### `js/status.js`

Calls `/api/health` on load and every 15 seconds.

### `js/dashboard.js`

Loads the current profile and handles logout.

---

## 🧪 Manual API Test with curl

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","password":"StrongPassword123"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"StrongPassword123"}'
```

### Get profile

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_HERE"
```

---

## 🔧 Development Commands

From `backend/`:

```bash
npm install
npm run db:init
npm run dev
npm start
```

The current `package.json` defines `start`, `dev`, and `db:init`; there is no automated test script in the repository at present. 

---

## 🔒 Security Notes

This is a reference/demo application rather than a hardened production identity system.

Before production deployment:

- move authentication tokens away from `localStorage` where an httpOnly cookie/session architecture is appropriate;
- use HTTPS everywhere;
- set a specific `CLIENT_ORIGIN` instead of relying on permissive CORS;
- use a long random `JWT_SECRET` and keep it outside version control;
- add rate limiting to login and registration;
- add password reset and email verification;
- consider MFA for sensitive applications;
- add stronger audit/monitoring controls.

The current frontend stores its JWT in `localStorage`, and the backend allows a wildcard CORS fallback when `CLIENT_ORIGIN` is absent. These are acceptable for a simple local reference app but should be reviewed before production. 

---

## 🧱 Why the Structure Is Extensible

The backend intentionally keeps SQL, HTTP logic, validation, and routing separate.

To add a new feature:

```text
1. Create model
2. Create controller
3. Create route
4. Mount route in routes/index.js
5. Add one API-client function in frontend/js/api.js
6. Add the corresponding page/script
```

This means the main server bootstrap does not need to become a large file as more features are introduced.

---

## 🎓 Viva / Interview Explanation

> **Vault is a full-stack authentication application built with vanilla HTML, CSS, and JavaScript on the frontend and Node.js with Express on the backend. MySQL is used as the relational database. The backend follows an MVC-style structure with separate routes, controllers, models, and middleware.**
>
> **During registration, the request is validated, the password is hashed using bcrypt, the user is inserted into MySQL, and a JWT is generated. During login, the stored password hash is compared with the supplied password, the login is recorded in a separate history table, and a JWT is returned.**
>
> **For protected resources, the frontend sends the JWT in the Authorization Bearer header. The authentication middleware verifies the token and attaches the decoded user information to the request. The `/api/auth/me` endpoint then fetches the user's safe profile from MySQL.**
>
> **The frontend centralizes API requests in `api.js`, stores the token locally, and uses `status.js` to periodically check whether the backend and database are reachable. The architecture is intentionally simple but extensible, so new features can follow the same route-controller-model pattern.**

---

## ⚠️ Important Scope Notes

To keep the repository description technically accurate:

### This project currently has

- one Express backend application;
- one MySQL database;
- three authentication endpoints plus health;
- JWT authentication;
- bcrypt hashing;
- login history;
- a reusable role middleware helper.

### This project currently does not have

- MongoDB / MERN;
- React or another frontend framework;
- microservices;
- OAuth/social login;
- refresh-token rotation;
- MFA;
- password-reset workflow;
- an automated test suite;
- production-grade rate limiting.

---

## 📘 Full Technical Reference

For detailed architecture, database schema, sequence diagrams, endpoint examples, security analysis, frontend flow, extension instructions, and file-by-file responsibilities:

**[Read the complete documentation →](DOCUMENTATION.md)**

---

## 📄 License

No separate license file is currently present in the repository. Add a `LICENSE` file before presenting the project as an open-source reusable library.
