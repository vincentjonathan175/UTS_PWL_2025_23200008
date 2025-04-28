-- CreateTable
CREATE TABLE "preorder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_date" DATETIME NOT NULL,
    "order_by" TEXT NOT NULL,
    "selected_package" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "is_paid" BOOLEAN NOT NULL
);
