import fetch from 'node-fetch';
import Client from 'graphql-js-client';
import types from './schema/types';

global.fetch = fetch;

export default new Client(types, {
  url: 'https://randex.myshopify.com/api/graphql',
  fetcherOptions: {
    headers: {
      'X-Shopify-Storefront-Access-Token': '11bf8bec9d7a1cb945e7ee6149433c49'
    }
  }
});
