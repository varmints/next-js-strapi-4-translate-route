import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  from,
  HttpLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const httpLink = new HttpLink({
  uri: "http://localhost:1337/graphql",
});

// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError)
    console.error(`[Network error]: ${JSON.stringify(networkError, null, 2)})`);
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]), // `httpLink` must be the last
  cache: new InMemoryCache(),
}); //

export default client;
