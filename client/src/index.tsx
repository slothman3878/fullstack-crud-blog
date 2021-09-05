import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { HelloQuery } from './graphql/queries/hello.query';

const client = new ApolloClient({
  uri: process.env.SCHEMA_PATH ?? "http://localhost:5000/graphql",
  cache: new InMemoryCache()
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