import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers';

const httpLink = new HttpLink({
  uri: 'https://api.graph.cool/simple/v1/cjju8z8ir24uj0102z5tvwe45',
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

render(
  <ApolloProvider client={apolloClient}>
    <Provider store={createStoreWithMiddleware(reducers)}>
      <App />
    </Provider>
  </ApolloProvider>,
  document.getElementById('root'),
);
