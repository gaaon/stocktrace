FROM node:14.4

WORKDIR /app

COPY . .
RUN npm i && npm run build

CMD ["npm", "start"]