# Dockerfile (para homolog e produção)

FROM node:20.9.0

WORKDIR /app

COPY build ./build

RUN npm install -g serve

CMD ["serve", "-s", "build", "-l", "80"]

