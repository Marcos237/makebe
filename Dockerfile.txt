FROM node:20.9.0 AS build

WORKDIR /nginx_front-end

COPY package*.json ./

RUN npm install

COPY . .

yarn build

FROM nginx:alpine


COPY --from=build-env /nginx_front-end/out .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
