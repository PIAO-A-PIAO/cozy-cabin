# ADR-002: Initial Deployment Decisions

## Date

2026-07-08

## Decision

The project will use:

* **Vercel** for the frontend
* **Railway Hobby** for the backend and PostgreSQL database

AWS is intentionally deferred to a later stage of the project.

## Why Vercel

Next.js is the frontend framework used by this project, and Vercel provides excellent integration with GitHub and the Next.js ecosystem.

Automatic deployments, preview deployments, and simple configuration allow development to focus on the product instead of deployment infrastructure.

## Why Railway Hobby

The project initially considered Railway's free trial. However, the trial had already expired before development began.

Render was then evaluated as an alternative because it offers a free web service.

After comparing both options, Railway Hobby was selected.

Although Railway requires a monthly subscription, it provides a more consistent development experience. The backend service and PostgreSQL database can be managed within the same platform, reducing operational complexity.

For a project expected to be maintained over a long period, paying a small monthly cost is considered a reasonable trade-off for improved developer experience and simpler infrastructure.

The goal of Cozy Cabin is to demonstrate software engineering and product development, not to optimize hosting costs at the expense of development efficiency.

## Alternatives Considered

### Railway Free Trial

This was the original plan.

However, the free trial had already expired before the deployment phase, making it unavailable for the project.

### Render Free

Render provides a useful free hosting option and remains a reasonable platform for small projects.

However, its free services have limitations such as service sleeping after periods of inactivity, and the free PostgreSQL offering is intended primarily for temporary development environments.

Using different providers for the backend and database was also considered, but this would introduce additional operational complexity without providing significant benefits for this project.

### AWS

AWS provides significantly more flexibility, scalability, and production-level infrastructure than either Railway or Render.

However, AWS also introduces considerably more operational complexity. Infrastructure management, networking, security configuration, and cloud architecture would become part of the project much earlier than necessary.

At this stage, those activities would distract from the primary objective: building a complete, production-quality application.

## Future Reconsideration

This decision should be revisited if one or more of the following occurs:

* The project begins serving a significantly larger number of users.
* More advanced networking or infrastructure customization becomes necessary.
* Docker and container orchestration become learning objectives.
* Demonstrating enterprise cloud architecture becomes an explicit portfolio goal.

At that stage, the project may migrate to AWS.

A future AWS deployment would likely include services such as:

* EC2 or ECS for application hosting
* RDS for PostgreSQL
* S3 for object storage
* CloudFront for content delivery
* CloudWatch for monitoring and logging

This migration is intentionally postponed because it represents a different learning objective. The current focus is building a complete, maintainable product. Production-grade cloud infrastructure will be introduced only after the application itself is mature.
