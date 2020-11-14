
const CreditCardPaymentInputV2 = {
  "name": "CreditCardPaymentInputV2",
  "kind": "INPUT_OBJECT",
  "inputFieldBaseTypes": {
    "paymentAmount": "MoneyInput",
    "idempotencyKey": "String",
    "billingAddress": "MailingAddressInput",
    "vaultId": "String",
    "test": "Boolean"
  }
};
export default CreditCardPaymentInputV2;