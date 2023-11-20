FROM node:16-alpine as builder
WORKDIR /app

COPY . .
# Build FE
RUN cd frontend && npm install && npm run build \
    &&  cp -R ./dist /app/react_dist

# Build BE into single file
RUN cd backend && npm install && npm run build

FROM alpine:latest
WORKDIR /app

COPY --from=builder /app/react_dist /app/react_dist
COPY --from=builder /app/backend/darwinbox /usr/local/bin/darwinbox

EXPOSE ${PORT:-7000}

CMD ["darwinbox"]
