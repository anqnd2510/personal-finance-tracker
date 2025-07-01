Here's an organized and easy-to-read overview of your Personal Finance Tracker application, formatted for a README.md file:

💰 Personal Finance Tracker
A modern, full-stack personal finance management application that helps you track income and expenses, set monthly budgets, receive alerts, and gain insights through analytics and AI-powered recommendations.

Built with the MERN stack, role-based access control (RBAC), and OpenAI (via OpenRouter) integration, this app empowers you to manage your money smarter.

🌟 Features
🔐 Authentication & RBAC: Secure login via JWT with basic role-based access control ensures your data is protected.

📂 Category Management: Create custom spending categories like Food, Travel, Entertainment, and more, tailoring them to your unique financial habits.

💵 Transactions: Log all your income and expenses with powerful filtering options by time and category for detailed insights.

🎯 Budget Management: Set monthly budgets for each category and receive real-time warnings as you approach or exceed your limits.

📊 Analytics Dashboard: Visualize your financial health with insightful charts and summaries for each month and spending category.

🤖 AI Assistant: Get personalized financial advice! The AI analyzes your spending behavior and provides smart suggestions powered by GPT.

🌓 Dark Mode & Responsive UI: A clean, modern, and mobile-first interface that adapts seamlessly to any device, with a comfortable dark mode option.

🧑‍💻 Tech Stack
This application is built with a robust and modern set of technologies:

Layer

Technologies

Frontend

React, TypeScript, TailwindCSS

Backend

Node.js, Express, TypeScript

Database

MongoDB (Mongoose ORM)

Auth

JWT, Bcrypt

AI

OpenRouter (Deepseek / GPT API)

Charts

Recharts / Chart.js

Deployment

Vercel (Frontend), Render/Railway (Backend)


Export to Sheets
⚙️ Getting Started
Ready to run the Personal Finance Tracker locally? Follow these steps:

📦 Backend Setup
Clone the repository and navigate to the backend directory:

Bash

git clone https://github.com/your-username/personal-finance-tracker.git
cd personal-finance-tracker/backend
Install dependencies:

Bash

npm install
Create a .env file in the /backend directory and add your environment variables:

Ini, TOML

PORT=5000
MONGODB_URI=mongodb://localhost:27017/finance-db
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
Start the backend server:

Bash

npm run dev
🌐 Frontend Setup
Navigate to the frontend directory:

Bash

cd ../frontend
Install dependencies:

Bash

npm install
Start the frontend development server:

Bash

npm run dev
Once both the backend and frontend servers are running, you can access the application at:

Frontend: http://localhost:5173

Backend: http://localhost:5000

📁 Folder Structure
Here's an overview of the project's organized folder structure:

Backend
Bash

/backend
├── controllers/         # Route handlers for API endpoints
├── services/            # Business logic and data manipulation
├── models/              # Mongoose schemas for MongoDB
├── routes/              # API route definitions
├── middlewares/         # JWT, error handling, RBAC middleware
├── interfaces/          # TypeScript interfaces for data structures
├── utils/               # Helper functions and constants
├── app.ts               # Express application configuration
└── server.ts            # Server entry point
Frontend
Bash

/frontend
├── components/          # Reusable UI components
├── pages/               # Page-level views and layouts
├── hooks/               # Custom React hooks for shared logic
├── contexts/            # Global app state management
├── assets/              # Icons, images, and other static assets
└── main.tsx             # React application entry point
📊 API Highlights
The application provides a comprehensive set of API endpoints for managing your finances:

🔁 Transactions
Method

Endpoint

Description

GET

/api/transactions

Get all transactions (filterable)

POST

/api/transactions

Create a new transaction

GET

/api/transactions/:id

View a transaction by ID

PUT

/api/transactions/:id

Update a transaction


Export to Sheets
📂 Categories
Method

Endpoint

Description

GET

/api/categories

Get all categories

POST

/api/categories

Create a custom category

PUT

/api/categories/:id

Update category details

DELETE

/api/categories/:id

Delete a category


Export to Sheets
🎯 Budgets
Method

Endpoint

Description

POST

/api/budgets

Set a monthly budget for a category

GET

/api/budgets

View all budgets by month

PUT

/api/budgets/:id

Update a budget

GET

/api/budgets/warnings

List categories nearing or exceeding their limit


Export to Sheets
📈 Analytics
Method

Endpoint

Description

GET

/api/analytics/overview

Monthly income, expenses, and savings summary

GET

/api/analytics/monthly?month=YYYY-MM

Spending chart by category for a specific month

GET

/api/analytics/compare?month=YYYY-MM

Compare spending against the previous month


Export to Sheets
🤖 AI Assistant
Method

Endpoint

Description

POST

/api/ai/analyze

Analyze spending behavior with GPT suggestions

POST

/api/ai/chat

Ask financial questions (e.g., "Where did I overspend?")


Export to Sheets
🔐 Auth & RBAC
Method

Endpoint

Description

POST

/api/auth/register

Register a new account

POST

/api/auth/login

Login with email/password

GET/api/auth/profile

Get current user profile


Export to Sheets
🛡️ Role-Based Access Control (RBAC)
The backend includes a simple but extensible RBAC system:

Users are assigned roles (default: user, admin).

Role-based middleware protects sensitive endpoints, ensuring only authorized users can access specific functionalities.

This system can be easily extended to support more granular permissions (e.g., create_budget, edit_transaction).

📌 Future Improvements
We're constantly looking to enhance the Personal Finance Tracker! Here are some planned future improvements:

🔄 Google OAuth login: For even easier sign-up and login.

🔔 Email alerts via scheduled cron jobs: Get proactive notifications about your budget.

📤 Export data to CSV/Excel: Easily analyze your data outside the application.

🛡️ Two-Factor Authentication (2FA): Enhance security for your account.

📊 Quarterly/Yearly analytics: Gain a broader perspective on your financial trends.

👪 Shared family budgeting: Collaborate on finances with family members.

🧑‍💼 Admin dashboard for role management: For easier management of user roles.
