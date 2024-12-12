FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install -g pnpm pm2 && pnpm install

COPY . .

RUN pnpm run build

CMD ["pm2-runtime", "start", "dist/src/main.js", "--name", "kadabites-api"]