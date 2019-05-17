import fetch from 'node-fetch';
import Client from 'graphql-js-client';
import typeBundle from './types';

global.fetch = fetch;

export default new Client(typeBundle, {
  url: 'https://randex.myshopify.com/api/graphql',
  fetcherOptions: {
    headers: {
      'X-Shopify-Storefront-Access-Token': '11bf8bec9d7a1cb945e7ee6149433c49'
    }
  }
});
