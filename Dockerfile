FROM node:20.9.0 as build

WORKDIR /app

COPY . /app

RUN npm install

RUN npm run build

# Etapa final
FROM node:20.9.0

WORKDIR /app

COPY --from=build /app /app

RUN npm install -g http-server

EXPOSE 3000

CMD ["http-server", "build", "-p", "3000"]
