import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { HelloQuery } from './graphql/queries/hello.query';

const httpLink = createHttpLink({
  uri: '/graphql',
  credentials: 'same-origin' // fullstack hosted on single domain
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  //uri: process.env.SCHEMA_PATH ?? '/graphql',
  cache: new InMemoryCache(),
  link: errorLink.concat(httpLink),
});

// Check that client has successfully connected to graphql endpoint
client.query({ query: HelloQuery })
  .then(result => console.log(result.data));

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
