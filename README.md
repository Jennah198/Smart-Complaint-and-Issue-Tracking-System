# ASTU Smart Complaint & Issue Tracking System

## Project Overview

The **ASTU Smart Complaint & Issue Tracking System** is a web-based platform designed to help students, staff, and administrators manage campus-related complaints efficiently. The system ensures transparency, structured workflow, and accountability in handling issues such as dormitory maintenance, laboratory equipment problems, internet connectivity issues, and classroom facility damage.

This project uses a modern **MERN/NestJS + Prisma + PostgreSQL stack** with TypeScript, AI-assisted guidance, and multi-tenant support.

---

## Features

### Student

- Submit complaints via categorized forms
- Upload files/images with each complaint
- Track complaint status (Open → In Progress → Resolved)
- View complaint history
- AI chatbot assistance (FAQ & guidance)
- Rate resolution quality

### Department Staff

- View complaints assigned to their department
- Update ticket status and add remarks
- Track resolution workflow

### Administrator

- Manage all complaints and users
- Create and manage categories and departments
- Monitor system metrics via analytics dashboard:
  - Total complaints
  - Complaints per category
  - Resolution rate
  - Average resolution time
  - Open vs Closed ratio
- Receive notifications of new or updated tickets

---

## Tech Stack

- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma 7 with `@prisma/adapter-pg`
- **AI Assistance**: API-based chatbot with category suggestions and FAQ
- **File Storage**: Cloudinary (or local server as fallback)
- **Authentication**: JWT + refresh token rotation
- **Notifications**: In-app (DB-stored) + email (Nodemailer)

---

## Project Structure

```text
astu-smart-complaint-backend/
│
├── src/
│   ├── prisma/           # Prisma service wiring & client
│   ├── auth/             # Authentication module (JWT + guards)
│   ├── users/            # User roles helpers
│   ├── complaint/        # Complaint module, DTOs, controllers
│   ├── app.controller.ts # Health and smoke-test endpoints
│   └── main.ts           # NestJS bootstrap & validation pipe
│
├── prisma/
│   ├── schema.prisma     # Prisma schema definitions
│   └── prisma.config.ts  # Prisma 7 config with PrismaPg adapter
│
├── test/
│   └── app.e2e-spec.ts   # Root e2e smoke test
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## Environment Variables

Copy `.env.example` to `.env` and keep the `POSTGRES_*`, `DATABASE_URL`, and `JWT_SECRET` values in sync with your Docker/Postgres setup:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=astu_smart_complaint
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/astu_smart_complaint
PORT=5000
JWT_SECRET=your_jwt_secret
```

`PORT` defaults to `3000` when unset, and `JWT_SECRET` falls back to `supersecret` for local/test use only.

## Local Database with Docker

`docker compose` boots a Postgres container that matches the defaults used in `.env.example`.

1. `docker compose up -d db`
2. Wait until `docker compose ps` shows `db` is healthy (`docker compose logs db` can be used if it takes longer).
3. Run `docker compose down` when you are done.

Mounts are persisted in `db-data`, so data cycles through restarts automatically.

## Installation & Setup

1. `npm install`
2. `npx prisma generate`
3. `npx prisma migrate dev --name init`
4. `npm run start:dev`

The database adapter expects a running Postgres instance that matches `DATABASE_URL`.

## Usage

- Health check: `GET /health`
- Smoke test: `GET /users-test`
- Submit complaints: `POST /complaints`
- Staff/Admin flows: `PATCH /complaints/:id/status` and `GET /complaints` (requires `STAFF`/`ADMIN` roles)

Authenticate with `POST /auth/login`/`POST /auth/register` to receive a JWT.

## Testing

- `npm test` (Jest) – depends on the Docker Postgres instance running.
- `npm run test:watch` – for iterative development.
- `npm run lint` – lints `src`/`test`.

## Contribution

1. Fork the repo and create a feature branch.
2. Keep Prisma migrations, clients, and TypeScript definitions in sync.
3. Run `npm test` and `npm run lint` before opening a pull request.

## Future Enhancements

- Full frontend integration (Next.js + TypeScript)
- Real-time notifications (WebSockets)
- SLA auto-escalation for unresolved tickets
- AI-based complaint categorization improvements
- Multi-tenant support for multiple organizations
