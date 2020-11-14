
const Order = {
  "name": "Order",
  "kind": "OBJECT",
  "fieldBaseTypes": {
    "currencyCode": "CurrencyCode",
    "customerLocale": "String",
    "customerUrl": "URL",
    "discountApplications": "DiscountApplicationConnection",
    "email": "String",
    "id": "ID",
    "lineItems": "OrderLineItemConnection",
    "name": "String",
    "orderNumber": "Int",
    "phone": "String",
    "processedAt": "DateTime",
    "shippingAddress": "MailingAddress",
    "shippingDiscountAllocations": "DiscountAllocation",
    "statusUrl": "URL",
    "subtotalPrice": "Money",
    "subtotalPriceV2": "MoneyV2",
    "successfulFulfillments": "Fulfillment",
    "totalPrice": "Money",
    "totalPriceV2": "MoneyV2",
    "totalRefunded": "Money",
    "totalRefundedV2": "MoneyV2",
    "totalShippingPrice": "Money",
    "totalShippingPriceV2": "MoneyV2",
    "totalTax": "Money",
    "totalTaxV2": "MoneyV2"
  },
  "implementsNode": true
};
export default Order;