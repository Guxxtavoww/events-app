-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_events" (
    "event_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "organizer_id" INTEGER NOT NULL,
    CONSTRAINT "events_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("category_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "events_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_events" ("category_id", "created_at", "description", "end_date_time", "event_id", "image_url", "is_free", "location", "organizer_id", "price", "start_date_time", "title", "url") SELECT "category_id", "created_at", "description", "end_date_time", "event_id", "image_url", "is_free", "location", "organizer_id", "price", "start_date_time", "title", "url" FROM "events";
DROP TABLE "events";
ALTER TABLE "new_events" RENAME TO "events";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
