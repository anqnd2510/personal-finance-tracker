# MongoDB to PostgreSQL with Prisma ORM Migration Guide

## ✅ Completed Migration Steps

All code has been successfully migrated from MongoDB/Mongoose to PostgreSQL/Prisma ORM!

### What Was Changed:

1. **Database Configuration** - [config/database.ts](personal-finance-tracker-back-end/config/database.ts)
   - Replaced Mongoose connection with Prisma Client
   - Added graceful disconnect functionality

2. **Prisma Schema** - [prisma/schema.prisma](personal-finance-tracker-back-end/prisma/schema.prisma)
   - Already configured with PostgreSQL models
   - Added DATABASE_URL environment variable

3. **Interfaces** - Updated all interfaces to use Prisma types:
   - Removed `Document` from Mongoose
   - Changed `Types.ObjectId` to `string`
   - Changed `phoneNumber` from `number` to `string`
   - Added `id` field to all interfaces

4. **Repositories** - Migrated all repositories to use Prisma:
   - ✅ [account.repository.ts](personal-finance-tracker-back-end/repositories/account.repository.ts)
   - ✅ [category.repository.ts](personal-finance-tracker-back-end/repositories/category.repository.ts)
   - ✅ [transaction.repository.ts](personal-finance-tracker-back-end/repositories/transaction.repository.ts)
   - ✅ [budget.repository.ts](personal-finance-tracker-back-end/repositories/budget.repository.ts)
   - ✅ [analytic.repository.ts](personal-finance-tracker-back-end/repositories/analytic.repository.ts)

5. **Server Configuration** - [server.ts](personal-finance-tracker-back-end/server.ts)
   - Updated to use Prisma connection
   - Added graceful shutdown handlers

---

## 🚀 Next Steps to Complete Migration

### Step 1: Set up PostgreSQL Database

You need a PostgreSQL database. Choose one of these options:

**Option A: Local PostgreSQL (Recommended for development)**
```bash
# macOS with Homebrew
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb finance_tracker
```

**Option B: Docker PostgreSQL**
```bash
docker run --name postgres-finance \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=finance_tracker \
  -p 5432:5432 \
  -d postgres:15
```

**Option C: Cloud PostgreSQL** (Recommended for production)
- Supabase (free tier available)
- Railway (free tier available)
- Neon (free tier available)
- AWS RDS, Google Cloud SQL, Azure Database

### Step 2: Configure Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cd personal-finance-tracker-back-end
cp .env.example .env
```

Edit `.env` and update the `DATABASE_URL`:

```env
# For local PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/finance_tracker?schema=public"

# For Docker PostgreSQL (using the docker command above)
DATABASE_URL="postgresql://postgres:password@localhost:5432/finance_tracker?schema=public"
```

### Step 3: Run Prisma Migrations

This will create all tables in your PostgreSQL database:

```bash
cd personal-finance-tracker-back-end

# Push the schema to your database (creates tables)
npx prisma db push

# Or create a migration (better for production)
npx prisma migrate dev --name init
```

### Step 4: (Optional) Seed Initial Data

You can create a seed script to add initial categories or test data:

```bash
# Create seed file
touch prisma/seed.ts
```

Example seed content:
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed categories
  await prisma.category.createMany({
    data: [
      { name: 'Food & Dining', description: 'Restaurants, groceries' },
      { name: 'Transportation', description: 'Gas, public transit' },
      { name: 'Entertainment', description: 'Movies, games' },
      { name: 'Shopping', description: 'Clothes, electronics' },
      { name: 'Bills & Utilities', description: 'Rent, electricity' },
      { name: 'Income', description: 'Salary, freelance' },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Add to package.json:
```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

Run seed:
```bash
npx prisma db seed
```

### Step 5: Remove Old MongoDB Dependencies (Optional)

Once everything is working, you can remove Mongoose:

```bash
npm uninstall mongoose
```

Remove unused model files:
```bash
rm -rf personal-finance-tracker-back-end/models/
```

### Step 6: Start Your Server

```bash
npm run dev
```

---

## 📊 Useful Prisma Commands

```bash
# Generate Prisma Client (run after schema changes)
npx prisma generate

# Open Prisma Studio (GUI database browser)
npx prisma studio

# Push schema changes to database
npx prisma db push

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Reset database (⚠️ deletes all data!)
npx prisma migrate reset

# Format schema file
npx prisma format
```

---

## 🔍 Key Differences Between MongoDB and PostgreSQL/Prisma

### ID Fields
- **MongoDB**: `_id` (ObjectId)
- **PostgreSQL/Prisma**: `id` (UUID string)

### Queries
- **MongoDB**: `findOne()`, `find()`, `aggregate()`
- **Prisma**: `findUnique()`, `findMany()`, custom queries with `aggregate()`

### Relations
- **MongoDB**: Manual population with `populate()`
- **Prisma**: Automatic with `include` option

### Timestamps
- **MongoDB**: Requires `{ timestamps: true }` option
- **Prisma**: Uses `@default(now())` and `@updatedAt`

---

## ⚠️ Important Notes

1. **Data Migration**: If you have existing MongoDB data, you'll need to export it and import it into PostgreSQL
2. **ID Format**: UUIDs are now strings, not ObjectIds
3. **Phone Numbers**: Changed from `number` to `string` to support international formats
4. **Transactions**: PostgreSQL provides ACID transactions (more reliable than MongoDB)

---

## 🐛 Troubleshooting

### "Can't reach database server"
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env file
- Test connection: `psql DATABASE_URL`

### "Column does not exist"
- Run: `npx prisma generate`
- Then: `npx prisma db push`

### "Unique constraint violation"
- Check if data already exists
- Use `upsert` instead of `create` if needed

---

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Studio](https://www.prisma.io/studio)

---

## ✨ Migration Complete!

Your application is now ready to use PostgreSQL with Prisma ORM. The migration provides:
- ✅ Type safety with TypeScript
- ✅ Better performance with PostgreSQL
- ✅ Auto-generated queries
- ✅ Database migrations
- ✅ Schema validation
- ✅ Built-in connection pooling
