FROM node:20-alpine

WORKDIR /AMS_frontend

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD [ "npm","run","dev" ]