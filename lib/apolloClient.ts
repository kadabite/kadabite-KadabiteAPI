import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Cookies from 'js-cookie';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_SERVER_GRAPHQL_URL,
});

const authLink = setContext((_, prevContext) => {
  // Ensure `prevContext.headers` is always initialized
  const headers = prevContext?.headers ? prevContext.headers : {};

  if (typeof window === 'undefined') {
    // On the server side, simply return the headers without adding an authorization token
    return { headers };
  }

  // On the client side, get the authentication token from cookies
  const token = Cookies.get('authToken');

  // Return the headers with the authorization token if it exists
  return {
    headers: {
      ...headers, // Ensure existing headers are not lost
      authorization: token ? `Bearer ${token}` : '', // Add the token if available
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
