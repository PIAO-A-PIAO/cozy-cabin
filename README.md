# README.md

# Cozy Cabin

Cozy Cabin is a cozy virtual study space designed to help people focus, build sustainable study habits, and eventually connect with others through meaningful interactions.

Inspired by the atmosphere of a quiet cabin, Cozy Cabin combines productivity tools, relaxing environments, and thoughtful social experiences into a single application. Rather than being just another Pomodoro timer, the long-term vision is to create a digital space where users can study, relax, exchange letters with pen pals, enjoy ambient music, play small games, and take care of a virtual companion.

The project is being developed incrementally through a series of development sprints, with every sprint delivering a complete, production-ready feature.

---

## Live Demo

**Frontend**

https://cozy-cabin-kappa.vercel.app/

**Backend API**

https://cozy-cabin-production.up.railway.app/

---

## Current Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Protected routes
* Logout

### Pomodoro Timer

* 25-minute focus timer
* 5-minute break timer
* Start, pause, resume, and reset controls
* Automatic transition between focus and break sessions
* Timer persistence across page refreshes
* Session completion notifications

---

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript

### Backend

* NestJS
* Prisma ORM
* PostgreSQL
* JWT Authentication

### Deployment

* Vercel
* Railway

---

## Project Structure

```text
/
├── apps/
│   ├── web/        # Next.js frontend
│   └── server/     # NestJS backend
└── docs/           # Product documentation and ADRs
```

---

## Development Progress

### Sprint 0 ✅ Project Foundation

* Repository setup
* Project architecture
* PostgreSQL database
* Deployment with Railway and Vercel
* Product documentation
* Architecture Decision Records (ADRs)

### Sprint 1 ✅ Authentication

* User registration
* User login
* JWT authentication
* Protected routes
* Prisma integration
* Frontend/backend communication

### Sprint 2 ✅ Pomodoro Timer

* Focus and break timers
* Pause, resume, and reset controls
* Automatic session transitions
* Persistent timer state after refresh
* Session completion notifications
* Production deployment verification

---

## Roadmap

### Milestone 1 — Core Productivity

* Authentication
* Pomodoro timer
* Study session persistence
* Dashboard
* Study history

### Milestone 2 — Cozy Experience

* Ambient music
* Cozy study environments
* User preferences
* Daily goals
* Custom timer settings

### Milestone 3 — Community

* Pen pal matching
* Letters and inbox
* User profiles

### Milestone 4 — Relaxation

* Mini games
* Virtual pet
* Long-term progression system

### Milestone 5 — AI Features

* AI productivity assistant
* Personalized study insights
* Smart recommendations

---

## Project Status

Cozy Cabin is currently under active development. New features are introduced through incremental development sprints, with each sprint delivering a complete vertical slice that is deployed and validated before the next feature begins.
