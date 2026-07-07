# Tech Stack Decisions

> This document records the rationale behind the technology choices for the Cozy Cabin project. The goal is not only to document what technologies are used, but also *why* they were selected over other alternatives.

---

## Project Goals

Cozy Cabin is designed to be more than a portfolio project. It aims to simulate the development of a real-world production application while demonstrating modern full-stack software engineering practices.

The primary goals are:

* Build a production-ready full-stack web application
* Demonstrate software architecture and system design skills
* Follow industry-standard development workflows
* Keep the project maintainable and scalable
* Deploy a working product that real users can access

---

# Frontend

## Selected

* Next.js
* React
* TypeScript
* Tailwind CSS

## Why
Next.js was chosen because it provides a complete framework for building production-ready web applications, including routing, server-side rendering, API integration, and deployment support.

TypeScript improves code quality and maintainability by providing static typing.

Tailwind CSS enables rapid UI development while maintaining a consistent design system.

---

# Backend

## Selected

* NestJS

## Why

The backend handles business logic, API endpoints, authentication, validation, and communication with the database.

NestJS was selected because it encourages a modular architecture that closely resembles enterprise applications. Its structure makes the project easier to maintain as it grows.

### Why a TypeScript/JavaScript Backend?

Although many excellent backend technologies exist—such as Java, C#, Python, and Go—I chose a TypeScript-based backend because the frontend is also built with TypeScript.

Using the same language across the entire application allows me to maintain a single mental model throughout development. Data models such as users, letters, and Pomodoro sessions can remain consistent between the frontend and backend, reducing duplication and minimizing type-related errors.

For a solo developer, this significantly lowers the cognitive overhead of switching between different programming languages and development paradigms. Instead of writing React and TypeScript on the frontend while switching to Java or Python for the backend, I can focus on designing the application's architecture and implementing its features using a consistent technology stack.

This decision prioritizes developer productivity, maintainability, and a smoother development workflow over learning multiple backend languages within the same project.



# Database

## Selected

* PostgreSQL

## Why

The application contains many entities that naturally relate to one another, such as users, letters, friendships, Pomodoro sessions, achievements, and user settings. A relational database models these relationships clearly and makes querying, filtering, and maintaining data straightforward.

Another important design decision is that the database will only store application data and metadata—not large files.

For example, if a user uploads a profile picture or a custom room background, PostgreSQL will store information such as the file URL, upload time, and owner, while the actual image file will be stored separately in a dedicated file storage service.

Separating structured data from file storage improves scalability, simplifies backups, and follows common architecture used in modern web applications.


# File Storage

## Selected

* Cloudinary (initially)

## Why

A dedicated file storage service is responsible for storing user-uploaded assets such as profile pictures, room backgrounds, images, and other media files.

Keeping files separate from the database allows each system to focus on what it does best. The database manages structured application data, while the storage service efficiently delivers large files.

Cloudinary was selected because it provides a simple developer experience while also offering built-in image optimization, automatic resizing, compression, and global content delivery. These features improve loading performance without requiring additional infrastructure.

Using a managed storage service also reduces operational complexity and allows development to focus on product features rather than file management.



# ORM

## Selected

* Prisma

## Why

Prisma simplifies database access while providing strong TypeScript support, schema management, and database migrations.

It allows development to focus on application logic instead of writing repetitive SQL.


# Authentication

## Selected

* Clerk

## Why

Authentication is a security-critical component.

Instead of implementing password hashing, session management, email verification, OAuth providers, and security protections from scratch, Clerk provides a secure and production-ready solution.

This allows development effort to focus on the application's core features.


---

# Deployment

## Selected

* Vercel (Frontend)
* Railway or Render (Backend)

## Why

The deployment platform should require minimal infrastructure management while supporting continuous deployment from GitHub.

This enables the project to follow modern CI/CD practices from the beginning.

---

# Guiding Principles

The technologies in this project were selected based on the following priorities:

1. Production readiness over simplicity.
2. Industry adoption over novelty.
3. Maintainability over short-term convenience.
4. Scalability over premature optimization.
5. Learning software engineering practices rather than only building features.

These decisions may evolve as the project grows, and this document should be updated whenever a major architectural decision changes.
