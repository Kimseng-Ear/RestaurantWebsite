# Leisure Lake Website

Full-stack website for Leisure Lake Restaurant with:
- A React + Vite frontend
- A Node.js + Express + MongoDB backend API
- Firebase Hosting for the frontend
- Render deployment support for the backend

Live site: <https://leisure-lake-restaurant.web.app/>

## Tech Stack

### Frontend (`client`)
- React
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend (`server`)
- Node.js
- Express
- MongoDB + Mongoose
- JWT authentication
- Multer + Cloudinary (media uploads)

## Project Structure

```text
Leisure_Lake_Website/
├─ client/                 # React frontend
├─ server/                 # Express API
├─ firebase.json           # Firebase Hosting config (serves client/dist)
├─ render.yaml             # Render service blueprint for backend
└─ package.json            # Root scripts for full-stack workflow
```

## Prerequisites

- Node.js 18+ (recommended LTS)
- npm
- MongoDB (local or cloud)

## Installation

Install dependencies for root, client, and server:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

## Environment Variables

Create `server/.env` (you can copy from `server/env.example`):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/leisure-lake
JWT_SECRET=your-strong-secret
NODE_ENV=development
```

Frontend API base URL is read from:

```env
VITE_API_URL=http://localhost:5000/api
```

If `VITE_API_URL` is not set, the frontend defaults to `http://localhost:5000/api`.

## Running Locally

### Start client + server together (recommended)

From the repository root:

```bash
npm run dev
```

This runs:
- `client` on Vite dev server
- `server` with nodemon

### Start services separately

Frontend:

```bash
npm run dev --prefix client
```

Backend:

```bash
npm run dev --prefix server
```

## Available Scripts

From repo root:

- `npm run dev` - Start client and server concurrently
- `npm run seed` - Run backend seed script
- `npm start` - Start backend server (`server/server.js`)
- `npm run deploy` - Build frontend and deploy to Firebase Hosting

From `client`:

- `npm run dev` - Start Vite dev server
- `npm run build` - Build production frontend to `client/dist`
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

From `server`:

- `npm run dev` - Start backend with nodemon
- `npm start` - Start backend in normal mode
- `npm run seed` - Seed database data
- `npm run backup` - Run backup script

## API and Routing Notes

- Backend base URL (local): `http://localhost:5000`
- API prefix: `/api`
- Main route groups:
  - `/api/auth`
  - `/api/menu`
  - `/api/reservations`
  - `/api/reviews`
  - `/api/notifications`
  - `/api/gallery`

Health endpoint:

- `GET /` returns API status JSON.

## Deployment

### Frontend (Firebase Hosting)

The `firebase.json` is configured to:
- Serve `client/dist`
- Rewrite all routes to `index.html` (SPA routing)

Deploy command:

```bash
npm run deploy
```

### Backend (Render)

`render.yaml` defines a Docker web service named `leisure-lake-api`.

Set these environment variables in Render dashboard:
- `MONGO_URI`
- `JWT_SECRET`
- `NODE_ENV=production`
- `PORT=8080` (or your preferred Render port)

## Notes

- Keep secrets out of git (`.env` files should not be committed).
- If MongoDB connection fails, verify `MONGO_URI` and network access.
- If client cannot reach API in production, verify `VITE_API_URL` points to deployed backend.
