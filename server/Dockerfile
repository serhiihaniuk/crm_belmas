FROM node:14 AS production

ENV NODE_ENV production
WORKDIR /usr/src/bns_server

COPY . .
RUN npm i
RUN npm run build

CMD [ "node", "./dist/app.js" ]
