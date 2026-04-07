-- CreateTable
CREATE TABLE "Rule" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "descriptionContains" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Rule_accountId_isActive_priority_idx" ON "Rule"("accountId", "isActive", "priority");

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
