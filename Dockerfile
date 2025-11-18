# Stage de build
FROM node:20.9.0 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install
# ou:
# RUN npm ci

COPY . .

RUN npm run build

FROM node:20.9.0 AS runtime

WORKDIR /app
COPY --from=build /app ./

CMD ["tail", "-f", "/dev/null"]

# CMD ["node", "dist/index.js"]
