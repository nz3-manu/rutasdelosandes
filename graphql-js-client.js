import fetch from 'node-fetch';
import Client from 'graphql-js-client';
import types from './schema/types';

global.fetch = fetch;
let shopifyStoreName = "randes-store";

export default new Client(types, {
  url: `https://${shopifyStoreName}.myshopify.com/api/graphql`,
  fetcherOptions: {
    headers: {
      'X-Shopify-Storefront-Access-Token': 'e61c79b2a527a6255dd60c3233ef2a28'
    }
  }
});
