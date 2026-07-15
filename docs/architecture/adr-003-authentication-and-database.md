# ADR-002: Authentication and Database

**Date:** 2026-07-15

## Decision

Cozy Cabin will initially use a custom email-and-password authentication system.

User records will be stored in PostgreSQL and accessed through Prisma. Each user will have a unique email address and a hashed password.

Passwords will never be stored in plain text. The NestJS backend will hash passwords before saving them to the database and will compare password hashes during login.

After a successful login, the NestJS backend will issue a JSON Web Token, or JWT. The frontend will use this token to authenticate future requests to protected backend endpoints.

Protected backend routes will use a NestJS authentication guard to verify the JWT before allowing access.

The initial authentication flow includes:

* User registration with email and password.
* User login with email and password.
* JWT generation after successful login.
* Retrieval of the authenticated user through a protected endpoint.
* Frontend route protection.
* User logout by removing the stored authentication state.

The frontend and backend are deployed separately. The Next.js frontend is deployed on Vercel, while the NestJS backend and PostgreSQL database are hosted on Railway. Cross-origin requests between the frontend and backend are allowed through the backend CORS configuration.

## Reasons

This approach was selected because it provides direct experience with the main parts of an authentication system, including password hashing, database queries, JWT generation, request authentication, and protected routes.

Implementing the initial flow directly also makes the system easier to understand. The project does not depend on a third-party identity provider during its earliest stage, and the authentication behavior can be customized according to the application’s needs.

JWT authentication works well with the current architecture because the frontend and backend are deployed as separate services. The frontend can send the token with API requests, while the backend remains responsible for deciding whether each request is authenticated.

PostgreSQL and Prisma were selected because the project already uses a relational database and will later need relationships between users, Pomodoro sessions, letters, preferences, and other application data.

## In the future

### Clerk

Clerk could provide registration, login, session management, email verification, password reset, and OAuth login with less custom code.

However, using Clerk at this stage would hide several parts of the authentication process that are valuable to understand. It would also introduce an external service before the MVP requires advanced authentication features.

Clerk may still be introduced later if Cozy Cabin requires social login, stronger session management, email verification, account recovery, or faster production hardening.

### OAuth-only authentication

The application could allow users to sign in with providers such as Google or GitHub.

This was not selected for the initial version because it would add third-party provider configuration and redirect flows before the basic user system is complete.

### Server-side sessions

The backend could store sessions in the database or in Redis and send a session identifier to the browser.

This approach provides stronger server-side control over session invalidation, but it requires additional session storage and infrastructure. JWT authentication is currently simpler for the project’s small scale and separated frontend-backend architecture.

## Conclusion

Future improvements may include:

* Email verification.
* Password reset.
* Refresh tokens or improved session management.
* Stronger password requirements.
* Rate limiting on registration and login endpoints.
* Account deletion.
* Migration to HTTP-only cookies if tokens are currently stored in browser-accessible storage.
* Migration to Clerk or another managed identity provider.
* OAuth login through providers such as Google.