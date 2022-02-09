FROM node:14 AS production

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PASSWORD=admin \
    MONGO_USER=bnsbackend \
    MONGO_PASSWORD=password \
    MONGO_URI_LOCAL=mongodb://admin_bns:password@mongodb \
    PORT=6000 \
    NODE_ENV=production \
    ACCESS_TOKEN_SECRET=bnsbackend

WORKDIR /usr/src/bns_server

COPY package.json .
COPY package-lock.json .

COPY . .
RUN npm install --production

CMD [ "node", "app.js" ]
