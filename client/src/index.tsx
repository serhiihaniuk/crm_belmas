import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { setContext } from '@apollo/client/link/context';
const uri = 'http://localhost/graphql'
const httpLink = createHttpLink({
  uri: uri,
});
console.log(uri, 'changed uri');
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
  connectToDevTools: true,
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
