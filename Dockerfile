
FROM node:20.9.0 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

COPY --from=build /app/build /usr/share/nginx/html

RUN npm install -g http-server
EXPOSE 3000
CMD ["http-server", "build", "-p", "3000"]
