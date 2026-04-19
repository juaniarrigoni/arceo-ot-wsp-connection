-- CreateTable
CREATE TABLE "OT" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "recursos" TEXT[],
    "estado" TEXT NOT NULL DEFAULT 'activa',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Personal" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,

    CONSTRAINT "Personal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OTPersonal" (
    "otId" TEXT NOT NULL,
    "personalId" TEXT NOT NULL,

    CONSTRAINT "OTPersonal_pkey" PRIMARY KEY ("otId","personalId")
);

-- CreateTable
CREATE TABLE "Tarea" (
    "id" TEXT NOT NULL,
    "otId" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "observacion" TEXT NOT NULL,
    "visibilidad" TEXT NOT NULL,
    "destinatarios" TEXT[],
    "enviada" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tarea_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Personal_telefono_key" ON "Personal"("telefono");

-- AddForeignKey
ALTER TABLE "OTPersonal" ADD CONSTRAINT "OTPersonal_otId_fkey" FOREIGN KEY ("otId") REFERENCES "OT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OTPersonal" ADD CONSTRAINT "OTPersonal_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "Personal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tarea" ADD CONSTRAINT "Tarea_otId_fkey" FOREIGN KEY ("otId") REFERENCES "OT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
