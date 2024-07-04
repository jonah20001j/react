FROM node:20.10-alpine as build

# 在容器中建立資料夾
WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

COPY .next ./.next

CMD ["npm", "run", "dev"]
