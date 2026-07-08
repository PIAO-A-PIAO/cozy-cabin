# ADR-001: Frontend and Backend Framework Choice

## Decision

The project will use the following structure:

```text
apps/
  web/
  server/

docs/
```

The frontend application will be built with **Next.js**.

The backend application will be built with **NestJS**.

The project will use `apps/web` and `apps/server` instead of `frontend` and `backend`.

## Why Next.js

Next.js was chosen because it is a complete React-based web application framework, not just a UI library.

Compared with using React alone, Next.js provides built-in routing, better support for production deployment, server-side rendering options, data fetching patterns, and a more complete application structure.

For Cozy Cabin, this is useful because the application will eventually include pages such as a landing page, sign-in flow, dashboard, Pomodoro page, and user settings. Next.js gives the frontend a clear structure from the beginning.

## Why NestJS

NestJS was chosen because it encourages a structured backend architecture.

Compared with a lighter framework such as Express, NestJS gives the backend clearer organization around modules, controllers, and services. This is helpful because Cozy Cabin will eventually have separate areas such as users, Pomodoro sessions, letters, study history, and future AI-related features.

NestJS is also TypeScript-first, which keeps the frontend and backend in the same language ecosystem. This reduces context switching and makes the project easier to maintain as a solo developer.

## Why `apps/web` and `apps/server` Instead of `frontend` and `backend`

The names `frontend` and `backend` are understandable, but they become less flexible as the project grows.

The `apps/` structure makes it clear that this repository may contain multiple applications over time. For example, the project could later add an admin app, mobile app, or worker service.

Using `web` and `server` is also more specific:

* `web` means the browser-facing web application.
* `server` means the backend API service.

This keeps the structure simple now while leaving room for future growth.