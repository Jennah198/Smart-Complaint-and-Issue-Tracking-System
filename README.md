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

astu-smart-complaint-backend/
│
├── src/
│ ├── prisma/ # PrismaService & client
│ ├── auth/ # Authentication module
│ ├── users/ # User module
│ ├── complaints/ # Complaint module
│ ├── notifications/ # Notification module
│ ├── app.controller.ts # Test and health endpoints
│ └── main.ts # Application bootstrap
│
├── prisma/
│ ├── schema.prisma # Prisma schema definitions
│ └── prisma.config.ts # Prisma 7 config with adapter
│
├── .env # Environment variables
├── tsconfig.json # TypeScript config
├── package.json
└── README.md

---

## Environment Variables

Create a `.env` file in the root directory with the following:

```env
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/astu_smart_complaint
PORT=5000
JWT_SECRET=your_jwt_secret
Installation & Setup

Clone the repository:

git clone https://github.com/Jennah198/Smart-Complaint-and-Issue-Tracking-System.git
cd astu-smart-complaint-backend

Install dependencies:

npm install

Generate Prisma client:

npx prisma generate

Run database migrations:

npx prisma migrate dev --name init

Start the development server:

npm run start:dev

Test endpoints:

Health check: http://localhost:5000/health

Users test: http://localhost:5000/users-test

Usage

Access the API via Postman or frontend application.

Create users and complaints to test workflows.

Admin can view analytics dashboards and metrics.

AI chatbot assists students with FAQ and category suggestions.

Contribution

Fork the repo, create a feature branch, commit your changes, and open a pull request.

Ensure all migrations and Prisma clients are up to date.

Use TypeScript and follow NestJS module conventions.

Future Enhancements

Full frontend integration (Next.js + TypeScript)

Real-time notifications (WebSockets)

SLA auto-escalation for unresolved tickets

AI-based complaint categorization improvements

Multi-tenant support for multiple organizations

