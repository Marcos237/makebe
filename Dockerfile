FROM node:latest

WORKDIR /temp/react
COPY . .

RUN rm -rf node_modules

RUN npm install

RUN npm run build

RUN mkdir -p /var/www/html

RUN mv dist/* /var/www/html 

WORKDIR /

RUN rm -rf /temp/react

RUN npm install -g http-server
EXPOSE 3000
CMD ["http-server", "build", "-p", "3000"]
