import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { setContext } from '@apollo/client/link/context';
import info from "./helpers/info";

const workingMode = process.env.NODE_ENV ? 'development' : 'production' ;
info('Environment mode: ' + workingMode);

const uri = 'http://localhost:3001/graphql'

info('api_url: ' + String(uri));

const httpLink = createHttpLink({
  uri: uri,
  credentials: 'include',

});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  connectToDevTools: workingMode === 'development',
  cache: new InMemoryCache({

  })
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
);

export type IApolloClient = typeof client;
