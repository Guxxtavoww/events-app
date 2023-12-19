/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `events` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "clerk_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL
);
INSERT INTO "new_users" ("clerk_id", "email", "first_name", "last_name", "photo_url", "user_id", "username") SELECT "clerk_id", "email", "first_name", "last_name", "photo_url", "user_id", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE TABLE "new_events" (
    "event_id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "image_url" TEXT NOT NULL,
    "start_date_time" DATETIME NOT NULL,
    "end_date_time" DATETIME NOT NULL,
    "price" TEXT,
    "is_free" BOOLEAN NOT NULL,
    "url" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "organizer_id" TEXT NOT NULL,
    CONSTRAINT "events_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("category_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "events_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_events" ("category_id", "created_at", "description", "end_date_time", "event_id", "image_url", "is_free", "location", "organizer_id", "price", "start_date_time", "title", "url") SELECT "category_id", "created_at", "description", "end_date_time", "event_id", "image_url", "is_free", "location", "organizer_id", "price", "start_date_time", "title", "url" FROM "events";
DROP TABLE "events";
ALTER TABLE "new_events" RENAME TO "events";
CREATE TABLE "new_orders" (
    "order_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stripe_id" TEXT NOT NULL,
    "total_amount" TEXT,
    "event_id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "orders_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("event_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "orders_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_orders" ("buyer_id", "created_at", "event_id", "order_id", "stripe_id", "total_amount") SELECT "buyer_id", "created_at", "event_id", "order_id", "stripe_id", "total_amount" FROM "orders";
DROP TABLE "orders";
ALTER TABLE "new_orders" RENAME TO "orders";
CREATE UNIQUE INDEX "orders_stripe_id_key" ON "orders"("stripe_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
