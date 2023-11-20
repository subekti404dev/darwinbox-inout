# !/bin/sh

if [ ! -f /app/backend/.env ]; then
    cp /app/backend/.env.example /app/backend/.env
fi

if [ ! -f /app/frontend/.env ]; then
    cp /app/frontend/.env.example /app/frontend/.env
fi

cd /app/backend && pnpm dev &
cd /app/frontend && pnpm dev --host