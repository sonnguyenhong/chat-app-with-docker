import React from 'react'
import { ApolloClient, InMemoryCache, createHttpLink, split, ApolloProvider as Provider } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import {setContext} from '@apollo/client/link/context'

let httpLink = createHttpLink({
    uri: process.env.REACT_APP_SERVER_URI
})

const wsLink = new GraphQLWsLink(createClient({
  url: process.env.REACT_APP_WS_URL,
  connectionParams: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
}))
console.log(process.env.REACT_APP_WS_URL)

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
})

httpLink = authLink.concat(httpLink)
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});

export default function ApolloProvider(props) {
    return <Provider client={client} {...props} />
}