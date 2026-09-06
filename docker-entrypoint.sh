#!/bin/sh
set -e

# Apply schema and seed on every container start. Idempotent: db push is a no-op
# once the DB is in sync, and the seed script should be safe to re-run.
echo "[entrypoint] running prisma db push..."
npx prisma db push --skip-generate

if [ -f prisma/seed.ts ]; then
  echo "[entrypoint] running db seed..."
  npm run db:seed || echo "[entrypoint] seed failed (continuing)"
fi

echo "[entrypoint] starting app..."
exec "$@"
