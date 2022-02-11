FROM node:14 as production

ENV NODE_ENV ${NODE_ENV}
WORKDIR /usr/src/bns_client

COPY . .

RUN npm install --production

RUN npm run build

CMD ["node", "server.js"]
