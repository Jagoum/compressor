FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install -g .

ENTRYPOINT ["js-compressor"]
