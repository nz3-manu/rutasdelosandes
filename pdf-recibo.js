import images from './data64Icons';

  /* Consiguiendo fecha */
  function timeConverter(ISO_TIME){
    var a = new Date(ISO_TIME);
    var months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Agos','Sep','Oct','Nov','Dic'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = date + ' ' + month + ' ' + year;
    return time;
  }

/* Format Number */
function formatMoney(n, c, d, t) {
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "," : d,
        t = t == undefined ? "." : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };
/* Información texto del email */
function emailInformation(order){
    var emailInformationObject ={};
    let orderData = order.data;
    let n = orderData.customer.name.split(' ')[0];
    let name = n.charAt(0).toUpperCase() + n.slice(1);
    let email = orderData.customer.email;
    emailInformationObject.name = name;
    emailInformationObject.email = email;

    return emailInformationObject
};

function generatePdfObject(order, items) { 

    var tableProduc = [ 
        { text: 'Producto', style: 'itemsHeader'}, 
        { text: 'Catidad', style: [ 'itemsHeader', 'center']}, 
        { text: 'Precio', style: [ 'itemsHeader', 'center']}, 
        { text: 'Descuento', style: [ 'itemsHeader', 'center']}, 
        { text: 'Total', style: [ 'itemsHeader', 'center']} 
    ]
    
    let orderData = order.data;

    var fechaIso8601 = orderData.meta.timestamps.created_at;
    var reciboNumero = fechaIso8601;
    
      var fechaEmision = timeConverter(fechaIso8601);

        /*Capitalized text*/
        function capitalize_Words(str) {
            return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        }

        var nombreCompleto = capitalize_Words(orderData.customer.name);
        var telefono = orderData.shipping_address.phone_number;
        var direccion = capitalize_Words(orderData.shipping_address.line_1) + capitalize_Words(orderData.shipping_address.line_2);
        var ciudad = capitalize_Words(orderData.shipping_address.city);
        var region =  capitalize_Words(orderData.shipping_address.county);
    
        /* Capturando Valor de Envío  */
        try {
            var arrayEnvio = items.data.filter((product)=> product.sku == "envio");
          
            if(arrayEnvio.length > 0){
                console.log("Array envio", arrayEnvio[0]);
                var vlrEnvio = arrayEnvio[0].unit_price.amount;
            } 
            else {
                console.log("else");
                vlrEnvio = 0;
            }  
        } catch (error) {
            console.log("error envio", error)
        }

        /* Tabla Total formato moneda */
        var subTotal = `$${formatMoney((parseInt(orderData.meta.display_price.with_tax.amount)- vlrEnvio),0,0)}`;
        var envio = `$${formatMoney(vlrEnvio,0,0)}`;
        var totalFactura= `$${formatMoney(orderData.meta.display_price.with_tax.amount,0,0)}`;
        
        /* Generando items Map*/ 
        var itemsProducts = items.data.filter((product)=>product.sku != "envio").map((product) => { 
        var producto= product.name;
        var descripcion = product.sku;
        var cantidad = product.quantity;
        var precioUnitario = ` $${formatMoney(product.unit_price.amount,0,0)}`;
        var precioTotalProduc = ` $${formatMoney(product.value.amount,0,0)}`;
        
        /* Precio Total Productos */
         return (       
                        [ 
                            [
                                { text: producto, style:'itemTitle'},
                                { text: descripcion, style:'itemSubTitle'}
                            ], 
                            {  text: cantidad, style:'itemNumber'}, 
                            { text: precioUnitario, style:'itemNumber'}, 
                            { text: "$0", style:'itemNumber'}, 
                            { text: precioTotalProduc, style:'itemTotal'} 
                        ]
                )
        })
        
        let bodyItems = [tableProduc].concat(itemsProducts);
                         
    var docDefinition = {
        header: {
         columns: [
           { text: '', style: 'documentHeaderLeft' },
           { text: '', style: 'documentHeaderCenter' },
           { text: '', style: 'documentHeaderRight' }
         ]
       },
       footer: {
         columns: [
           { text: '', style: 'documentFooterLeft' },
           { text: ' www.rutasdelosandes.com', style: 'documentFooterCenter' },
           { text: '', style: 'documentFooterRight' }
         ]
       },
       content: [
           // Pdf estructura
           {
               columns: [
                   {
                         image: images.logoRecibo,
                         width: 100
                   },
                       
                   [
                       {
                           text: 'RECIBO', 
                           style: 'invoiceTitle',
                           width: '*'
                       },
                       {
                         stack: [
                              {
                                  columns: [
                                       {
                                           text: 'Recibo Nº', 
                                           style:'invoiceSubTitle',
                                           width: '*'
                                           
                                       }, 
                                       {
                                           text: reciboNumero,
                                           style:'invoiceSubValue',
                                           width: 100
                                           
                                       }
                                       ]
                              },
                              {
                                  columns: [
                                      {
                                          text:'Fecha de Emisión',
                                          style:'invoiceSubTitle',
                                          width: '*'
                                      }, 
                                      {
                                          text: fechaEmision,
                                          style:'invoiceSubValue',
                                          width: 100
                                      }
                                      ]
                              },
                              {
                                  columns: [
                                      {
                                          text:'',
                                          style:'invoiceSubTitle',
                                          width: '*'
                                      }, 
                                      {
                                          text:'',
                                          style:'invoiceSubValue',
                                          width: 100
                                      }
                                      ]
                              },
                          ]
                       }
                   ],
               ],
           },
                   {
                       text: ' Rutas De Los Andes  \n rutasdelosandes@gmail.com \n  3137932231 \n  ',
                       style:'invoiceBillingTitleLogo',
                       
                   },
                   '\n\n',
                   {
                       text: ' Datos Del Cliente',
                       style:'header',
                       
                   },
           // Billing Headers
           {
               columns: [
                  
                   {
                       text: ' Datos del destinatario',
                       style:'invoiceBillingTitle',
                       
                   },  {
                       text: 'Dirección de envío',
                       style:'invoiceBillingTitle',
                       
                   }
               ]
           },
           // Billing Details
           {
               columns: [
                   
                   {
                       text:  `Nombre: ${nombreCompleto} \n Telefono: ${telefono}` ,
                       style: 'invoiceBillingDetails'
                   }, {
                       text: `${direccion} \n  ${ciudad}, ${region} `,
                       style: 'invoiceBillingDetails'
                   }
                   
               ]
           },
           '\n\n',
           '\n\n',
            {
                       text: 'RESUMEN DE LA COMPRA',
                       style:'header',
                       
                   },
    
             // Line breaks
           '\n\n',
           // Items
             {
               table: {
                 // headers are automatically repeated if the table spans over multiple pages
                 // you can declare how many rows should be treated as headers
                 headerRows: 1,
                 widths: [ '*', 50, 'auto', 'auto', 100 ],
         
                 body: bodyItems
               }, // table
             //  layout: 'lightHorizontalLines'
             },
          // TOTAL
             {
               table: {
                 // headers are automatically repeated if the table spans over multiple pages
                 // you can declare how many rows should be treated as headers
                 headerRows: 0,
                 widths: [ '*', 80 ],
         
                 body: [
                   // Total
                   [ 
                       {
                           text:'Subtotal',
                           style:'itemsFooterSubTitle'
                       }, 
                       { 
                           text: subTotal,
                           style:'itemsFooterSubValue'
                       }
                   ],
                   [ 
                       {
                           text:'Envío',
                           style:'itemsFooterSubTitle'
                       },
                       {
                           text: envio,
                           style:'itemsFooterSubValue'
                       }
                   ],
                   [ 
                       {
                           text:'TOTAL',
                           style:'itemsFooterTotalTitle'
                       }, 
                       {
                           text: totalFactura,
                           style:'itemsFooterTotalValue'
                       }
                   ],
                 ]
               }, // table
               layout: 'lightHorizontalLines'
             },
           // Signature
           {
               columns: [
                   {
                       text:'',
                   },
                   {
                       stack: [
                           { 
                               text: '',
                               style:'signaturePlaceholder'
                           },
                           { 
                               text: '',
                               style:'signatureName'
                               
                           },
                           { 
                               text: '',
                               style:'signatureJobTitle'
                               
                           }
                           ],
                      width: 180
                   },
               ]
           },
             { 
                 text: 'NOTA',
                 style:'notesTitle'
             },
             { 
                 text: 'Esta información es la que se suministrara para el envío de los productos. Si la información no corresponde a los datos de envío, le pedimos por favor comunicarse lo mas pronto con nosotros.',
                 style:'notesText'
             }
       ],
       styles: {
           // Document Header
           documentHeaderLeft: {
               fontSize: 10,
               margin: [5,5,5,5],
               alignment:'left'
           },
           header:{
               alignment:'center',
               fontSize: 18,
               bold: true,
           },
           documentHeaderCenter: {
               fontSize: 10,
               margin: [5,5,5,5],
               alignment:'center'
           },
           documentHeaderRight: {
               fontSize: 10,
               margin: [5,5,5,5],
               alignment:'right'
           },
           // Document Footer
           documentFooterLeft: {
               fontSize: 10,
               margin: [5,5,5,5],
               alignment:'left'
           },
           documentFooterCenter: {
               fontSize: 10,
               margin: [5,5,5,5],
               alignment:'center'
           },
           documentFooterRight: {
               fontSize: 10,
               margin: [5,5,5,5],
               alignment:'right'
           },
           // Invoice Title
         invoiceTitle: {
           fontSize: 22,
           bold: true,
           alignment:'right',
           margin:[0,0,0,15]
         },
         // Invoice Details
         invoiceSubTitle: {
           fontSize: 12,
           alignment:'right',
           textTransform: 'capitalize'
         },
         invoiceSubValue: {
           fontSize: 12,
           alignment:'right',
           textTransform: 'capitalize'
         },
         // Billing Headers
         invoiceBillingTitle: {
           fontSize: 14,
           bold: true,
           alignment:'left',
           margin:[0,20,0,5],
         },
         // Billing Details
         invoiceBillingDetails: {
           alignment:'left'
     
         },
         invoiceBillingAddressTitle: {
             margin: [0,7,0,3],
             bold: true
         },
         invoiceBillingAddress: {
             
         },
         // Items Header
         itemsHeader: {
             margin: [0,5,0,5],
             bold: true
         },
         // Item Title
         itemTitle: {
             bold: true,
         },
         itemSubTitle: {
                 italics: true,
                 fontSize: 11
         },
         itemNumber: {
             margin: [0,5,0,5],
             alignment: 'center',
         },
         itemTotal: {
             margin: [0,5,0,5],
             bold: true,
             alignment: 'center',
         },
       invoiceBillingTitleLogo:{
           fontSize: 9,
           italics: true,
           bold: true
       },
     
         // Items Footer (Subtotal, Total, Tax, etc)
         itemsFooterSubTitle: {
             margin: [0,5,0,5],
             bold: true,
             alignment:'right',
         },
         itemsFooterSubValue: {
             margin: [0,5,0,5],
             bold: true,
             alignment:'center',
         },
         itemsFooterTotalTitle: {
             margin: [0,5,0,5],
             bold: true,
             alignment:'right',
         },
         itemsFooterTotalValue: {
             margin: [0,5,0,5],
             bold: true,
             alignment:'center',
         },
         signaturePlaceholder: {
             margin: [0,70,0,0],   
         },
         signatureName: {
             bold: true,
             alignment:'center',
         },
         signatureJobTitle: {
             italics: true,
             fontSize: 10,
             alignment:'center',
         },
         notesTitle: {
           fontSize: 10,
           bold: true,  
           margin: [0,50,0,3],
         },
         notesText: {
           fontSize: 10
         },
         center: {
             alignment:'center',
         },
       },
       defaultStyle: {
         columnGap: 20,
       }
     }
      return  docDefinition
  }
  export default {generatePdfObject, emailInformation, formatMoney}
  