import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { Provider, useDispatch } from 'react-redux';
import { store } from './redux/store';
import { setContext } from '@apollo/client/link/context';
import info from './helpers/info';
import { onError } from '@apollo/client/link/error';
import { createErrorAction } from './redux/reducers/error-reducer';
import ErrorNotification from './components/ErrorNotification/ErrorNotification';

const workingMode = process.env.NODE_ENV ? 'development' : 'production';
info('Environment mode: ' + workingMode);

const uri = 'http://192.168.1.101:3001/graphql';

info('api_url: ' + String(uri));

const Root: React.FC = ({ children }) => {
    const dispatch = useDispatch();
    const httpLink = createHttpLink({
        uri: uri,
        credentials: 'include'
    });
    const authLink = setContext((_, { headers }) => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : ''
            }
        };
    });
    const onErrorLink = onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
            graphQLErrors.map(({ message, locations, path }) =>
                dispatch(
                    createErrorAction(
                        true,
                        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                    )
                )
            );
        }
        if (networkError) dispatch(createErrorAction(true, `[Network error]: ${networkError}`));
    });
    const client = new ApolloClient({
        link: authLink.concat(onErrorLink.concat(httpLink)),
        credentials: 'include',
        connectToDevTools: workingMode === 'development',
        cache: new InMemoryCache({})
    });
    return (
        <ApolloProvider client={client}>
            {children}
            <ErrorNotification />
        </ApolloProvider>
    );
};

ReactDOM.render(
    <Provider store={store}>
        <Root>
            <App />
        </Root>
    </Provider>,
    document.getElementById('root')
);

export type IApolloClient = any;
