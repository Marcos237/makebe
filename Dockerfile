# Stage 1: Build React app
FROM node:20.9.0 AS build

# Define o diretório de trabalho para a construção da aplicação
WORKDIR /app

# Copie os arquivos de configuração do Yarn e do npm
COPY package*.json ./
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Execute o build da aplicação React
RUN yarn build

# Stage 2: Serve React app with Nginx
FROM nginx:alpine

# Defina o diretório de trabalho para onde o Nginx irá servir os arquivos
WORKDIR /usr/share/nginx/html/front-end

# Crie o diretório front-end, se não existir
RUN mkdir -p /usr/share/nginx/html/front-end

# Copie os arquivos da build do estágio anterior para o diretório do Nginx
COPY --from=build /app/build .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
