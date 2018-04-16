import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
// import { ApolloLink, from } from 'apollo-link';
import { ApolloLink } from 'apollo-client-preset'
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { AUTH_TOKEN } from './constants'

const httpLink = new HttpLink({
    uri: 'http://localhost:4000'
});

const middlewareAuthLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem(AUTH_TOKEN)
    console.log(token);
    const authorizationHeader = token ? `Bearer ${token}` : null
    operation.setContext({
      headers: {
        authorization: authorizationHeader
      }
    })
    return forward(operation)
  })
  
const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink)

const client = new ApolloClient({
    link: middlewareAuthLink.concat(httpLink),
    cache: new InMemoryCache()
});

ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider> 
    </BrowserRouter>,
    document.getElementById('root')
);

registerServiceWorker();


