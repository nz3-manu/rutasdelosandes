
const CheckoutCreateInput = {
  "name": "CheckoutCreateInput",
  "kind": "INPUT_OBJECT",
  "inputFieldBaseTypes": {
    "email": "String",
    "lineItems": "CheckoutLineItemInput",
    "shippingAddress": "MailingAddressInput",
    "note": "String",
    "customAttributes": "AttributeInput",
    "allowPartialAddresses": "Boolean",
    "presentmentCurrencyCode": "CurrencyCode"
  }
};
export default CheckoutCreateInput;