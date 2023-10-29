FROM node:16-alpine as builder
WORKDIR /app

COPY . .
RUN npm install && npm run build && ls -lah

FROM alpine:latest
WORKDIR /app

COPY --from=builder /app/darwinbox /app/darwinbox

EXPOSE ${PORT:-7000}

CMD ["node", "index.cjs"]
