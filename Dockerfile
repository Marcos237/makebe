FROM node:20.9.0 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:latest

COPY --from=build /app/build /usr/share/nginx/html
COPY makebe.conf /etc/nginx/makebe.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

