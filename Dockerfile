FROM node:16 as builder
WORKDIR /app

COPY . .
RUN npm install && npm run build && ls -lah

FROM ubuntu:latest
WORKDIR /app
COPY --from=builder /app/index /app/darwin
RUN chmod +x /app/darwin

EXPOSE ${PORT:-7000}

CMD ["/app/darwin"]
