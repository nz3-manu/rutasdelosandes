
const Payment = {
  "name": "Payment",
  "kind": "OBJECT",
  "fieldBaseTypes": {
    "amount": "Money",
    "billingAddress": "MailingAddress",
    "checkout": "Checkout",
    "creditCard": "CreditCard",
    "errorMessage": "String",
    "id": "ID",
    "idempotencyKey": "String",
    "ready": "Boolean",
    "test": "Boolean",
    "transaction": "Transaction"
  },
  "implementsNode": true
};
export default Payment;