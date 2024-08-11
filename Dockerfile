FROM node:20.9.0 as build

WORKDIR /app

COPY . /app

RUN npm install

RUN npm run build

FROM node:20.9.0

WORKDIR /app

COPY --from=build /app/build /app/build

RUN npm install -g http-server

EXPOSE 3000

CMD ["http-server", "build", "-p", "3000"]

