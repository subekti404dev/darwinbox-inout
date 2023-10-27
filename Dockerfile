FROM node:16 as builder
WORKDIR /app

COPY . .
RUN npm install && npm run build && ls -lah

FROM node:16
WORKDIR /app

COPY --from=builder /app/single/index.cjs /app/index.cjs

EXPOSE ${PORT:-7000}

CMD ["node", "index.cjs"]
