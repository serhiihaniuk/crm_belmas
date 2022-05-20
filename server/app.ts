import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

import { typeDefs } from './graphql/schema';
import graphQlResolvers from './graphql/resolvers/index';
import log from './helpers/info';

import dotenv from 'dotenv';

dotenv.config();
const workingMode = process.env.NODE_ENV || 'http://localhost:3002'
log.info('app',`Working mode: ${workingMode}`);

const corsOptions = {
	credentials: true,
	origin: 'http://localhost:3000'
};
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

let apolloServer: any;

async function startApolloServer() {
	apolloServer = new ApolloServer({
		// cors: true,
		plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
		typeDefs: typeDefs,
		resolvers: graphQlResolvers,
		context: ({ req, res }) => ({
			req,
			res
		})
	});
	await apolloServer.start();
	apolloServer.applyMiddleware({
		app,
		cors: corsOptions
	});
}

startApolloServer().then(() => {
	log.info('app','Apollo server started, path: ' + apolloServer.graphqlPath);
});

let db;
const dataBaseURI = "mongodb://admin_bns:password@localhost:27017"
log.info('app','connecting to database ' + dataBaseURI);

async function startDB() {
	try {
		await mongoose.connect(
			dataBaseURI,
			{
				dbName: 'bnsdb',
				useNewUrlParser: true,
				useUnifiedTopology: true
			} as any,
			(err) => {
				if (err) {
					console.error(err);
					return;
				}
				db = mongoose.connection.db;
			}
		);
		app.listen(3001, () => {
			log.info('app',`Server running on port ${process.env.PORT}`);
			log.info('app',`gql path is ${apolloServer.graphqlPath}`);
		});
	} catch (err) {
		console.log(err);
	}
}

startDB().then(() => {
	log.info('app','working...');
});

export default db;
