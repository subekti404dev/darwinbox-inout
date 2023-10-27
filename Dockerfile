FROM node:latest
WORKDIR /app

COPY . .
RUN npm install && npm run build

EXPOSE ${PORT:-7000}

CMD ["npm", "run", "start"]
