FROM node:16-alpine as builder
WORKDIR /app

COPY . .
# Build FE
RUN cd frontend && npm install && npm run build \
    &&  cp -R ./dist /app/html

# Build BE into single .cjs file
RUN cd backend && npm install && npm run build &&\
    # Build BE into single binary file
    npm run build:bin || true

FROM node:16-alpine
WORKDIR /app

COPY --from=builder /app/html /app/html
COPY --from=builder /app/backend/single/* /app/
COPY --from=builder /app/scripts/run_inside_docker.sh /usr/local/bin/run-darwinbox

RUN chmod +x /usr/local/bin/run-darwinbox

EXPOSE ${PORT:-7000}

CMD ["run-darwinbox"]
