# stage1 as builder
FROM node:12-alpine

WORKDIR /api

COPY . .

EXPOSE 3000

ENTRYPOINT ["npm", "start"]