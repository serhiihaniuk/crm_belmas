// @ts-nocheck
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

import { typeDefs } from './graphql/schema';
import graphQlResolvers from './graphql/resolvers/index';
import httpHeadersPlugin from 'apollo-server-plugin-http-headers';
import info from './helpers/info';

import dotenv from 'dotenv';

dotenv.config()
const workingMode = process.env.NODE_ENV;
info('Starting server in ' + workingMode + ' mode');
const corsOptions = {
	credentials: true,
	origin: 'http://localhost:3002'
};
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

let apolloServer: any;

async function startApolloServer() {
	apolloServer = new ApolloServer({
		// cors: true,
		plugins: [ApolloServerPluginLandingPageGraphQLPlayground(), httpHeadersPlugin],
		typeDefs: typeDefs,
		resolvers: graphQlResolvers,
		context: ({ req, res }) => ({
			req,
			res,
			setCookies: [],
			setHeaders: []
		})
	});
	await apolloServer.start();
	apolloServer.applyMiddleware({
		app,
		cors: corsOptions
	});
}

startApolloServer().then(() => {
	info('Apollo server started, path: ' + apolloServer.graphqlPath);
});

let db;
const dataBaseURI: any = workingMode === 'production' ? process.env.MONGO_URI_LOCAL : process.env.MONGO_URI_DEVELOPMENT;
info('connecting to database ' + dataBaseURI);

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
			info(`Server running on port ${process.env.PORT}`);
			info(`gql path is ${apolloServer.graphqlPath}`);
		});
	} catch (err) {
		console.log(err);
	}
}

startDB().then(() => {
	info('...');
});

export default db;
