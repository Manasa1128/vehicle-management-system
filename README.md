# CarDeck - Car Dealership Inventory System

CarDeck is a full-stack dealership inventory application built for the TDD kata. It includes JWT authentication, role-based admin controls, vehicle search, purchases, restocking, and a responsive React dashboard.

## Tech Stack

- Backend: Node.js, Express, TypeScript, Prisma, SQLite, JWT, Zod
- Frontend: React, Vite, Tailwind, CSS3 responsive UI
- Testing: Jest, Supertest

## Features

- Register and login with token-based authentication.
- Protected vehicle listing and search.
- Admin-only create, update, delete, and restock actions.
- Customer purchase flow that decreases stock quantity.
- Purchase history for the logged-in user.
- Dashboard statistics from live API data.

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/vehicles`
- `GET /api/vehicles`
- `GET /api/vehicles/search`
- `GET /api/vehicles/:id`
- `PUT /api/vehicles/:id`
- `DELETE /api/vehicles/:id`
- `POST /api/vehicles/:id/purchase`
- `POST /api/vehicles/:id/restock`
- `GET /api/purchases`
- `GET /api/purchases/:id`

## Local Setup

Install backend dependencies:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run admin
npm run dev
```

The backend runs at `http://localhost:3000`.

Default admin account created by `npm run admin`:

- Email: `admin@vehicle.com`
- Password: `admin123`

Install frontend dependencies:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at the Vite URL shown in the terminal. By default it calls `http://localhost:3000/api`. To use a different backend URL, create `frontend/.env` with:

```bash
VITE_API_URL=http://localhost:3000/api
```

## Test Report

Backend test command:

```bash
cd backend
npm test
```

Latest result:

```text
Test Suites: 6 passed, 6 total
Tests:       34 passed, 34 total
```

Frontend build command:

```bash
cd frontend
npm run build
```

Latest result:

```text
vite built successfully
```

Backend compile check:

```bash
cd backend
npx tsc --noEmit
```

Latest result: passed.

## Screenshots

Add screenshots after running the app locally:

- Login page
- Vehicle catalogue
- Admin inventory management
- Purchase history

## My AI Usage

I used ChatGPT/Codex as an AI coding assistant for this project. The assistant helped inspect the existing backend and frontend structure, identify integration mismatches, align API endpoints with the kata problem statement, implement React pages, improve styling, add tests for the required inventory routes, and verify the project with test/build commands.

AI improved my workflow by speeding up boilerplate-heavy work and helping catch route-contract mistakes quickly. I still reviewed the generated changes, ran the test suite, and validated that backend and frontend behavior matched the problem statement.

## Notes

The repository includes a root `PROMPTS.md` for the raw AI prompt log requirement. Add your complete chat transcript or public chat links there before submission.
