FROM node:20.9.0 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20.9.0

WORKDIR /app

RUN npm install -g http-server

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["http-server", "/usr/share/nginx/html", "-p", "80"]
