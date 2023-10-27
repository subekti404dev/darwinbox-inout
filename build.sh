#!/bin/bash

docker buildx build --push \
  --platform linux/arm64,linux/amd64 \
  --tag subekti13/darwin-inout:latest \
  --tag subekti13/darwin-inout:1.0.0-alpha.1 \
  --progress=plain \
  .