FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json*  ./

RUN npm ci

COPY prisma ./prisma
COPY tsconfig.json ./

COPY . .

RUN npm run db:generate

EXPOSE 4000

CMD ["npm", "run", "dev"]