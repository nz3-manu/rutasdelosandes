
const Product = {
  "name": "Product",
  "kind": "OBJECT",
  "fieldBaseTypes": {
    "availableForSale": "Boolean",
    "collections": "CollectionConnection",
    "createdAt": "DateTime",
    "description": "String",
    "descriptionHtml": "HTML",
    "handle": "String",
    "id": "ID",
    "images": "ImageConnection",
    "metafield": "Metafield",
    "metafields": "MetafieldConnection",
    "onlineStoreUrl": "URL",
    "options": "ProductOption",
    "priceRange": "ProductPriceRange",
    "productType": "String",
    "publishedAt": "DateTime",
    "tags": "String",
    "title": "String",
    "updatedAt": "DateTime",
    "variantBySelectedOptions": "ProductVariant",
    "variants": "ProductVariantConnection",
    "vendor": "String"
  },
  "implementsNode": true
};
export default Product;