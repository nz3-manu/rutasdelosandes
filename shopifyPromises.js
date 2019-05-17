import client from './graphql-js-client';
import {gql} from 'babel-plugin-graphql-js-client-transform';
var checkoutId = '1232321'

const shopNameAndProductsPromise = client.send(gql(client)`
    query {
      shop {
        name
        description
        products(first:20) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            node {
              id
              title
              options {
                name
                values
              }
              variants(first: 250) {
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                }
                edges {
                  node {
                    title
                    selectedOptions {
                      name
                      value
                    }
                    image {
                      src
                    }
                    price
                  }
                }
              }
              images(first: 250) {
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                }
                edges {
                  node {
                    src
                  }
                }
              }
            }
          }
        }
      }
    }
  `).then((result) => {
    return result.model.shop;
  }).catch((e) => { 
    console.log(e)
  });

  // Fetch the checkout
  const cartPromise = client.send(gql(client)`
    query ($checkoutId: ID!) {
      node(id: $checkoutId) {
        ... on Checkout {
          webUrl
          subtotalPrice
          totalTax
          totalPrice
          lineItems (first:250) {
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
            edges {
              node {
                title
                variant {
                  title
                  image {
                    src
                  }
                  price
                }
                quantity
              }
            }
          }
        }
      }
    }
  `, {checkoutId}).then((result) => {
    return result.model.node;
  });

function updateLineItem(checkoutId, quantity, id) {
  const input = {
    checkoutId,
    lineItems: [{ id, quantity }]
  };

  return client.send(
    gql(client)`
      mutation ($checkoutId: ID!, $lineItems: [CheckoutLineItemUpdateInput!]!) {
        checkoutLineItemsUpdate(checkoutId: $checkoutId, lineItems: $lineItems) {
          userErrors {
            message
            field
          }
          checkout {
            id
          }
        }
      }
    `,
    input
  );
}

export { updateLineItem, shopNameAndProductsPromise, cartPromise };
