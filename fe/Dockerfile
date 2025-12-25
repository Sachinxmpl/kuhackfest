FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

RUN npm ci

COPY package.json ./
COPY src ./src
COPY next.config.ts tsconfig.json postcss.config.mjs tailwindcss.config.* ./
COPY .eslintrc* ./

EXPOSE 3000

CMD ["npm", "run", "dev"]