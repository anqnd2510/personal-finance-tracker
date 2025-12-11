# Quick Start Guide - PostgreSQL Migration

## ✅ Migration Complete!

Your personal finance tracker has been successfully migrated from MongoDB to PostgreSQL with Prisma ORM.

## 🚀 Quick Setup (3 Steps)

### Step 1: Set up PostgreSQL

Choose one option:

**A) Local PostgreSQL** (Recommended for development)
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15
createdb finance_tracker

# Your DATABASE_URL will be:
# postgresql://YOUR_USERNAME@localhost:5432/finance_tracker
```

**B) Docker PostgreSQL** (Easiest)
```bash
docker run --name postgres-finance \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=finance_tracker \
  -p 5432:5432 \
  -d postgres:15

# Your DATABASE_URL will be:
# postgresql://postgres:password@localhost:5432/finance_tracker
```

**C) Cloud PostgreSQL** (Free options)
- **Supabase**: https://supabase.com (Recommended - includes free tier)
- **Neon**: https://neon.tech
- **Railway**: https://railway.app

### Step 2: Run Setup Script

```bash
cd personal-finance-tracker-back-end
./setup-database.sh
```

This script will:
1. Create `.env` file from template
2. Install dependencies
3. Generate Prisma Client
4. Set up your database
5. Optionally seed initial categories

### Step 3: Start the Server

```bash
npm run dev
```

Your API will be running at http://localhost:5000 🎉

---

## 📚 What Changed?

### Database
- ✅ **From**: MongoDB (document database)
- ✅ **To**: PostgreSQL (relational database)

### ORM
- ✅ **From**: Mongoose
- ✅ **To**: Prisma

### Benefits
- ✅ Type-safe database queries
- ✅ Auto-generated types
- ✅ Better performance
- ✅ ACID transactions
- ✅ Schema migrations
- ✅ Built-in GUI (Prisma Studio)

---

## 🛠️ Useful Commands

```bash
# Development
npm run dev                 # Start dev server with hot reload

# Database Management
npx prisma studio          # Open database GUI
npx prisma generate        # Regenerate Prisma Client
npx prisma db push         # Push schema changes to DB
npx prisma migrate dev     # Create a new migration
npx prisma db seed         # Seed database with initial data

# View API Documentation
# Visit: http://localhost:5000/api-docs
```

---

## 🔍 Testing the Migration

### 1. Register a new account
```bash
curl -X POST http://localhost:5000/api/auths/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "dob": "1990-01-01",
    "phoneNumber": "+1234567890"
  }'
```

### 2. View in Prisma Studio
```bash
npx prisma studio
```
Open http://localhost:5555 to see your data in a beautiful GUI!

---

## 📂 Project Structure

```
personal-finance-tracker-back-end/
├── prisma/
│   ├── schema.prisma      # Database schema (source of truth)
│   ├── seed.ts           # Database seed file
│   └── migrations/       # Migration history
├── repositories/         # Database operations (all migrated to Prisma)
├── services/            # Business logic
├── controllers/         # HTTP request handlers
├── routes/             # API routes
├── interfaces/         # TypeScript interfaces (now use Prisma types)
└── config/
    └── database.ts     # Prisma client instance
```

---

## ⚠️ Important Notes

### ID Format Changed
- **Before**: MongoDB ObjectId (e.g., `507f1f77bcf86cd799439011`)
- **After**: UUID (e.g., `550e8400-e29b-41d4-a716-446655440000`)

### Phone Number Type Changed
- **Before**: `number`
- **After**: `string` (supports international formats like +1-555-0123)

### Enum Types
All enums are now managed by Prisma:
- `Role`: USER, MANAGER, ADMIN
- `Period`: daily, weekly, monthly, yearly
- `TransactionType`: income, expense

---

## 🐛 Troubleshooting

### "Can't reach database server"
```bash
# Check if PostgreSQL is running
# For local:
pg_isready

# For Docker:
docker ps | grep postgres
```

### "Environment variable not found: DATABASE_URL"
```bash
# Make sure .env file exists and has DATABASE_URL
cat .env | grep DATABASE_URL
```

### "Migration conflicts"
```bash
# Reset database (⚠️ deletes all data!)
npx prisma migrate reset
```

---

## 📖 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Full Migration Guide](../MIGRATION_GUIDE.md)

---

## ✨ You're All Set!

Your backend is now using PostgreSQL with Prisma ORM. Enjoy the improved type safety, better performance, and excellent developer experience! 🎉
