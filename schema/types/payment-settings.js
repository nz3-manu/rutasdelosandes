
const PaymentSettings = {
  "name": "PaymentSettings",
  "kind": "OBJECT",
  "fieldBaseTypes": {
    "acceptedCardBrands": "CardBrand",
    "cardVaultUrl": "URL",
    "countryCode": "CountryCode",
    "currencyCode": "CurrencyCode",
    "enabledPresentmentCurrencies": "CurrencyCode",
    "shopifyPaymentsAccountId": "String",
    "supportedDigitalWallets": "DigitalWallet"
  },
  "implementsNode": false
};
export default PaymentSettings;