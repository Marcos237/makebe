FROM node:20.9.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN yarn build

RUN npm install -g http-server
EXPOSE 3000
CMD ["http-server", "build", "-p", "3000"]
