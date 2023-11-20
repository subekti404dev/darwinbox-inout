# DarwinInOut

## Development
run with docker-compose:
```
docker-compose build --no-cache
docker-compose up
```


## Production

run with docker-compose:
```
version: '3'
services:
  darwin:
    container_name: darwinbox-inout
    image: subekti13/darwin-inout:latest
    restart: unless-stopped
    environment:
      - TZ=Asia/Jakarta
    volumes:
      - ./data:/app/data
    ports:
      - 7000:7000
```