-- CreateTable
CREATE TABLE "Alert" (
    "id" SERIAL NOT NULL,
    "token_address" TEXT NOT NULL,
    "target_price" DOUBLE PRECISION NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);
