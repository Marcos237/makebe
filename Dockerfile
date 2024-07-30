FROM node:20.9.0 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN yarn build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /app/build .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
