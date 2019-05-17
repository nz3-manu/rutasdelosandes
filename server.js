const express = require('express'),
  app = express(),
  fs = require('fs'),
  https = require('https'),
  React = require('react'),
  ReactDOMServer = require('react-dom/server'),
  bodyParser = require('body-parser'),
  webpush = require('web-push'),
  path = require('path'),
  md5 = require('md5'),
  multer  = require('multer'),
  session = require('express-session'),
  request = require('request'),
  sm = require('sitemap'),
  Sentry = require('@sentry/node'),
  cheerio = require('cheerio');
  

  import { SheetsRegistry } from 'react-jss/lib/jss';
 import { updateLineItem, shopNameAndProductsPromise, cartPromise} from './shopifyPromises.js'
  import JssProvider from 'react-jss/lib/JssProvider';
  import {
    MuiThemeProvider,
    createMuiTheme,
    createGenerateClassName,
  } from '@material-ui/core/styles';
  import recipe from './recipe';
  import main from './imageProcess/custom-image';
  import blueGrey from '@material-ui/core/colors/blueGrey';

  let upload = multer();
  Sentry.init({ dsn: 'https://85af5db342274936a7088e5e00f3eb33@sentry.io/1225109' });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.errorHandler());
  // Optional fallthrough error handler
  app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + '\n');
  });
  
  app.get('/image/:name/thanks.jpg', main)
  
  require('es6-promise').polyfill();
  require('isomorphic-fetch');
  import { gateway as MoltinGateway } from '@moltin/sdk';
  
const Moltin = MoltinGateway({
  client_id: 'g5Yz702xpZjiUIeTwtZum4sy5IAEPfPZNRJx93Yw8P',
  client_secret: 'tvjrzCksvCfxUJAyz5CzDeiRkH7YQmXoBGq5IjJOQJ'
});

// push notifications
const vapidKeys = {
  publicKey:
    'BMYgIYpw8jtC_61DQFh9k0rJP-5XUrWIwsUAOOnJmJQOfdS94jSlk0C2q86F1ebI2Yln5yz6v-cTJ2h10GM-vd4',
  privateKey: 'z6scVphnKP7WPgjVeJZFgvGdMlrFT8V2hVEg08mnoms'
};

webpush.setVapidDetails(
  'mailto:rutasdelosandes@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

//server side fetch polifyll
import routes from './_javascript/routes';
import { match, RouterContext } from 'react-router';
import { write, read, push, sendToDevice, update, remove } from './chatbot/db';
import { Promise } from 'firebase';
import reducer from './_javascript/reducers';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
// set this var for react inner components
global.__preloaded__ = JSON.parse(
  fs.readFileSync('./_site/documents.json', 'utf8')
);

/* not secure yet */
if (process.env.NODE_ENV == 'production') {
  app.all('*', ensureSecure);
}

// const bot = require('./chatbot/bot.js');
// app.use(bot);
 
// Use the session middleware
app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    rolling: true,
    saveUninitialized: true,
    cookie: { maxAge: 7200000 }
  })
);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);
// ensure secure middleware
function ensureSecure(req, res, next) {
  if (req.secure) {
    next();
  } else {
    res.redirect(301, `https://${req.hostname}${req.url}`);
  }
}


//Push notifications actions
function getSubscriptionsFromDatabase() {
  return new Promise((resolve, reject) => {
    read('endpoints')
      .then(function(snapshot) {
        let subscriptionsRows = [];
        snapshot.forEach(function(childSnapshot) {
          subscriptionsRows.push({ [childSnapshot.key]: childSnapshot.val() });
        });
        resolve(subscriptionsRows);
      })
      .catch(reject);
  });
}
app.get('/api/actions/:action/:id', function(req, res) {
  console.log('push action', req.params.action, 'push id', req.params.id);
  res.setHeader('Content-Type', 'application/json');
  res
    .status(200)
    .send(
      JSON.stringify({
        url: 'https://rutasdelosandes.com/colombia/acaime.html'
      })
    );
});

app.post('/product-notify',upload.fields([]),function (req, res) {
  let { id, whatsapp, correo, nombre } = req.body;
  let origin = req.header('origin').toLowerCase()
  let source = req.query.__amp_source_origin
  Moltin.Products.Get(id)
    .then(product => { 
      push(`notify-user`, {nombre,whatsapp,correo,sku:product.data.sku});
      console.log(req.body, "user data sent from form")
      res.set('Access-Control-Allow-Origin', origin);
      res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD, PUT');
      res.set('Access-Control-Allow-Credentials', 'true');
      res.set('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');
      res.set('AMP-Access-Control-Allow-Source-Origin', source);
      res
        .json({"status": "ok","celular":"3113403572"});
      })
  })
  

app.post('/api/trigger-push-msg/', function(req, res) {
  if (req.body.secret == 'luna') {
    /*
		be ready for actions
		
		let actions = { 
			actions: [
				{
					action: 'buy',
					title: 'comprar',
					icon: '/images/demos/action-1-128x128.png'
				},
				{
					action: 'dissmiss',
					title: 'ignorar',
					icon: '/images/demos/action-2-128x128.png'
				}
			]
    } */
   
    let actions = {};
  
    let dataToSendObject = Object.assign({}, req.body, actions)
        if (dataToSendObject.icon.length == 0){
          dataToSendObject.icon = "/images/launcher-icon-4x.png";
        }
        if (dataToSendObject.image.length == 0) { 
          dataToSendObject.image = "/images/notifications/image.jpg"
        }
       
        dataToSendObject.badge = "/images/launcher-icon-3x.png";

        
        dataToSendObject.vibrate = [500, 100, 500]
    let dataToSend = JSON.stringify(dataToSendObject);
 
    getSubscriptionsFromDatabase()
      .then(function(subscriptionsRows) {
        let promiseChain = Promise.resolve();
		  	/* subscriptionsRows = [
					{
            "-LOjHGNqHoKw5YRUYNOb" : {
            endpoint: 'https://fcm.googleapis.com/fcm/send/dTnFD5ANZzY:APA91bE-iXvkBDyDy4ro6n5PUNrs9fSGHbOITupcFdawOxBKYZXSVrbvYFIdUWxN_bbCkbUHgGs6gqWF3lpBdgDhmv4DfqCcp4hwbCyhQ0wRWbojoIuAnLCaE8B2-B3C8eWNWdgB1br_',
            expirationTime: null,
            keys:
                { p256dh: 'BOLXAWZGM31z6g0P2W38kCoPmu2Rk8ljVZTI9p4NLcUNPO2v_BI4D5Ula1V4bhCBSYTxZyyaFAVhxP-Oxx470Z0',
                  auth: 'EGluh2nmkM02BXUub2jszA' 
                } 
            }
          }
        ] */
        for (let i = 0; i < subscriptionsRows.length; i++) {
          const subscriptionRow = subscriptionsRows[i];
          promiseChain = promiseChain.then(() => {
            return triggerPushMsg(subscriptionRow, dataToSend);
          });
        }
        return promiseChain;
      })
      .then(function() {
        res.status(200).send('ok');
      });
  } else {
    res.send('invalid secret');
  }
});
const deleteSubscriptionFromDatabase = function(id) {
  remove(`endpoints/${id}`);
};

var SuccesUserCount = 0;
var FailedUserCount = 0;

const triggerPushMsg = function(subscriptionRow, dataToSend) {
  return webpush
    .sendNotification(Object.values(subscriptionRow)[0], dataToSend)
    .then(obj => {
      console.log('message sent succesfully number', ++SuccesUserCount)
    })
    .catch(err => {
      if (err.statusCode === 410 || err.statusCode === 404) {
        console.log('i will delete a subscription from the db',++FailedUserCount);
        return deleteSubscriptionFromDatabase(Object.keys(subscriptionRow)[0]);
      } else {
        console.log('Subscription is no longer valid: ', err);
      }
    });
};
app.get('/api/trigger-push-msg', function(req, res) {
  res.status(200).send(`
	  <!doctype html>
	  <html>
	  <head>
		  <title> push notifications </title>
	  </head>
	  <body>
	  <form action="/api/trigger-push-msg/" method="post">
		  <label for="title"> title</label>
		  <input type="text" id="title" name="title"><br>
		  <label for="body"> body</label>
		  <input type="text" id="body" name="body"><br>
		  <label for="image"> image </label>
		  <input type="text" id="image" name="image"><br>
		  <label for="url"> url </label>
      <input type="text" id="url" name="url"><br>
      <label for="icon"> icon </label>
      <input type="text" id="icon" name="icon"><br>
		  <label for="id"> reference id</label>
		  <input type="text" id="id" name="id"><br>
		  <label for="secret"> secret </label>
		  <input type="text" id="secret" name="secret"><br>
		  <input type="submit" value="Submit">
	  </form>
	  </body>
	  </html>
	  `);
});
app.post('/api/save-subscription/', function(req, res) {
  var data = req.body;
  console.log('body of the subscribe ajax call', data);
  push(`endpoints`, data);
  res.status(200).send('ok');
});

app.get('/producto/availability/:id', function(req, res) {
  const id = req.params.id;
  Moltin.Inventories.All().then(inventories => {
    //res.setHeader('Content-Type', 'application/json');
    //res.status(200).send(JSON.stringify(variations))
    inventories = inventories.data.map((item) => { 
      let options = []
      let fakeAvailable = (item.available < 4)?item.available:4
      for (let i = 1; i <= fakeAvailable ; i++) { 
        options.push({selected:(i == 1)?'selected':'', label: i })
      }
      // overwrite real total
      return ({ ...item, total:fakeAvailable, options:options})
    })
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(200).send(JSON.stringify({ items: inventories }));
  });

  /*	Moltin.Products.All().then((products) => {
		let childrensDataObject = products.data.filter((prod) => { 
			let relationships = prod.relationships
			if (relationships.parent && relationships.parent.data.id == id) { 
				return prod;
			}
		})
			res.setHeader('Content-Type', 'application/json');
			res.status(200).send(JSON.stringify({ items: childrensDataObject }))	
		}) */
});
app.set('views', './views');
app.set('view engine', 'ejs');


app.get('/amp/producto/:slug', (req, res) => {
  const slug = req.params.slug;
  Moltin.Products.With('files, main_images, collections')
    .All()
    .then(products => {
      let allProducts = products.data;
      let product = allProducts.find(el => el.slug == slug);
      // product not found
      if (!product) { 
        return res.render('productnotfound');
      }
      //let productID = products.data[0].id
      // this is needed in order to get the variations matrix :(
      // this will get cached by google amp hopefully
      Moltin.Products.Get(product.id)
        .then(product => {
          let productById = product.data;
          let productInfo = productById.description.split("|")
          productById.description = productInfo[0]
          productById.specification = productInfo[1]
          productById.discount = (typeof productInfo[2] != "undefined") ? productInfo[2] : "";
          productById.originaprice = (typeof productInfo[3] != "undefined") ? productInfo[3] : "";
          let variationMatrix = productById.meta.variation_matrix;

          // Build the tree :
          let matrixKeys = [];
          var deepOBject = function(object, map) {
            Object.keys(object).forEach(key => {
              let keySumm = [...map, key];
              // Object.assign({}, map, { [key]: "" })
              if (typeof object[key] == 'object') {
                deepOBject(object[key], keySumm);
              } else {
                matrixKeys.push({ [object[key]]: keySumm });
              }
            });
          };
          deepOBject(variationMatrix, []);

          const permutator = inputArr => {
            let result = [];
            const permute = (arr, m = []) => {
              if (arr.length === 0) {
                result.push(m);
              } else {
                for (let i = 0; i < arr.length; i++) {
                  let curr = arr.slice();
                  let next = curr.splice(i, 1);
                  permute(curr.slice(), m.concat(next));
                }
              }
            };
            permute(inputArr);
            return result;
          };

          let allcombinatios = matrixKeys.map(currentValue => {
            let actualKey = Object.keys(currentValue)[0];
            let permutations = permutator(Object.values(currentValue)[0]);
            return { [actualKey]: permutations };
          });
          var allcombinatiosMatrix = {};
          allcombinatios.forEach(currentValue => {
            let key = Object.keys(currentValue)[0];
            let values = Object.values(currentValue)[0];
            values.forEach((currentValue, index, array) => {
              let reducedObject = currentValue.reduce(
                (valorAnterior, valorActual, indiceActual) => {
                  if (valorAnterior[valorActual]) {
                    return valorAnterior[valorActual];
                  } else {
                    if (indiceActual == currentValue.length - 1) {
                      valorAnterior[valorActual] = key;
                    } else {
                      valorAnterior[valorActual] = {};
                    }

                    return valorAnterior[valorActual];
                  }
                },
                allcombinatiosMatrix
              );
            });
          });

          let childrens = productById.relationships.children.data.map(
            product => {
              let productId = product.id;
              let productObject = allProducts.find(
                prod => prod.id == productId
              );
              let main_image = getMainImage(products.included, productObject);
              return Object.assign({}, productObject, {
                main_image: main_image
              });
            }
          );

          let defaultVariations = productById.meta.variations
            .map(variation => ({ [variation.name]: variation.options[0].id }))
            .reduce(function(acc, cur, i) {
              return Object.assign(acc, cur);
            }, {});

          let defaultChild = Object.values(defaultVariations).reduce(
            (valorAnterior, valorActual, indice, vector) => {
              return valorAnterior[valorActual];
            },
            allcombinatiosMatrix
          );

          let variationsParams = Object.keys(defaultVariations).reduce(
            (valorAnterior, valorActual, indice, vector) => {
              return (
                valorAnterior + `[product.variationSelected.${valorActual}]`
              );
            },
            `variationMatrix`
          );

          let priceExpression = `productAvailavility[${variationsParams}].meta.display_price.with_tax.formatted`;
          let quantityExpression = 'product.quantity';

          //	let main_image = getMainImage(products.included, product.relationships.main_image.data.id)
          //	let files = getFiles(products.included, product.relationships.files)
          let productDisplay = Object.assign(
            {},
            productById,
            { childrens },
            { variations: allcombinatiosMatrix },
            { defaultChild },
            { defaultVariations: defaultVariations },
            { url: `producto/${slug}`}
          );
          res.render('product', {
            product: productDisplay,
            variationsParams,
            priceExpression,
            quantityExpression
          });
        })
        .catch(e => {
          console.log(e)
        });
    })
    .catch(e => {
      console.log(e);
    });
});


const clearCart = (cartId) => { 
    return Moltin.Cart(cartId)
    .Delete()
}

app.post('/order', (req, res) => {
  let { shipping, cart } = req.body;
  
  // some stupid browsers send trailing and leading spaces in the form
  shipping = trimObjValues(shipping)
  res.setHeader('Content-Type', 'application/json');

  let MoltinShipping = {
    first_name: shipping.name,
    last_name: 'notset',
    line_1: shipping.address,
    line_2: '',
    phone_number: shipping.phone,
    county: shipping.deparment,
    city: shipping.city,
    postcode: 'CA94040',
    instructions: shipping.instructions,
    country: shipping.country
  };

  let customer = {
    name: shipping.name,
    email: shipping.email
  };

  Sentry.configureScope((scope) => {
    scope.setTag("invalid-input", "wrong-order");
    scope.setUser(shipping);

    Moltin.Cart(cart.id)
    .Checkout(customer, MoltinShipping)  
    .then(order => {
      res.status(200).send(JSON.stringify({order: order.data.id}));
    }).catch(function (reason) {
      Sentry.captureException(reason);
      console.log(`order create failed for ${JSON.stringify(shipping)} reason ${reason} cart id: ${cart.id}`)
      clearCart(cart.id)
      // not enought stock
      res.status(500).send(JSON.stringify(reason));
    });
  });
})

function deallocateOrder(cartId){ 
  // traer el cart ciclar sobre los items e incrementarlos al inventario
 return Moltin.Cart(cartId)
  .Items()
    .then(items => {
      return items.data.filter((item)=>item.sku != "envio").reduce((promise, item) => {
        return promise.then((() => Moltin.Inventories.DeallocateStock(item.product_id, item.quantity))).catch((e) => { console.log("something went wrong incrementing cart",e)})
        }, Promise.resolve());
    })
}

function trimObjValues(obj) {
  return Object.keys(obj).reduce((acc, curr) => {
    acc[curr] = obj[curr].trim()
    return acc;
  }, {});
}



app.get(`/orderslist`, (req, res) => { 
  if (req.query.pass == "luna") {
    Moltin.Orders.All().then(orders => {
      mathRouter(req, res, { orders: orders.data, loading: false });
    })
  }
  else { 
    res.status(200).send(JSON.stringify({err:"no autorizado"}));
  } 
})

app.post(`/updateorder`, (req,res) => { 
  let orderId = req.query.orderid
  let { values } = req.body;
  console.log(orderId,values)
  Moltin.Orders.Update(orderId, values).then(order => {
    res.status(200).send({order})
  }).catch(function (reason) {
    console.log(reason)
    res.status(500).send(JSON.stringify(reason));
})
})

app.post(`/notify`, (req, res) => {
  let orderId = req.query.orderid;
  let sucess = false;
  let rejected = true;
  let notifyData = req.body;
  let paymentName = "";
  //Logic for this stuff
  //efectivo
  if (notifyData.payment_method_type == 7) {
    paymentName = "efectivo"
    if (notifyData.state_pol == 4) {
      // el usuario pago en efectivo con exito
      sucess = true;
      rejected = false;
    } else {
      // el usuario dejo vencer la factura o fue rechazada
      sucess = false;
      rejected = true;
    }
  }
  //tarjeta de credito
  else if (notifyData.payment_method_type == 2) {
    paymentName = "tarjeta de credito"
    if (notifyData.state_pol == 4) {
      // el usuario pago con tarjeta
      sucess = true;
      rejected = false;
    } else {
      // el usuario dejo vencer la factura o fue rechazada
      sucess = false;
      rejected = true;
    } 
  }
  //PSE
  else if (notifyData.payment_method_type == 4) {
    paymentName = "PSE"
    if (notifyData.state_pol == 4) {
      // el usuario pago con PSE
      sucess = true;
      rejected = false;
    } else {
      // el usuario dejo vencer la factura o fue rechazada
      rejected = true;
      sucess = false;
    } 
  } else {
    console.log('not sure what to do');
  }

  Moltin.Orders.Items(orderId).then(items => {
    if (sucess) {
        // el usuario pago ! ya el producto se habia descontado del inventario previamente! asi que solo queda enviarlo
      Moltin.Orders.Get(orderId)
        .then(order => {
          recipe(order, items)
        })
        Moltin.Orders.Transactions(orderId).then(transactions => {
          const transactionId = transactions.data[0].id
          Moltin.Transactions.Capture({
            order: orderId,
            transaction: transactionId
          }).catch((reason) => { 
            console.log(`something went wrong capturing the payment`,reason)
          })
        })
    }
    if (rejected) {
      //deallocate order items this guy never paid
      items.data.filter((item)=>item.sku != "envio").reduce((promise, item) => {
           promise.then((() => Moltin.Inventories.DeallocateStock(item.product_id, item.quantity))).catch((e) => { console.log("  wrong incrementing cart",e)})
        }, Promise.resolve());
    } 
    res.status(200).send('ok');
  }).catch(function(reason) {
    console.log('notify failed', reason);
  });
});



app.get('/sitemap.xml', function(req, res) {
  let allDocs = Object.values(global.__preloaded__.documents).reduce(
    (acu, prev) => acu.concat(prev),
    []
  );
  //TODO set all the sitemap parameters properly
  let sitemap = sm.createSitemap({
    hostname: 'https://rutasdelosandes.com/',
    cacheTime: 600000, // 600 sec - cache purge period
    urls: allDocs.map(doc => ({
      url: doc.url,
      changefreq: 'daily',
      priority: 0.3
    }))
  });
  sitemap.toXML(function(err, xml) {
    if (err) {
      return res.status(500).end();
    }
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });
});

app.get('/confirmation', (req, res) => {
  let order = req.query.orderid;
  Moltin.Orders.Get(order)
    .then(order => {
      mathRouter(req,res, { order: order.data, cart: {"number": 0, "items": []}});
    })
    .catch(function(reason) {
      console.log('order', reason);
    });
});

app.get('/getcart', function (req,res) { 
  let sessionId = req.session.id;
  Moltin.Cart(sessionId)
  .Items()
    .then(cart => {
      let total = cart.data.filter((item)=>item.sku != "envio").reduce((prev, actual) => { return prev + actual.quantity }, 0);
      let items = cart.data;
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.json({ "number": total, "items": items, id: sessionId});
    }).catch((e) => { 

    })
})

app.get('/getproducts', function (req, res) {

  return Promise.all([shopNameAndProductsPromise]).then(([shop]) => {
    var parentProductsWithImages = {
      products:  shop.products
    };
    // Do something
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json(parentProductsWithImages);
  });

  Moltin.Products.With(['main_image']).All().then(products => {
    // moltin does have a parent filter :()
    let parentProducts = products.data.filter((product) => !product.relationships.parent)
    
    let mainImages = products.included.main_images;

    let parentProductsWithImages = parentProducts.map((product) => {
      
      let main_image = product.relationships.main_image;

      product.main_image = mainImages.find((image) => image.id == (main_image && main_image.data.id));
      return product;
    })

   
  })
})

app.post('/editcart', function (req,res) { 
  let sessionId = req.session.id;
  let itemId = req.body.id;
  let quantity = req.body.quantity;
  console.log("on editcart ", sessionId)
  Moltin.Cart(sessionId).RemoveItem(itemId, quantity).then(cart => {
    let total = cart.data.reduce((prev, actual) => { return prev + actual.quantity }, 0);
    // Do something
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json({ "number": total, "items": cart.data });
  })
})

app.post('/addcart', upload.fields([]), function (req, res) { 
  let productId = req.body.id;
  let sessionId = req.session.id;
  let productUrl = req.body.url;
  let quantity = Number(req.body.quantity);
  let action = req.body.action
  let origin = req.header('origin').toLowerCase()
  let source = req.query.__amp_source_origin
  let checkoutUrl = (process.env.NODE_ENV == 'production') ? `https://rutasdelosandes.com/checkout` : `http://localhost:8080/checkout`
  let EnvproductUrl = (process.env.NODE_ENV == 'production') ? `https://rutasdelosandes.com/${productUrl}` : `http://localhost:8080/${productUrl}`
  console.log(sessionId, "on add to cart call from amp")
  
  Moltin.Cart(sessionId)
    .AddProduct(productId, quantity)
    .then(() => {
      res.set('Access-Control-Allow-Origin', origin);
      res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD, PUT');
      res.set('Access-Control-Allow-Credentials', 'true');
      res.set('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin,AMP-Redirect-To');

      if (action == "checkout") {
        res.set('amp-redirect-to', `${checkoutUrl}?cart=${sessionId}`);
      }
      else { 
        res.set('amp-redirect-to', `${EnvproductUrl}`);
      }
      res.set('AMP-Access-Control-Allow-Source-Origin', source);
      res
        .json({"status": "ok"});
      })
    .catch(e => {
      console.log('error agregando al carro', e);
      res.send('el producto que tratas de comprar se encuentra agotado');
    });
})

app.get('/checkout', (req, res, next) => {
  // si alguien recarga la pagina de checkout llegara aqui con el mismo id por consigiente agregara dos productos al carro y descontara dos productos del
  //inventario :(  no habia pensado en ese caso :(
  const cartId = req.query.cart;
  
  const item = {
    name: 'Envio',
    sku: 'envio',
    description: 'Envio',
    quantity: 1,
    price: {
      amount: 7000
    }
  }

  Moltin.Cart(cartId).Items().then((Items) => { 

    const envio = Items.data.find((item) => item.sku == "envio");

    if (!envio) {
      Moltin.Cart(cartId).AddCustomItem(item).catch((e) => {
        Sentry.captureException(e);
      });
    }
    
    // add shipping to the cart
    mathRouter(req, res, { products:[],  cart: {"number": 0, "items": [], id: cartId}, loading: false }); 
  });
});

//amp static pages
app.use(express.static('./_site'));

// if not a static file come to react router
app.get(`*`, (req, res) => {
  let ampEquivalent = false;

  if (req.originalUrl.match(/[a-z/].html/)) { 
    ampEquivalent = `${req.protocol}://${req.get('host')}/amp${req.originalUrl}`;
  }

  mathRouter(req, res, { products: [], cart: { number: 0, items: [] } }, ampEquivalent);
});
 
//Not found
app.use(function (req, res) {
    res.status(404).sendFile(__dirname + '/_site/404.html');
});

//express will handle the 404 and ['/', '/tienda','/blog','/regiones']
function mathRouter(req, res, state = {}, ampEquivalent) {
  // material ui stylesheet server
   // Create a sheetsRegistry instance.
   const sheetsRegistry = new SheetsRegistry();

   // Create a theme instance.
   const theme = createMuiTheme({
     palette: {
       primary: blueGrey,
       type: 'light',
     },
   });
   const generateClassName = createGenerateClassName();
  // end of material ui server stylesheet
  let store = createStore(
    reducer,
    Object.assign({}, global.__preloaded__, state)
  );
  
  const preloadedState = store.getState();
  match({ routes: routes, location: req.url }, (err, redirect, props) => {
    // in here we can make some decisions all at once
    if (err) {
      // there was an error somewhere during route matching
      res.status(500).send(err.message);
    } else if (redirect) {
      // we haven't talked about `onEnter` hooks on routes, but before a
      // route is entered, it can redirect. Here we handle on the server.
      res.redirect(redirect.pathname + redirect.search);
    } else if (props) {
      let content;
      // if we got props then we matched a route and can render
        content = ReactDOMServer.renderToString(
          <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
            <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
              <Provider store={store}>
                <RouterContext {...props} />
              </Provider>
            </MuiThemeProvider>
          </JssProvider>
        );
        // Grab the CSS from our sheetsRegistry.
      const css = sheetsRegistry.toString()
      const fullPage = renderFullPage(content, preloadedState, '', css, ampEquivalent, req.url);
      if (typeof fullPage != "number") {
        res.send(fullPage);
      }
      else { 
        res.status(fullPage).sendFile(__dirname + '/_site/404.html');
      }
      
    } else {
      // no errors, no redirect, we just didn't match anything
      res.status(404).send('Ruta no encontrada ');
    }
  });
}

function renderFullPage(html, preloadedState, customHtml = '', customCSS = '', ampEquivalent = false, reqUrl) {
  let Analytics = ``;
  let RegisterSW = ``;
  let amptag = ``;
  let structuredData = ``
  if (process.env.NODE_ENV  == 'production') {
    RegisterSW = `if ('serviceWorker' in navigator) {
										navigator.serviceWorker.register('/service-worker.js');
									}`;
    Analytics = `<script async src="https://www.googletagmanager.com/gtag/js?id=UA-100391485-2"></script>
									<script>
									window.dataLayer = window.dataLayer || [];
									function gtag(){dataLayer.push(arguments);}
									gtag('js', new Date());
									gtag('config', 'UA-100391485-2', { 'dataSource': 'REACT', 'use_amp_client_id': true });
								</script>`;
  }

  if (ampEquivalent) {
    var ampDoc;
    try {
      ampDoc = fs.readFileSync(`./_site/amp${decodeURI(reqUrl)}`, 'utf8')
    } catch (err) {
      return 404;
    }

    const $ = cheerio.load(ampDoc);
    structuredData = $('script[type="application/ld+json"]').html();
    $('link[rel=canonical]').remove();
    $('style').remove();
    $('script').remove();
    $('noscript').remove();
    $('amp-analytics').remove();
    
    amptag = `
      ${$('head').html()}
      <link rel="amphtml" href="${ampEquivalent}">
    `
  }

  return `
	  <!doctype html>
	  <html>
		<head>
      ${amptag}
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
			<meta http-equiv="X-UA-Compatible" content="ie=edge">
      <meta name="google-site-verification" content="NI1CzFN9-ZqzNWWYGfh8a_28Ee4atbyWwDRuS9nwwm4" />
      <style id="jss-server-side">${customCSS}</style>
			${Analytics}
			<style>
			${fs.readFileSync('./_includes/styles.html', 'utf8')}
      </style>
      <!-- Facebook Pixel Code -->
      <script>
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '171238663763950');
        fbq('track', 'PageView');
      </script>
      <noscript><img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=171238663763950&ev=PageView&noscript=1"
      /></noscript>
      <!-- End Facebook Pixel Code -->

			<!-- Asynchronously load the AMP-with-Shadow-DOM runtime library. -->
			<script async src="https://cdn.ampproject.org/shadow-v0.js"></script>
		</head>
    <body>
    <script type="application/ld+json">
      ${structuredData}
    </script>
    <script>
      window.__preloaded__ = ${JSON.stringify(preloadedState)}
      ${RegisterSW}		   
    </script>
		  ${customHtml}
		  <div id="root">${html}</div>
		  <script src="/javascript/index.bundle.js"></script>
		</body>
	  </html>
	  `;
}
// http server
app.listen(8080);
// secure server

if (process.env.NODE_ENV == 'production') { 
  https
  .createServer(
    {
      key: fs.readFileSync('./ssl-rutas/rutasdelosandes_com.key'),
      cert: fs.readFileSync('./ssl-rutas/rutasdelosandes_com.crt'),
      ca: fs.readFileSync('./ssl-rutas/rutasdelosandes_com.ca-bundle'),
      passphrase: 'asdfasdf'
    },
    app
  )
  .listen(8443);
}

