const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');

const { typeDefs } = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const httpHeadersPlugin = require('apollo-server-plugin-http-headers');
const info = require('./helpers/info');

require('dotenv').config();
const workingMode = process.env.NODE_ENV;
info('Starting server in ' + workingMode + ' mode');
const corsOptions = {
	credentials: true,
	origin: 'http://localhost:3000'
};
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
	res.send('This is bns api');
});

let apolloServer;

async function startApolloServer() {
	apolloServer = new ApolloServer({
		cors: true,
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
const dataBaseURI = workingMode === 'production' ? process.env.MONGO_URI_LOCAL : process.env.MONGO_URI_DEVELOPMENT;
info('connecting to database ' + dataBaseURI);

async function startDB() {
	try {
		await mongoose.connect(
			dataBaseURI,
			{
				dbName: 'bnsdb',
				useNewUrlParser: true,
				useUnifiedTopology: true
			},
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

module.exports = db;
