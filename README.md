# 📦 Fullstack RBAC App (React + Node.js + PostgreSQL + Prisma)

A simple full-stack Role-Based Access Control (RBAC) system built with:
* React + TypeScript (Frontend)
* Node.js + Express (Backend)
* PostgreSQL (Database)
* Prisma ORM
* JWT Authentication

---

## 🚀 Features
* Admin-style RBAC system
* Organizations, Teams, Users, Roles
* Role-based permissions (read / CRUD)
* Login authentication with JWT
* Content filtering per user
* React Native sample screen included
* Pre-seeded database with sample users

---

## 📁 Project Structure
```text
rbac-app/
├── backend/
└── frontend/
```

---

## ⚙️ Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```
*Required packages included:*
```bash
npm install express cors dotenv bcryptjs jsonwebtoken prisma @prisma/client
npm install -D typescript ts-node-dev @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken
```

### 2. Setup Environment Variables
Create a `.env` file inside the `/backend` folder:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/rbac_db"
JWT_SECRET="supersecret"
PORT=8000
```

### 3. Setup Database (PostgreSQL)
Make sure PostgreSQL is running and create the database:
```sql
CREATE DATABASE rbac_db;
```

### 4. Prisma Setup
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Seed Database (Dummy Data)
Create your seed file at `backend/prisma/seed.ts`, then run:
```bash
npx prisma db seed
```
*Note: If `ts-node` is missing, install it via:*
```bash
npm install -D ts-node
```

### 6. Start Backend
```bash
npm run dev
```
Backend runs on: **[http://localhost:8000](http://localhost:8000)**

---

## 🎯 Backend Scripts (package.json)
```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

---

## 💻 Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```
*Required packages included:*
```bash
npm install axios react-router-dom zustand
```

### 2. Start Frontend
```bash
npm run dev
```
Frontend runs on: **[http://localhost:5173](http://localhost:5173)**

---

## 🔌 Frontend API Configuration
Create a file at `src/services/api.ts`:

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api
```

---

## 👤 Sample Login Accounts
After seeding the database, you can use these accounts to log in:

* **Viewer (Read-only)**
  * **Email:** `viewer@example.com`
  * **Password:** `password123`
* **Editor (Full Access)**
  * **Email:** `editor@example.com`
  * **Password:** `password123`

---

## 🌱 Database Seed Data
The seed script automatically creates the following entities:

* **Organization**
  * Acme Corporation
* **Teams**
  * Engineering
  * Marketing
* **Roles**
  * `viewer` → read only
  * `editor` → read, create, update, delete
* **Users**
  * `viewer@example.com`
  * `editor@example.com`
* **Content**
  * Welcome Content (Viewer)
  * Engineering Update (Editor)
  * Company Announcement (Editor)

---

## 🧪 Testing Flow
1. Start **PostgreSQL**.
2. Run the backend (`npm run dev` in `/backend`).
3. Run the frontend (`npm run dev` in `/frontend`).
4. Open your browser and go to **[http://localhost:5173](http://localhost:5173)**.
5. Login using the sample accounts.
6. View and test the role-based content access.

---

## 🔐 Authentication Flow
```text
Login ──> JWT Token ──> Stored in localStorage ──> API Requests ──> Protected Routes
```

---

## 📡 API Endpoints

### Auth
* `POST /api/auth/login`

### Content (Protected)
* `GET    /api/content`
* `POST   /api/content`
* `PUT    /api/content/:id`
* `DELETE /api/content/:id`

---

## 🧠 Tech Highlights
* Prisma ORM for database modeling
* JWT authentication
* Role-based middleware
* Axios interceptor for auth
* Zustand state management
* React Router navigation
* Modular Express architecture

---

## 🧩 Optional Improvements
* Refresh token system
* Admin dashboard UI
* Pagination for content
* Docker setup
* Unit testing (Jest)
* RBAC UI management panel
* Audit logs

---

## 📌 Notes
* Always ensure the backend runs on port `8000`.
* Ensure PostgreSQL is running before starting the backend server.
* Run `npx prisma generate` every time you make changes to the schema.
* Use the seed script to quickly populate the data during setup.
