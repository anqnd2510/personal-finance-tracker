# 💰 Personal Finance Tracker

A modern, full-stack personal finance management application with intelligent rule-based insights. Track income and expenses, set budgets, receive automated financial health alerts, and gain AI-powered recommendations.

> Built with React, Node.js, PostgreSQL, Prisma ORM, and OpenAI integration.

---

## 🌟 Features

- 🔐 **Authentication & RBAC** – Secure JWT-based authentication with role-based access control
- 📂 **Category Management** – Pre-defined and custom spending categories (Food, Travel, Entertainment, etc.)
- 💵 **Transactions** – Track income & expenses with advanced filtering by date and category
- 🎯 **Budget Management** – Set period-based budgets (daily, weekly, monthly, yearly) per category
- 🚨 **Rule Engine** – Automated financial insights with 4 intelligent rules:
  - **Budget Monitoring** – Alerts at 70%, 90%, and 100% budget thresholds
  - **Income Monitoring** – Detects income deficits and irregular patterns
  - **Spending Behavior** – Identifies spending spikes and savings opportunities
  - **Financial Health Score** – 0-100 score based on multiple financial factors
- 📊 **Analytics Dashboard** – Visual charts and summaries with month-over-month comparisons
- 🤖 **AI Assistant** – Contextual spending analysis and personalized recommendations via OpenAI
- 🐳 **Docker Support** – Production-ready multi-stage Docker setup with docker-compose
- 📚 **Swagger API Docs** – Interactive API documentation at `/api-docs`

---

## 🧑‍💻 Tech Stack

| Layer          | Technologies                                    |
| -------------- | ----------------------------------------------- |
| Frontend       | React 18, Vite, TailwindCSS                     |
| Backend        | Node.js 22, Express 4, TypeScript 5.8           |
| Database       | PostgreSQL 15 with Prisma ORM 7.1               |
| Authentication | JWT, Bcrypt                                     |
| AI Integration | OpenAI via OpenRouter (GPT models)              |
| Rule Engine    | Custom TypeScript-based financial rules system  |
| Charts         | Recharts                                        |
| API Docs       | Swagger UI with OpenAPI 3.0                     |
| Containerization | Docker with multi-stage builds                |
| Deployment     | Docker Compose (local), adaptable to cloud      |

---

## ⚙️ Getting Started

### � Quick Start with Docker (Recommended)

```bash
git clone https://github.com/your-username/personal-finance-tracker.git
cd personal-finance-tracker
docker-compose up -d
```

The application will be available at:
- Backend API: http://localhost:4000
- Swagger Docs: http://localhost:4000/api-docs
- PostgreSQL: localhost:5436

---

### 📦 Manual Backend Setup

```bash
cd personal-finance-tracker-back-end
npm install
```

Create a `.env` file:

```env
PORT=4000
DATABASE_URL=postgresql://postgres:password@localhost:5436/postgres?schema=public
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=your_openai_api_key
OPENROUTER_API_KEY=your_openrouter_key
```

Set up the database:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npx prisma migrate deploy

# Seed categories (optional)
npx prisma db seed
```

Build and start the server:

```bash
npm run build
npm run start
```

---

### 🌐 Frontend Setup

```bash
cd personal-finance-tracker-front-end
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:4000/api
```

Start the development server:

```bash
npm run dev
```

The app will now be running at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- Swagger Docs: http://localhost:4000/api-docs

---

## 📁 Project Structure

### Backend (`personal-finance-tracker-back-end/`)

```
├── config/              # Database and OpenAI configuration
├── constants/           # Enums and constants (HTTP status, roles, periods)
├── controllers/         # API route handlers
├── services/            # Business logic layer
├── repositories/        # Data access layer (Prisma queries)
├── routes/              # Express route definitions
├── middlewares/         # Authentication, authorization, error handling
├── interfaces/          # TypeScript type definitions
├── rules/               # Financial rule engine
│   ├── types.ts         # Rule type definitions
│   ├── engine.ts        # Rule execution engine
│   ├── budget.rule.ts   # Budget monitoring rule
│   ├── income.rule.ts   # Income pattern analysis
│   ├── spending.rule.ts # Spending behavior detection
│   ├── health.rule.ts   # Financial health scoring
│   └── README.md        # Rule engine documentation
├── prisma/              # Database schema and migrations
│   ├── schema.prisma    # Prisma schema definition
│   └── migrations/      # Database migration history
├── docs/                # Swagger API documentation
├── utils/               # Helper functions and utilities
├── app.ts               # Express application setup
├── server.ts            # Server entry point
├── Dockerfile           # Production container image
└── docker-compose.yml   # Multi-container orchestration
```

### Frontend (`personal-finance-tracker-front-end/`)

```
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── analytics/   # Analytics-specific components
│   │   ├── AccountList.jsx
│   │   ├── BudgetCard.jsx
│   │   ├── TransactionModal.jsx
│   │   └── FloatingChat.jsx
│   ├── pages/           # Route-based page components
│   │   ├── Dashboard.jsx
│   │   ├── Analytics.jsx
│   │   ├── Budgets.jsx
│   │   └── AdminAccounts.jsx
│   ├── contexts/        # React Context (Auth, etc.)
│   ├── layouts/         # Layout wrappers
│   ├── services/        # API client services
│   ├── routes/          # Route configuration
│   ├── utils/           # Helper utilities
│   └── main.jsx         # Application entry point
└── public/              # Static assets
```

---

## 📊 API Documentation

### 🔐 Authentication

| Method | Endpoint             | Description                 | Auth Required |
| ------ | -------------------- | --------------------------- | ------------- |
| POST   | `/api/auth/register` | Create a new account        | ❌            |
| POST   | `/api/auth/login`    | Login with email/password   | ❌            |
| GET    | `/api/auth/profile`  | Get current user profile    | ✅            |

**RBAC System:**
- Roles: `user`, `admin`
- JWT-based authentication with Bearer tokens
- Protected routes via middleware
- Extensible permission-based control

---

### 💵 Transactions

| Method | Endpoint                | Description                       | Auth Required |
| ------ | ----------------------- | --------------------------------- | ------------- |
| GET    | `/api/transactions`     | Get all user transactions         | ✅            |
| POST   | `/api/transactions`     | Create a new transaction          | ✅            |
| GET    | `/api/transactions/:id` | Get transaction by ID             | ✅            |
| PUT    | `/api/transactions/:id` | Update a transaction              | ✅            |
| DELETE | `/api/transactions/:id` | Delete a transaction              | ✅            |

**Query Parameters:**
- `startDate`, `endDate` – Filter by date range
- `categoryId` – Filter by category
- `type` – Filter by income/expense

---

### 📂 Categories

| Method | Endpoint              | Description              | Auth Required |
| ------ | --------------------- | ------------------------ | ------------- |
| GET    | `/api/categories`     | Get all categories       | ✅            |
| POST   | `/api/categories`     | Create a custom category | ✅ (Admin)    |
| PUT    | `/api/categories/:id` | Update category details  | ✅ (Admin)    |
| DELETE | `/api/categories/:id` | Delete a category        | ✅ (Admin)    |

**Default Categories:**
Food, Transportation, Entertainment, Healthcare, Shopping, Bills, Education, Travel, Savings, Investment, Other

---

### 🎯 Budgets

| Method | Endpoint           | Description                          | Auth Required |
| ------ | ------------------ | ------------------------------------ | ------------- |
| GET    | `/api/budgets`     | Get all user budgets                 | ✅            |
| POST   | `/api/budgets`     | Create a budget for a category       | ✅            |
| GET    | `/api/budgets/:id` | Get budget by ID                     | ✅            |
| PUT    | `/api/budgets/:id` | Update budget amount or period       | ✅            |
| DELETE | `/api/budgets/:id` | Delete a budget                      | ✅            |

**Budget Periods:**
- `daily`, `weekly`, `monthly`, `yearly`

---

### 🚨 Insights (Rule Engine)

| Method | Endpoint                      | Description                         | Auth Required |
| ------ | ----------------------------- | ----------------------------------- | ------------- |
| GET    | `/api/insights`               | Get all financial insights          | ✅            |
| GET    | `/api/insights/rules`         | Get available rules                 | ✅            |
| GE� Rule Engine

The application features an intelligent rule engine that automatically analyzes your financial data and provides actionable insights.

### Available Rules

#### 1️⃣ Budget Monitoring
Tracks budget usage and sends alerts at critical thresholds:
- 🔴 **100%+** – Budget exceeded (danger)
- ⚠️ **90-99%** – Near limit (warning)
- 💡 **70-89%** – Usage update (info)

#### 2️⃣ Income Monitoring
Analyzes income patterns and detects anomalies:
- 🚨 **3-Month Deficit** – Expenses exceed income for 3 consecutive months
- ⚠️ **Income Decrease** – More than 30% drop from previous month
- 💡 **No Income** – Warning when no income detected

#### 3️⃣ Spending Behavior
Identifies spending patterns and opportunities:
- 🔴 **Category Spike** – 40%+ increase in specific category
- ⚠️ **Total Spending Spike** – 30%+ increase overall
- 💰 **Savings Opportunity** – 20%+ decrease in spending
- 🔄 **Recurring Transactions** – Identifies fixed monthly bills

#### 4️⃣ Financial Health Score
Calculates a 0-100 score based on:
- **30%** – Expense-to-income ratio
- **25%** – Budget adherence
- **25%** – Savings rate
- **20%** – Spending consistency

**Score Interpretation:**
- 80-100: Excellent financial health 💚
- 60-79: Good financial health 💙
- 40-59: Fair financial health 💛
- 20-39: Poor financial health 🧡
- 0-19: Critical financial health 🔴

---

## 🐳 Docker Deployment

The application includes production-ready Docker configuration:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

**Services:**
- `backend` – Node.js API server (port 4000)
- `postgres` – PostgreSQL database (port 5436)

---

## 🗄️ Database Schema

The application uses PostgreSQL with the following main tables:

- **Account** – User accounts with authentication
- **Category** – Spending/income categories
- **Transaction** – Income and expense records
- **Budget** – Budget limits per category and period

**Enums:**
- `Role` – `user`, `admin`
- `TransactionType` – `income`, `expense`
- `Period` – `daily`, `weekly`, `monthly`, `yearly`

---

## 🧪 Testing

```bash
# Backend tests
cd personal-finance-tracker-back-end
npm test

# Frontend tests
cd personal-finance-tracker-front-end
npm test
```

---

## 📌 Future Enhancements

- 🔄 **OAuth Integration** – Google, Facebook login
- 🔔 **Email/SMS Notifications** – Budget alerts and scheduled reports
- 📤 **Export Functionality** – CSV, Excel, PDF reports
- 🛡️ **Two-Factor Authentication (2FA)** – Enhanced security
- 📊 **Advanced Analytics** – Predictive spending, goal tracking
- 👪 **Shared Budgets** – Family/household budget management
- 📱 **Mobile App** – React Native or Flutter mobile app
- 🌍 **Multi-Currency** – Support for multiple currencies
- 🎯 **Financial Goals** – Savings goals, debt reduction tracking
- 🏆 **Gamification** – Achievements, streaks, challenges

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---
