
FROM node:20.9.0 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN yarn build


FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html/front-end

RUN mkdir -p /usr/share/nginx/html/front-end

COPY --from=build /app/build .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
