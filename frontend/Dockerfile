# Dockerfile for React
FROM node:14

WORKDIR /app

COPY frontend/package.json package.json

RUN npm install

COPY frontend /app

CMD ["npm", "start"]
