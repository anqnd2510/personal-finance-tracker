import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed categories
  console.log('📁 Creating categories...');
  const categories = [
    { name: 'Food & Dining', description: 'Restaurants, groceries, food delivery' },
    { name: 'Transportation', description: 'Gas, public transit, car maintenance' },
    { name: 'Entertainment', description: 'Movies, games, subscriptions' },
    { name: 'Shopping', description: 'Clothes, electronics, household items' },
    { name: 'Bills & Utilities', description: 'Rent, electricity, water, internet' },
    { name: 'Healthcare', description: 'Medical, dental, pharmacy' },
    { name: 'Education', description: 'Tuition, books, courses' },
    { name: 'Travel', description: 'Flights, hotels, vacation expenses' },
    { name: 'Income', description: 'Salary, freelance work, bonuses' },
    { name: 'Savings', description: 'Emergency fund, investments' },
    { name: 'Other', description: 'Miscellaneous expenses' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log(`✅ Created ${categories.length} categories`);

  console.log('\n✨ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
