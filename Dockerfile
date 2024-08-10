
FROM node:latest as react-build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build
