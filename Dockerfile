FROM node:latest

WORKDIR /temp/react
COPY . .

RUN rm -rf node_modules

RUN npm install

RUN npm run build

RUN mkdir -p /var/www/html

RUN mv build/* /var/www/html 

VOLUME /mnt/arquivos/makebeserver/dockercompose/nginx_front-end/sites

WORKDIR /

RUN rm -rf /temp/react

EXPOSE 3000
CMD ["build", "-p", "3000"]

