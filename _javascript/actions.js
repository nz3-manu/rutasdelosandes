export const SETINITIAL = 'setInitial';
export const EXPANSIONCHANGE = 'expansionchange';
export const SETSTEP = 'setstep';
export const SETSPAYMENT = 'setPaymentMethod';
export const SETSHIPPING = 'setShipping'
export const SETPRODUCT = 'setProduct'
export const SETORDER = 'setOrder'
export const SETLOADING = 'setLoading'
export const SETCARTITEMS = 'setCartItems'
export const SETPRODUCTS = 'setProducts'
import { introspectionQuery, buildSchema } from 'graphql'; // ES6

export function changeExpansion(index) {
    return { type: EXPANSIONCHANGE, index };
}
export function setStep(index) {
    return { type : SETSTEP, index }
};
export function setCash(cashData) {
    return { type: SETSPAYMENT, data : { payment: { type: "cash", ...cashData } }}
};
export function setCredit(cardData) {
    return { type: SETSPAYMENT, data : { payment: { type: "credit", ...cardData } }}
};
export function setPse(pseData) {
    return { type: SETSPAYMENT, data : { payment: { type: "pse", ...pseData } }}
};
export function setShipping(shippingData) { 
    return { type: SETSPAYMENT, data: { shipping: shippingData  } }
}
export function setProduct(productData) { 
    return { type: SETPRODUCT, data: { product: productData  } }
}
export function setOrder(id) {
    return { type: SETORDER, data: { order: id  } }
}
export function setLoading(value) {
    return { type: SETLOADING, data: { loading: value  } }
}
export function setCartItems(value) {
    return { type: SETCARTITEMS, data: { cart: value  } }
}
export function setProducts(value) {
    return { type: SETPRODUCTS, data: { products: value  } }
}

export function updateOrder(orderid, values) {
    let dataString = JSON.stringify({ values })  
    return dispatch => { 
        return fetch(`/updateorder?orderid=${orderid}`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: dataString
        }).then(function (response) { 
            dispatch(setOrders(response))
        }).catch((reason) => { 
            console.log(reason)
        })
    }
}

export function getOrder(shipping, cart, index) { 
    return dispatch => { 
        dispatch(setLoading(true))
        let dataString = JSON.stringify({ shipping, cart })  
       return fetch(`/order`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
            },
            body: dataString
       }).then(function (response) { return response.json(); }).then((data) => {
            dispatch(setLoading(false))
           if (data.errors) {
               if (data.errors[0].status == "400") {
                   alert("alguien compro el elemento que tratabas de comprar :(")
               }
               else { 
                   alert(data.errors[0].detail)
               }
               window.location.href = `/`
           }
           else { 
            dispatch(setOrder(data.order))
            dispatch(setStep(index))
           } 
        })
    } 
}

export function getProducts() { 
    return (dispatch) => { 
        let dataString = JSON.stringify({ message:"give me my products" })  
        return fetch(`/getproducts`, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        }).then(function (response) { return response.json(); }).then((products) => {
           // var productsSchemaObject = buildSchema(schema);
            console.log(`products in action get products`, products)
            dispatch(setProducts(products))
        })
    }
}
export function getCart() { 
    return (dispatch) => { 
        let dataString = JSON.stringify({ message:"give me my cart" })  
        return fetch(`/getcart`, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        }).then(function (response) { return response.json(); }).then((data) => {
            dispatch(setCartItems(data))
        })
    }
}

export function deleteItem(id,quantity) { 
    return (dispatch) => { 
        let dataString = JSON.stringify({ id:id, quantity:quantity })  
        return fetch(`/editcart`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: dataString
        }).then(function (response) { return response.json(); }).then((data) => {
            dispatch(setCartItems(data))
        })
    }
}
export function checkoutToServer (order, payment, shipping, cart) {
    return (dispatch) => { 
        let dataString = JSON.stringify({ order, payment, shipping, cart })  
        dispatch(setLoading(true))
        return fetch(`/pay`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: dataString
        }).then(function (response) { return response.json(); }).then((data) => {
            dispatch(setLoading(false))
           /* cash
            {
                "code": "SUCCESS",
                "error": null,
                    "transactionResponse": {
                    "orderId": 1016667832,
                    "transactionId": "9408d170-a968-4a3e-9ea2-36f3a100f53a",
                    "state": "PENDING",
                    "paymentNetworkResponseCode": null,
                    "paymentNetworkResponseErrorMessage": null,
                    "trazabilityCode": null, "authorizationCode": null,
                    "pendingReason": "AWAITING_NOTIFICATION",
                    "responseCode": "PENDING_TRANSACTION_CONFIRMATION",
                    "errorCode": null,
                    "responseMessage": null,
                    "transactionDate": null,
                    "transactionTime": null,
                    "operationDate": null,
                    "referenceQuestionnaire": null,
                    "extraParameters": {
                        "EXPIRATION_DATE": 1522368000000,
                        "URL_PAYMENT_RECEIPT_PDF": "https://checkout.payulatam.com/ppp-web-gateway-payu/receipt?vid=1016667832Y9408d170a9684a3Yc79d87b2fdaa8f4",
                        "REFERENCE": 1016667832,
                        "URL_PAYMENT_RECEIPT_HTML": "https://checkout.payulatam.com/ppp-web-gateway-payu/app?vid=1016667832Y9408d170a9684a3Yc79d87b2fdaa8f4"
                    }, 
                    "additionalInfo": null
                }
            }
           */
          /* pse
            {"code":"SUCCESS",
            "error":null,
            "transactionResponse":{
                "orderId":1017216823,
                "transactionId":"92c9d2ca-603f-4536-9c07-7a11d678fc99",
                "state":"PENDING",
                "paymentNetworkResponseCode":null,
                "paymentNetworkResponseErrorMessage":null,
                "trazabilityCode":"325625562",
                "authorizationCode":null,
                "pendingReason":"AWAITING_NOTIFICATION",
                "responseCode":"PENDING_TRANSACTION_CONFIRMATION",
                "errorCode":null,
                "responseMessage":null,
                "transactionDate":null,
                "transactionTime":null,
                "operationDate":null,
                "referenceQuestionnaire":null,
                "extraParameters":
                {
                    "BANK_URL":"https://registro.pse.com.co/PSEUserRegister/StartTransaction.htm?enc=tnPcJHMKlSnmRpHM8fAbuxbnWtFDy4g0Yd75ANUnvtGkrBSLbMSxhSm7I9yrIWss",
                    "TRANSACTION_CYCLE":"1"
                },
                "additionalInfo":null}}
          */
         /* credit 
         
        */
            let { transactionResponse, error } = data    
            let errorMessage =  (transactionResponse && transactionResponse.responseCode) || error;
            console.log("data back from pay", data)
            if (data.errors) {
                if (data.errors[0].status == 400){
                    alert("alguien compro el elemento que tratabas de comprar :(")
                }
                else { 
                    alert(data.errors[0].detail)
                }
                window.location.href = `/`
            }
            else { 
                switch(payment.type) {
                    case "cash":
                        if (transactionResponse && transactionResponse.responseCode == "PENDING_TRANSACTION_CONFIRMATION") {
                            window.location.href = transactionResponse.extraParameters.URL_PAYMENT_RECEIPT_HTML;
                        }
                        else { 
                            alert(`tu transaccion fallo ${errorMessage}`);
                            window.location.href = `/confirmation?orderid=${data.orderId}&polTransactionState=6`;
                        }       
                        break;
                    case "pse":
                        if (transactionResponse && (transactionResponse.responseCode == "PENDING_AWAITING_PSE_CONFIRMATION" || transactionResponse.responseCode ==  "PENDING_TRANSACTION_CONFIRMATION")) {
                            console.log(transactionResponse.extraParameters)
                            window.location.href = transactionResponse.extraParameters.BANK_URL;   
                        }
                        else { 
                            alert(`tu transaccion fallo ${errorMessage}`);
                            window.location.href = `/confirmation?orderid=${data.orderId}&polTransactionState=6`;
                        }  
                        break;
                    case "credit":   
                        
                        if (transactionResponse && transactionResponse.responseCode == "APPROVED") {
                            window.location.href = `/confirmation?orderid=${data.orderId}&polTransactionState=4&lapPaymentMethodType=credito`;
                        }
                        else {
                            alert(`tu transaccion fallo ${errorMessage}`);
                            window.location.href = `/confirmation?orderid=${data.orderId}&polTransactionState=6`;
                        }  
                        break;    
                    default:
                       window.location.href = `/`                      
                }  
            }       
    })
    }
} 
