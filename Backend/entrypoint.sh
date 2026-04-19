#!/bin/sh
echo "Applying migrations..."
npx prisma db push --accept-dataloss

echo "Starting application..."
npm start
