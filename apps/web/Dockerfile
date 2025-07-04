# apps/web/Dockerfile
FROM node:20

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3001

CMD ["npm", "run", "dev"]
