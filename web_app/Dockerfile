# stage1 as builder
FROM node:12-alpine

RUN mkdir /api
WORKDIR /api

COPY . .

EXPOSE 3000

RUN apk add --no-cache --virtual .gyp \
        python \
		python3 \
        make \
        g++

RUN npm install

RUN apk del .gyp

ENTRYPOINT ["npm", "start"]
