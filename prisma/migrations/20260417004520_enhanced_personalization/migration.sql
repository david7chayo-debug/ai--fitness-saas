/*
  Warnings:

  - You are about to drop the column `workout` on the `Plan` table. All the data in the column will be lost.
  - Added the required column `calories` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carbs` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `explanation` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fat` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `protein` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trainingSplit` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Checkin" ADD COLUMN "weight" REAL;

-- CreateTable
CREATE TABLE "ChatMemory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "reply" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatMemory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Plan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "generatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calories" INTEGER NOT NULL,
    "protein" INTEGER NOT NULL,
    "carbs" INTEGER NOT NULL,
    "fat" INTEGER NOT NULL,
    "meals" TEXT NOT NULL,
    "trainingSplit" TEXT NOT NULL,
    "shoppingList" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "goal" TEXT,
    "eatingPreference" TEXT,
    CONSTRAINT "Plan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Plan" ("generatedAt", "id", "meals", "shoppingList", "userId") SELECT "generatedAt", "id", "meals", "shoppingList", "userId" FROM "Plan";
DROP TABLE "Plan";
ALTER TABLE "new_Plan" RENAME TO "Plan";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "gender" TEXT,
    "age" INTEGER,
    "height" REAL,
    "weight" REAL,
    "bodyFat" REAL,
    "activityLevel" TEXT,
    "goal" TEXT,
    "trainingExperience" TEXT,
    "trainingFrequency" INTEGER,
    "eatingPreference" TEXT,
    "dietaryRestrictions" TEXT,
    "planType" TEXT NOT NULL DEFAULT 'free',
    "calories" INTEGER,
    "protein" INTEGER,
    "carbs" INTEGER,
    "fat" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("activityLevel", "age", "calories", "carbs", "createdAt", "email", "fat", "goal", "height", "id", "name", "password", "protein", "updatedAt", "weight") SELECT "activityLevel", "age", "calories", "carbs", "createdAt", "email", "fat", "goal", "height", "id", "name", "password", "protein", "updatedAt", "weight" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
