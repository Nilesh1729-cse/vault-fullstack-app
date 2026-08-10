# Vault — Full-Stack Login App

A simple, extensible full-stack authentication app.

- **Frontend:** Vanilla HTML / CSS / JavaScript (no build step, no framework)
- **Backend:** Node.js + Express, structured MVC-style
- **Database:** MySQL
- **Auth:** JWT (JSON Web Tokens) + bcrypt password hashing

> Note on "MERN": the brief asked for a MERN-style backend but a MySQL
> database. MERN's "M" normally means MongoDB, which is incompatible with
> MySQL, so this project uses the rest of the stack — **E**xpress,
> **N**ode — with MySQL as the relational database via `mysql2`. If you'd
> rather use MongoDB (true MERN) or an ORM like Sequelize/Prisma, see
> "Swapping the database" below.

---

## Project structure

```
project/
├── backend/
│   ├── config/
│   │   └── db.js              # MySQL connection pool
│   ├── controllers/
│   │   └── authController.js  # register / login / me
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification, role guard
│   │   ├── errorHandler.js    # central error + 404 handling
│   │   └── validators.js      # express-validator rules
│   ├── models/
│   │   └── userModel.js       # all SQL for the users table
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── index.js           # mounts every feature router under /api
│   ├── database/
│   │   ├── schema.sql         # tables (users, login_history)
│   │   └── init.js            # runs schema.sql against MySQL
│   ├── .env.example
│   ├── package.json
│   └── server.js              # app entry point
│
└── frontend/
    ├── index.html              # login page
    ├── register.html
    ├── dashboard.html          # protected page
    ├── css/style.css
    └── js/
        ├── api.js              # fetch wrapper + token storage (single source of truth for API calls)
        ├── ui.js                # small shared DOM helpers
        ├── status.js            # live "system online" indicator, pings /api/health
        ├── login.js
        ├── register.js
        └── dashboard.js
```

---

## 1. Set up MySQL

Make sure MySQL is installed and running, then create the database + tables:

```bash
cd backend
cp .env.example .env
# edit .env and set DB_USER / DB_PASSWORD to your MySQL credentials
```

Then run the schema:

```bash
npm install
npm run db:init
```

This creates the `auth_app` database with a `users` table and an example
`login_history` table (feel free to remove the latter if you don't need it).

You can also just run `database/schema.sql` directly in MySQL Workbench /
the `mysql` CLI if you prefer.

## 2. Run the backend

```bash
cd backend
npm install     # if you haven't already
npm run dev      # nodemon, auto-restarts on changes
# or: npm start
```

The API starts on `http://localhost:5000` by default. Check it's alive:

```bash
curl http://localhost:5000/api/health
```

## 3. Run the frontend

The frontend has no build step — it's plain static files. Serve the
`frontend/` folder with any static server, for example:

```bash
cd frontend
npx serve -l 5500
# or use the VS Code "Live Server" extension
```

Open `http://localhost:5500` in your browser. The login page pings the
backend on load and shows a live connection status in the left panel.

If your backend runs somewhere other than `http://localhost:5000/api`,
set it before the other scripts load, e.g. add this to each HTML file's
`<head>`:

```html
<script>window.API_BASE_URL = 'https://your-api.example.com/api';</script>
```

## 4. Try it

1. Go to `register.html`, create an account.
2. You're redirected to `dashboard.html`, which fetches your profile via
   a JWT-protected `/api/auth/me` request.
3. Sign out, then sign back in on `index.html`.

---

## How the pieces fit together (for extending it)

**Backend — adding a new feature (example: a "posts" resource):**

1. Add a table to `database/schema.sql` (e.g. `posts`, referencing `users(id)`).
2. Create `models/postModel.js` with the SQL queries for that table.
3. Create `controllers/postsController.js` with the request handlers.
4. Create `routes/postsRoutes.js` and wire it to the controller.
5. In `routes/index.js`, add one line: `router.use('/posts', require('./postsRoutes'));`

`server.js` never needs to change. Protect any route with the existing
`requireAuth` middleware (see `authMiddleware.js`); use `requireRole('admin')`
for role-gated routes.

**Frontend — adding a new page or API call:**

1. Add a new method to `js/api.js` (e.g. `getPosts: () => request('/posts', { auth: true })`).
2. Build a new HTML page reusing `css/style.css` classes (`.info-card`,
   `.btn`, `.field`, etc.) so it matches the existing design system.
3. Add a page-specific script (like `login.js`/`dashboard.js`) that calls
   `API.<method>()` and updates the DOM.

Because `api.js` centralizes the base URL, auth header, and error shape,
new pages don't need to duplicate any fetch/token logic.

---

## Security notes (read before shipping to production)

This is a clean starting point, not a hardened production system. Before
deploying:

- **Move the JWT out of `localStorage`.** It's simple for a demo, but
  vulnerable to XSS. Prefer an httpOnly, secure, sameSite cookie, with
  the backend reading the token from the cookie instead of an
  `Authorization` header.
- **Add rate limiting** on `/api/auth/login` and `/api/auth/register`
  (e.g. `express-rate-limit`) to slow down brute-force attempts.
- **Use HTTPS** everywhere in production, and set `CLIENT_ORIGIN` in
  `.env` to your real frontend origin instead of `*`.
- **Rotate `JWT_SECRET`** to a long, random value and keep it out of
  version control (`.env` is already git-ignored — see below).
- Consider adding email verification and a password-reset flow; the
  `authController.js` pattern (validate → model → response) makes both
  straightforward to add as new functions + routes.

## Swapping the database

Because all SQL lives in `models/` and connection setup lives in
`config/db.js`, switching to another database mostly touches those two
places:

- **Sequelize/Prisma on MySQL:** replace `config/db.js` with the
  ORM's client, and rewrite `models/userModel.js` using ORM calls
  instead of raw SQL. Controllers don't need to change.
- **MongoDB (true MERN):** replace `mysql2` with `mongoose`, replace
  `config/db.js` with a Mongoose connection, and rewrite `userModel.js`
  as a Mongoose schema/model. The controller layer stays almost
  identical since it only calls `userModel.findByEmail`, `.create`, etc.

## .gitignore

A `.gitignore` is included in `backend/` so `.env` and `node_modules/`
are never committed. Copy the same pattern into `frontend/` if you later
add a build step there.
