import client from './graphql-js-client.js';
import {gql} from 'babel-plugin-graphql-js-client-transform';
var checkoutId = '1232321';

const productByHandle = handle => {
  const input = {
    handle,
  };

  return client
    .send(
      gql(client)`
  query($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      descriptionHtml
      productType
      handle
      tags
      vendor
      options {
        id
        name
        values
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
      metafield(key: "app_key", namespace: "affiliates") {
        description
      }
      metafields(first: 5) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            description
          }
        }
      }
      priceRange {
        maxVariantPrice {
          amount
        }
        minVariantPrice {
          amount
        }
      }
      variants(first: 250) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            title
            sku
            availableForSale
            compareAtPriceV2 {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            image {
              src
            }
            price
            priceV2 {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }`,
      input,
    )
    .then(result => {
      return result;
    })
    .catch(e => {
      console.log(e);
    });
};

function createCheckout() {
  return client
    .send(
      gql(client)`
  mutation {
    checkoutCreate(input: {}) {
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
    )
    .then(result => {
      return result;
    })
    .catch(e => {
      console.log(e);
    });
}
const shopNameAndProductsPromise = client
  .send(
    gql(client)`
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
              handle
              collections(first: 5) {
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                }
                edges {
                  node {
                    title
                    handle
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
  `,
  )
  .then(result => {
    return result;
  })
  .catch(e => {
    console.log(e);
  });

const lineItemRemove = input =>
  client
    .send(
      gql(client)`
  mutation ($checkoutId: ID!, $lineItemIds: [ID!]!) {
     checkoutLineItemsRemove(checkoutId: $checkoutId, lineItemIds: $lineItemIds) {
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
      input,
    )
    .then(result => {
      return result;
    })
    .catch(e => {
      console.log(e);
    });

const lineItemAdd = input =>
  client
    .send(
      gql(client)`
  mutation ($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
    checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
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
      input,
    )
    .then(result => {
      return result;
    })
    .catch(e => {
      console.log(e);
    });
// Fetch the checkout
const fetchCheckout = checkoutId =>
  client
    .send(
      gql(client)`
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
  `,
      {checkoutId},
    )
    .then(result => {
      return result;
    })
    .catch(e => {
      console.log(e);
    });

function updateLineItem(checkoutId, quantity, id) {
  const input = {
    checkoutId,
    lineItems: [{id, quantity}],
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
    input,
  );
}

export {
  lineItemAdd,
  lineItemRemove,
  updateLineItem,
  shopNameAndProductsPromise,
  productByHandle,
  createCheckout,
  fetchCheckout,
};
