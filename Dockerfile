FROM node:16-alpine as builder
WORKDIR /app

COPY . .
RUN cd frontend && npm install && npm run build \
    &&  cp -R ./dist /app/react_dist
RUN npm install && npm run build && ls -lah

FROM alpine:latest
WORKDIR /app

COPY --from=builder /app/react_dist /app/react_dist
COPY --from=builder /app/darwinbox /usr/local/bin/darwinbox

EXPOSE ${PORT:-7000}

CMD ["darwinbox"]
