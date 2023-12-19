-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "events" (
    "event_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "image_url" TEXT NOT NULL,
    "start_date_time" TIMESTAMP(3) NOT NULL,
    "end_date_time" TIMESTAMP(3) NOT NULL,
    "price" TEXT,
    "is_free" BOOLEAN NOT NULL,
    "url" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "organizer_id" TEXT NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "categories" (
    "category_id" SERIAL NOT NULL,
    "category_name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "orders" (
    "order_id" SERIAL NOT NULL,
    "stripe_id" TEXT NOT NULL,
    "total_amount" TEXT,
    "event_id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_stripe_id_key" ON "orders"("stripe_id");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
