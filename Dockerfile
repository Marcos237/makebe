
FROM node:latest as react-build

WORKDIR /app

COPY package*.json ./

RUN rm -rf node_modules

RUN npm install

COPY . .

RUN npm run build

VOLUME /mnt/arquivos/makebeserver/dockercompose/nginx_front-end

RUN cp -r /app/build/* /mnt/arquivos/makebeserver/dockercompose/nginx_front-end/
