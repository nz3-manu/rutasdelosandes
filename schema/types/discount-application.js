
const DiscountApplication = {
  "name": "DiscountApplication",
  "kind": "INTERFACE",
  "fieldBaseTypes": {
    "allocationMethod": "DiscountApplicationAllocationMethod",
    "targetSelection": "DiscountApplicationTargetSelection",
    "targetType": "DiscountApplicationTargetType",
    "value": "PricingValue"
  },
  "possibleTypes": ["AutomaticDiscountApplication", "DiscountCodeApplication", "ManualDiscountApplication", "ScriptDiscountApplication"]
};
export default DiscountApplication;