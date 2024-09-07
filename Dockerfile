# Use uma imagem Node.js como base
FROM node:20.10.0

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package.json package-lock.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o restante dos arquivos do projeto para o diretório de trabalho
COPY . .

# Gere os tipos do Prisma
RUN npx prisma generate

# Construa o aplicativo Next.js
RUN npm run build

# Exponha a porta em que o aplicativo Next.js é executado
EXPOSE 3000

# Comando para iniciar o servidor Next.js
CMD ["npm", "start"]
