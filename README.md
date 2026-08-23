# CarDeck - Car Dealership Inventory System

CarDeck is a full-stack **Car Dealership Inventory Management System** developed as part of a TDD kata. The application allows customers to register, authenticate, browse vehicles, search inventory, purchase vehicles, and view their purchase history.

The system also provides an **Admin Dashboard** where administrators can manage dealership inventory, add new vehicles, update vehicle information, delete vehicles, and restock available vehicles.

The application uses a React frontend connected to a Node.js/Express REST API with Prisma and SQLite for data persistence.

---

## Tech Stack

### Frontend

* React
* Vite
* TypeScript
* React Router
* Axios
* CSS3
* Responsive UI

### Backend

* Node.js
* Express
* TypeScript
* Prisma ORM
* SQLite
* JWT Authentication
* bcrypt
* Zod

### Testing

* Jest
* Supertest

---

## Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Password hashing using bcrypt
* Protected routes
* Role-based authorization

### Customer Features

* User dashboard
* Browse available vehicles
* Search vehicles
* Filter vehicle inventory
* View vehicle details
* Purchase vehicles
* Stock quantity decreases after purchase
* View purchase history

### Admin Features

* Admin dashboard
* View inventory statistics
* Add vehicles
* Update vehicles
* Delete vehicles
* Restock vehicles
* Manage vehicle inventory
* Admin-only protected routes

### UI Features

* Responsive React dashboard
* Sidebar navigation
* Navigation bar
* Vehicle cards/tables
* Statistics cards
* Loading states
* Error handling
* Empty states
* Responsive design for desktop, tablet, and mobile

---

## Project Structure

```text
vehicle-management-system/
│
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── tests/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── screenshots/
│
├── README.md
├── PROMPTS.md
└── .gitignore
```

---

## API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Vehicles

```text
GET    /api/vehicles
GET    /api/vehicles/search
GET    /api/vehicles/:id
POST   /api/vehicles
PUT    /api/vehicles/:id
DELETE /api/vehicles/:id
```

### Vehicle Operations

```text
POST /api/vehicles/:id/purchase
POST /api/vehicles/:id/restock
```

### Purchases

```text
GET /api/purchases
GET /api/purchases/:id
```

---

# Local Setup

## Prerequisites

Install the following before running the project:

* Node.js
* npm
* Git

Check your versions:

```bash
node --version
npm --version
```

---

## Backend Setup

Open a terminal and navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Generate the Prisma client:

```bash
npx prisma generate
```

Run the database migration:

```bash
npx prisma migrate dev
```

If the project provides the admin creation script, create the admin account:

```bash
npm run admin
```

Start the backend:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:3000
```

---

## Default Admin Account

If the admin creation script is used, the default administrator account is:

```text
Email: admin@vehicle.com
Password: admin123
```

For production use, replace default credentials with secure credentials.

---

## Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Vite will display the frontend URL in the terminal.

Usually it will be:

```text
http://localhost:5173
```

---

## Frontend API Configuration

The frontend communicates with the backend through:

```text
http://localhost:3000/api
```

To configure another backend URL, create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:3000/api
```

---

# Running the Application

Start the backend first:

```bash
cd backend
npm run dev
```

Then start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open the Vite URL shown in the frontend terminal.

---

# Testing

## Backend Tests

Run:

```bash
cd backend
npm test
```

Latest verified result:

```text
Test Suites: 6 passed, 6 total
Tests: 34 passed, 34 total
```

---

## Frontend Build

Run:

```bash
cd frontend
npm run build
```

Expected result:

```text
vite built successfully
```

---

## Backend TypeScript Check

Run:

```bash
cd backend
npx tsc --noEmit
```

The TypeScript compilation should complete without errors.

---

# Screenshots


### Login
<img width="913" height="767" alt="Screenshot 2026-08-23 123314" src="https://github.com/user-attachments/assets/b8e5d0f8-c1ab-459c-84d4-6c601348aac5" />

### User Dashboard
<img width="1913" height="915" alt="Screenshot 2026-08-23 123339" src="https://github.com/user-attachments/assets/3ebf510f-5086-4d85-ab43-cf91cc5883b2" />


### Vehicle Catalogue
<img width="1908" height="900" alt="Screenshot 2026-08-23 123404" src="https://github.com/user-attachments/assets/6d7cc087-75b8-43da-b346-19881ed025e2" />
<img width="1904" height="906" alt="Screenshot 2026-08-23 123427" src="https://github.com/user-attachments/assets/55073571-13aa-4272-8e64-d453a0b089f9" />


### Purchase History
<img width="1917" height="906" alt="Screenshot 2026-08-23 123443" src="https://github.com/user-attachments/assets/10ff8ab8-ae41-4312-9089-f19e100f4f32" />


### Admin Dashboard
<img width="1914" height="908" alt="Screenshot 2026-08-23 123456" src="https://github.com/user-attachments/assets/e1b34a5f-6777-4d74-af83-49188438c937" />


### Manage Vehicles
<img width="1918" height="903" alt="Screenshot 2026-08-23 123512" src="https://github.com/user-attachments/assets/73438408-d603-452a-8454-66f36383909c" />


---

# My AI Usage

I used ChatGPT/Codex and other AI coding assistance during the development of this project.

AI assistance was used to:

* Analyze the existing project structure
* Identify backend and frontend integration issues
* Debug authentication and API problems
* Improve React pages and dashboard UI
* Connect frontend pages with backend APIs
* Implement and improve vehicle management workflows
* Improve error handling and validation
* Assist with automated testing
* Debug TypeScript and runtime errors
* Review the final project structure

AI assistance helped reduce repetitive development work and speed up debugging. I reviewed the generated changes, ran the project locally, executed the test suite, and verified the main user and administrator workflows.

The raw AI prompts/chat logs used during development are maintained in the root `PROMPTS.md` file as required by the kata.

---

# GitHub Repository

Repository:

```text
https://github.com/Manasa1128/vehicle-management-system
```

---

# Project Status

The project includes:

* Full-stack React and Node.js architecture
* JWT authentication
* Role-based authorization
* Vehicle inventory management
* Vehicle search and filtering
* Vehicle purchasing
* Purchase history
* Admin inventory management
* Prisma database integration
* Automated backend tests
* Responsive frontend dashboard

---

# Future Improvements

Possible future improvements include:

* Cloud database
* Image upload for vehicles
* Advanced analytics
* Sales charts
* Email notifications
* Payment gateway integration
* Cloud deployment
* CI/CD pipeline

---

# AI Prompt Logs

The repository contains a root-level `PROMPTS.md` file containing the raw AI prompts/chat logs used during development.

These logs are included to satisfy the AI usage documentation requirement of the TDD kata.
