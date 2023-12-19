-- CreateTable
CREATE TABLE "users" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clerk_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "events" (
    "event_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "image_url" TEXT NOT NULL,
    "start_date_time" DATETIME NOT NULL,
    "end_date_time" DATETIME NOT NULL,
    "price" TEXT NOT NULL,
    "is_free" BOOLEAN NOT NULL,
    "url" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "organizer_id" INTEGER NOT NULL,
    CONSTRAINT "events_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("category_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "events_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "categories" (
    "category_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "orders" (
    "order_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stripe_id" TEXT NOT NULL,
    "total_amount" TEXT,
    "event_id" INTEGER NOT NULL,
    "buyer_id" INTEGER NOT NULL,
    CONSTRAINT "orders_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("event_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "orders_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_stripe_id_key" ON "orders"("stripe_id");
