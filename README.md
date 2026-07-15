# Cozy Cabin

Cozy Cabin is a cozy virtual study space designed to help people focus, relax, and connect with others.

Inspired by the atmosphere of a quiet cabin, the project combines productivity, ambient music, and meaningful interactions into a single experience. Users can study with a built-in Pomodoro timer, enjoy relaxing environments, exchange letters with pen pals around the world, and discover small moments of comfort throughout the day.

This repository contains the source code for the Cozy Cabin project, which is being built incrementally through a series of development sprints.

## Live Demo

Frontend:
https://cozy-cabin-kappa.vercel.app/

Backend:
https://cozy-cabin-production.up.railway.app/

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript

### Backend

- NestJS
- Prisma
- PostgreSQL
- JWT Authentication

### Deployment

- Vercel
- Railway

## Project Structure

```
/
├── frontend/      # Next.js application
├── backend/       # NestJS API
└── docs/          # Product documentation and ADRs
```

## Getting Started

### Clone the repository

```bash
git clone ...
```

### Install dependencies

Frontend

```bash
cd frontend
npm install
```

Backend

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the backend.

```
DATABASE_URL=...
JWT_SECRET=...
```

Create a `.env.local` file in the frontend.

```
NEXT_PUBLIC_API_URL=...
```

### Run locally

Backend

```bash
npm run start:dev
```

Frontend

```bash
npm run dev
```

## Current Status

Sprint 0 ✅ Project foundation

- Project setup
- Deployment
- Documentation
- Architecture decisions

Sprint 1 ✅ Authentication

- User registration
- Login / Logout
- JWT authentication
- Protected routes
- PostgreSQL with Prisma
- Frontend / Backend integration

Sprint 2 🚧 Coming next

- Pomodoro Timer
- User dashboard
- Cozy study room