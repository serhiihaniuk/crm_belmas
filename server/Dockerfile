FROM node:14 AS production

ENV NODE_ENV production
WORKDIR /usr/src/bns_server

COPY . .
RUN npm install --production

CMD [ "node", "app.js" ]
