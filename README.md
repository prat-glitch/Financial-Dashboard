# Expense Tracker (Financial Dashboard)

A full-stack expense tracking and financial dashboard application with **Google OAuth login**, a **React (Vite)** frontend, and an **Express + MongoDB** backend API.

**Live Frontend:** https://graceful-mooncake-a11c7b.netlify.app/

---

## Tech Stack

### Frontend (Client)
- **React** (Vite)
- **JavaScript**
- **CSS**
- Google OAuth UI: `@react-oauth/google`

### Backend (Server)
- **Node.js**
- **Express**
- **MongoDB** with **Mongoose**
- **JWT Authentication** (`jsonwebtoken`)
- Password utilities: `bcrypt` (supports non-Google auth flows if used)
- Environment config: `dotenv`

### Authentication
- **Google OAuth** (client obtains Google ID token)
- **Server-side token verification** + issues **app JWT** for API access

---

## Folder Structure

```text
Financial-Dashboard/
├─ client/                     # Frontend (React + Vite)
│  ├─ src/                      # App source code (components, pages, context, etc.)
│  ├─ public/                   # Static assets
│  ├─ index.html
│  ├─ vite.config.js
│  ├─ package.json
│  ├─ .env.example              # Frontend env template
│  └─ .env.production           # Production env (if used)
│
├─ server/                      # Backend (Node + Express)
│  ├─ src/
│  │  ├─ config/                # DB config (Mongo connection)
│  │  ├─ controllers/           # Request handlers (includes Google auth controller)
│  │  ├─ routes/                # Express route modules
│  │  └─ ...
│  ├─ app.js                    # Express app entrypoint
│  ├─ package.json
│  ├─ .env.example              # Backend env template
│  └─ vercel.json               # Server deployment config (Vercel)
│
├─ START_HERE.md                # Setup steps (Google OAuth + run locally)
├─ IMPLEMENTATION_SUMMARY.md    # What was implemented + auth flow + endpoints
├─ VISUAL_FLOW_GUIDE.md         # Visual/ASCII guide for auth flow
├─ package.json
└─ vercel.json
```

---

## How the App Works (High Level)

1. User clicks **Sign in with Google** in the frontend.
2. Google returns an **ID token** to the client.
3. Client calls the backend endpoint:
   - `POST /api/users/google-auth`
4. Backend verifies the token, creates/finds the user in MongoDB, then returns:
   - an **app JWT token** + user profile.
5. Frontend stores the JWT and uses it in future requests:
   - `Authorization: Bearer <token>`

---

## API (Server)

The Express server exposes these route groups (mounted in `server/app.js`):

- `/api/transactions`
- `/api/users`
- `/api/categories`
- `/api/data`
- `/api/budgets`

Health endpoints:
- `GET /` basic status + endpoints list
- `GET /api/health` server + DB connection status

---

## Run Locally

### 1) Configure Environment Variables

Follow the detailed guide in `START_HERE.md`.

**Backend (`server/.env`)**
- `MONGO_URI`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

**Frontend (`client/.env`)**
- `VITE_GOOGLE_CLIENT_ID`
- (optional) `VITE_API_URL` (if your frontend expects an explicit API base URL)

### 2) Install & Start

**Backend**
```bash
cd server
npm install
npm start
```

**Frontend**
```bash
cd client
npm install
npm run dev
```

Open:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

---

## Notes
- Do **not** commit real `.env` files. Use `.env.example` as a template.
- If you hit OAuth errors like `redirect_uri_mismatch`, re-check your Google Cloud Console authorized origins/redirect URIs (see `START_HERE.md`).
