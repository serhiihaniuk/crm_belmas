const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { ApolloServer } = require("apollo-server-express");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const { typeDefs } = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const httpHeadersPlugin = require("apollo-server-plugin-http-headers");

require("dotenv").config();
const corsOptions =  {
  credentials: true,
      origin: '*',
};
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.get('/', (req, res)=>{

  res.send('welcome to express app');
});

let apolloServer;

async function startServer() {
  apolloServer = new ApolloServer({
    cors: true,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
      httpHeadersPlugin,
    ],
    typeDefs: typeDefs,
    resolvers: graphQlResolvers,
    context: ({ req, res }) => ({
      req,
      res,
      setCookies: [],
      setHeaders: [],
    }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: corsOptions,
  });
}

startServer();
let db
async function start() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err) => {
        if (err) {
          console.log(err);
        }
        console.log("Connected to mongoDB");
        db = mongoose.connection.db
      }
    );
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
      console.log(`gql path is ${apolloServer.graphqlPath}`)
    });
  } catch (err) {
    console.log(err);
  }
}

start();

module.exports = db
