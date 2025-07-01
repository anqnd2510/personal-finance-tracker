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

