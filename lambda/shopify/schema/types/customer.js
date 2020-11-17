
const Customer = {
  "name": "Customer",
  "kind": "OBJECT",
  "fieldBaseTypes": {
    "acceptsMarketing": "Boolean",
    "addresses": "MailingAddressConnection",
    "createdAt": "DateTime",
    "defaultAddress": "MailingAddress",
    "displayName": "String",
    "email": "String",
    "firstName": "String",
    "id": "ID",
    "lastIncompleteCheckout": "Checkout",
    "lastName": "String",
    "orders": "OrderConnection",
    "phone": "String",
    "tags": "String",
    "updatedAt": "DateTime"
  },
  "implementsNode": false
};
export default Customer;