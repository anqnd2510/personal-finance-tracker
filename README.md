# 💰 Personal Finance Tracker

A modern, full-stack personal finance management application that helps users track income and expenses, set monthly budgets, receive alerts, and gain insights through analytics and AI-powered recommendations.

> Built with the MERN stack, role-based access control (RBAC), and OpenAI (via OpenRouter) integration.

---

## 🌟 Features

- 🔐 **Authentication & RBAC** – Secure login via JWT with basic role-based access control
- 📂 **Category Management** – Custom spending categories like Food, Travel, Entertainment, etc.
- 💵 **Transactions** – Log income & expenses with filtering by time and category
- 🎯 **Budget Management** – Set monthly budgets per category and receive real-time warnings
- 📊 **Analytics Dashboard** – View charts and summaries for each month and category
- 🤖 **AI Assistant** – Analyze your spending behavior and receive suggestions powered by GPT
- 🌓 **Dark Mode & Responsive UI** – Mobile-first, clean, and modern interface

---

## 🧑‍💻 Tech Stack

| Layer         | Technologies                            |
|---------------|------------------------------------------|
| Frontend      | React, TypeScript, TailwindCSS           |
| Backend       | Node.js, Express, TypeScript             |
| Database      | MongoDB (Mongoose ORM)                   |
| Authentication| JWT, Bcrypt                              |
| AI Integration| OpenRouter (Deepseek / GPT API)          |
| Charts        | Recharts / Chart.js                      |
| Deployment    | Vercel (Frontend), Render/Railway (Backend) |

---

## ⚙️ Getting Started

### 📦 Backend Setup

```bash
git clone https://github.com/your-username/personal-finance-tracker.git
cd personal-finance-tracker/backend
npm install
#### Create a .env file in the /backend folder:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finance-db
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
#### Start the backend development server:
npm run dev

### 🌐 Frontend Setup
cd ../frontend
npm install
#### Start the frontend:
npm run dev
### 📁 Folder Structure:
#### Backend (/backend)
##### /backend
├── controllers/         # Route handlers
├── services/            # Business logic
├── models/              # Mongoose schemas
├── routes/              # API route definitions
├── middlewares/         # JWT, error handling, RBAC
├── interfaces/          # TypeScript interfaces
├── utils/               # Helpers and constants
├── app.ts               # Express app configuration
└── server.ts            # Server entry point
##### /frontend
├── components/          # Reusable UI components
├── pages/               # Page-level views
├── hooks/               # Custom React hooks
├── contexts/            # Global app state
├── assets/              # Icons, images, etc.
└── main.tsx             # React app entry point
### 📊 API Highlights
🔁 Transactions
GET /api/transactions: Get all transactions (filterable)
POST /api/transactions: Create a new transaction
GET /api/transactions/:id: View a transaction by ID
PUT /api/transactions/:id: Update a transaction
📂 Categories
GET /api/categories: Get all categories (default + user-defined)
POST /api/categories: Create a custom category
PUT /api/categories/:id: Update category details
DELETE /api/categories/:id: Delete a category
🎯 Budgets
POST /api/budgets: Set a monthly budget for a category
GET /api/budgets: View all budgets by month
PUT /api/budgets/:id: Update budget amount
GET /api/budgets/warnings: Get list of near-limit warnings
📈 Analytics
GET /api/analytics/overview: Monthly overview (total income, expenses, savings)
GET /api/analytics/monthly?month=YYYY-MM: Category-wise spending chart
GET /api/analytics/compare?month=YYYY-MM: Compare current and previous month
🤖 AI Assistant
POST /api/ai/analyze: Analyze spending behavior (OpenAI integration)
POST /api/ai/chat: Ask questions like "Where did I overspend?"
🔐 Auth & RBAC
POST /api/auth/register: Register a new account
POST /api/auth/login: Login with email/password
GET /api/auth/profile: Get current user profile
RBAC: Basic role system (user, admin) with route protection middleware
🛡️ Role-Based Access Control (RBAC)
The backend includes a simple but extensible RBAC system:
Users are assigned roles (e.g., user, admin)
Protected routes use middleware to restrict access
Designed for future extension with custom roles/permissions

### 📌 Future Improvements
🔄 Google OAuth login
🔔 Email alerts via scheduled cron jobs
📤 Export data to CSV/Excel
🛡️ Two-Factor Authentication (2FA)
📊 Quarterly/Yearly analytics
👨‍👩‍👧 Shared family budgeting
🧑‍💼 Admin dashboard for role management
