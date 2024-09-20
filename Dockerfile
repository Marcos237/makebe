FROM node:20.9.0 as build

WORKDIR /app

COPY . /app

RUN npm install

RUN npm run build

FROM node:20.9.0

WORKDIR /app

COPY --from=build /app /app

CMD ["tail", "-f", "/dev/null"]
