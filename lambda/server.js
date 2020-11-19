const express = require("express"),
  app = express(),
  router = express.Router(),
  fs = require("fs"),
  React = require("react"),
  ReactDOMServer = require("react-dom/server"),
  bodyParser = require("body-parser"),
  webpush = require("web-push"),
  multer = require("multer"),
  session = require("express-session"),
  sm = require("sitemap"),
  Sentry = require("@sentry/node"),
  serverless = require("serverless-http"),
  cheerio = require("cheerio"),
  deepmerge = require("deepmerge"),
  ejs = require('ejs');

import { SheetsRegistry, JssProvider } from "react-jss";
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName,
} from "@material-ui/core/styles";
import blueGrey from "@material-ui/core/colors/blueGrey";
import {
  lineItemAdd,
  lineItemRemove,
  updateLineItem,
  shopNameAndProductsPromise,
  cartPromise,
  productByHandle,
  createCheckout,
  fetchCheckout,
} from "./shopify/shopifyPromises.js";

import productTemplate from "./views/product.html";
const vapidKeys = {
  publicKey:
    "BMYgIYpw8jtC_61DQFh9k0rJP-5XUrWIwsUAOOnJmJQOfdS94jSlk0C2q86F1ebI2Yln5yz6v-cTJ2h10GM-vd4",
  privateKey: "z6scVphnKP7WPgjVeJZFgvGdMlrFT8V2hVEg08mnoms",
};

webpush.setVapidDetails(
  "mailto:rutasdelosandes@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

let upload = multer();

Sentry.init({
  dsn:
    "https://2ff395a5fa134476b6467e4164a514be@o98027.ingest.sentry.io/5204380",
});
// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

const documents = require("../_site/documents.json");
const globalStyles = require("../_includes/styles.html");

import { read, write, push, sendToDevice, update, remove } from "./utils/db";

require("es6-promise").polyfill();
require("isomorphic-fetch");

//server side fetch polifyll
import routes from "../_javascript/routes";
import { match, RouterContext } from "react-router";
import reducer from "../_javascript/reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { log } from "util";
global.__preloaded__ = documents;
//import { read, write, push, sendToDevice, update, remove } from "./chatbot/db";
//import { Promise } from "firebase";

// Use the session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7200000 },
  })
);

app.use(bodyParser.json());
let allDocs = Object.values(global.__preloaded__.documents).reduce(
  (acu, prev) => acu.concat(prev),
  []
);
const siteMeta = global.__preloaded__.site;
// Sitemap route
router.get("/sitemap.xml", function (req, res) {
  //TODO set all the sitemap parameters properly
  let sitemap = sm.createSitemap({
    hostname: "https://rutasdelosandes.com/",
    cacheTime: 600000, // 600 sec - cache purge period
    urls: allDocs.map((doc) => ({
      url: doc.url,
      changefreq: "daily",
      priority: 0.3,
    })),
  });
  sitemap.toXML(function (err, xml) {
    if (err) {
      return res.status(500).end();
    }
    res.header("Content-Type", "application/xml");
    res.send(xml);
  });
});

app.post("/api/save-subscription/", function (req, res) {
  var data = req.body;
  push(`endpoints`, data)
    .then(function () {
      return res.status(200).send("ok");
    })
    .catch(function (error) {
      return res.status(500).json({ error: error.toString() });
    });
});

router.get("/getproducts", function (req, res) {
    return Promise.all([shopNameAndProductsPromise]).then(([result]) => {
      if (result.errors) {
        console.log(`result coming from shopify promese`, result);
        res.json(result);
      } else {
        let products = result.data.shop.products.edges.map(
          (product) => product.node
        );
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.json(products);
      }
    });
});

router.get("/producto/availability/:slug", async (req, res) => {
  const slug = req.params.slug;
  const product = await productByHandle(slug).then(res => {
    return res.data;
  });

  const items = product.productByHandle.variants.edges.map(variant => {
    let variantObj = variant.node;
    let options = [
      { selected: "selected", label: 1 },
      { selected: "", label: 2 }
    ];
    return {
      ...variantObj,
      total: variantObj.availableForSale ? 2 : 0,
      options: options
    };
  });

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.status(200).send(JSON.stringify({ items: items }));
});

var replaceAccents = function (cadena) {
  var chars = {
    á: "a",
    é: "e",
    í: "i",
    ó: "o",
    ú: "u",
    à: "a",
    è: "e",
    ì: "i",
    ò: "o",
    ù: "u",
    ñ: "n",
    Á: "A",
    É: "E",
    Í: "I",
    Ó: "O",
    Ú: "U",
    À: "A",
    È: "E",
    Ì: "I",
    Ò: "O",
    Ù: "U",
    Ñ: "N",
  };
  var expr = /[áàéèíìóòúùñ]/gi;
  var res = cadena.replace(expr, function (e) {
    return chars[e];
  });
  return res;
};

router.get("/amp/producto/:slug", async (req, res) => {
  const slug = req.params.slug;
  let shopifyProduct;
    shopifyProduct = await productByHandle(slug).then((result) => {
      return result;
    });

  const shopifyVariations = shopifyProduct.data.productByHandle.options;
  const buildNestedObj = (values, id, obj = {}, ref = obj) => {
    let lastValue = values.shift();
    if (values.length == 0) {
      ref[lastValue] = id;
      return obj;
    } else {
      ref[lastValue] = {};
      buildNestedObj(values, id, obj, ref[lastValue]);
    }
  };

  let variationsArray = shopifyProduct.data.productByHandle.variants.edges.map(
    (variant) => {
      let variationsValues = variant.node.selectedOptions.map(
        (variantObj) => variantObj.value
      );
      let obj = {};
      buildNestedObj(variationsValues, variant.node.id, obj);
      return obj;
    }
  );

  const variationsMatrix = deepmerge.all(variationsArray);

  let defaultVariations = shopifyProduct.data.productByHandle.variants.edges[0].node.selectedOptions
    .map((option) => ({ [replaceAccents(option.name)]: option.value }))
    .reduce((valorAnterior, valorActual) => {
      return Object.assign(valorAnterior, valorActual);
    }, {});

  let defaultChild = shopifyProduct.data.productByHandle.variants.edges[0].node;

  let price = parseInt(defaultChild.priceV2.amount);
  let compareAtPrice =
    defaultChild.compareAtPriceV2 != null
      ? parseInt(defaultChild.compareAtPriceV2.amount)
      : "";

  let variationsParams = shopifyVariations
    .map((variantObj) => variantObj.name)
    .reduce((valorAnterior, valorActual, indice, vector) => {
      return (
        valorAnterior +
        `[product.variationSelected.${replaceAccents(valorActual)}]`
      );
    }, `variationMatrix`);

  const children = shopifyProduct.data.productByHandle.variants.edges.map(
    (child) => {
      return child.node;
    }
  );

  let quantityExpression = "product.quantity";

  //	let main_image = getMainImage(products.included, product.relationships.main_image.data.id)
  //	let files = getFiles(products.included, product.relationships.files)
  let productDisplay = Object.assign(
    {},
    { shopifyVariations },
    shopifyProduct.data.productByHandle,
    { children },
    { variations: variationsMatrix },
    { defaultChild: defaultChild.id, price, compareAtPrice },
    { defaultVariations: defaultVariations },
    { url: `producto/${slug}` }
  );
  const data = {
    product: productDisplay,
    variationsParams,
    replaceAccents,
    quantityExpression,
  };

  res.status(200).send(ejs.render(productTemplate,data));
});

router.get("/getcart", async (req, res, next) => {
  try {
    let checkoutId = req.session.checkoutId;
    var shopifyCart = "";
    var lineItems = [];
    let cartOpen = false;
    // Create a checkout if it doesn't exist yet
    if (!checkoutId) {
      lineItems = [];
    } else {
      cartOpen = true;
      shopifyCart = await fetchCheckout(checkoutId);
      lineItems = shopifyCart.data.node.lineItems.edges.map(
        (item) => item.node
      );
    }

    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.json({
      number: lineItems.length,
      items: lineItems,
      checkoutId,
      open: cartOpen,
    });
  } catch (error) {
    return next(error);
  }
});
// if not a static file come to react router
router.get(`*`, (req, res) => {
  let ampEquivalent = false;
  if (req.originalUrl.match(/[a-z/].html[-a-zA-Z0-9()@:%_\+.~#?&//=]*/)) {
    ampEquivalent = `${
      req.protocol
    }://rutasdelosandes.com/amp${req.originalUrl.split("?").shift()}`;
  }

  let cartOpen = req.query.cartOpen;

  mathRouter(
    req,
    res,
    { products: [], cart: { number: 0, items: [], open: cartOpen } },
    ampEquivalent
  );
});
function mathRouter(req, res, state = {}, ampEquivalent) {
  // material ui stylesheet server
  // Create a sheetsRegistry instance.
  const sheetsRegistry = new SheetsRegistry();

  // Create a theme instance.
  const theme = createMuiTheme({
    palette: {
      primary: blueGrey,
      type: "light",
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
        <JssProvider
          registry={sheetsRegistry}
          generateClassName={generateClassName}
        >
          <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
            <Provider store={store}>
              <RouterContext {...props} />
            </Provider>
          </MuiThemeProvider>
        </JssProvider>
      );
      // Grab the CSS from our sheetsRegistry.
      const css = sheetsRegistry.toString();
      const fullPage = renderFullPage(
        content,
        preloadedState,
        "",
        css,
        ampEquivalent,
        req.url.split("?").shift()
      );
      if (typeof fullPage != "number") {
        res.send(fullPage);
      } else {
        res.status(fullPage).sendFile(__dirname + "/_site/404.html");
      }
    } else {
      // no errors, no redirect, we just didn't match anything
      res.status(404).send("Ruta no encontrada ");
    }
  });
}

function renderFullPage(
  html,
  preloadedState,
  customHtml = "",
  customCSS = "",
  ampEquivalent = false,
  reqUrl
) {
  let Analytics = ``;
  let RegisterSW = ``;
  let amptag = ``;

  const metaDataArray = allDocs.filter((doc) => doc.url == reqUrl);
  const docMetaData = metaDataArray.length ? metaDataArray[0] : siteMeta;

  if (process.env.NODE_ENV == "production") {
    RegisterSW = ``;
  }

  if (ampEquivalent) {
    var ampDoc = ``;

    const $ = cheerio.load(ampDoc);
    $("link[rel=canonical]").remove();
    $("style").remove();
    $("script").remove();
    $("noscript").remove();
    $("amp-analytics").remove();
    amptag = ` ${$(
      "head"
    ).html()} <link rel="amphtml" href="${ampEquivalent}"> `;
  }

  return `
      <!doctype html>
      <html>
      <head>
      <title> ${docMetaData.seotitle}</title>
      <meta name="description" content="${docMetaData.excerpt}">
      ${amptag}
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta property="fb:pages" content="1078600055607267" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <meta name="google-site-verification" content="NI1CzFN9-ZqzNWWYGfh8a_28Ee4atbyWwDRuS9nwwm4" />
      <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
      <style id="jss-server-side">
      ${customCSS}
      </style>
      <style>
        ${globalStyles}
      </style>
      <meta property="article:publisher" content="{{site.url}}">
      <!-- facebook metadata -->
      <meta property="og:title"       content="${docMetaData.title}">
      <meta property="og:url"         content="{{site.url}}{{page.url}}">
      <meta property="og:type"        content="article">
      <meta property="og:image"       content="${docMetaData.featured}">
      <meta property="article:author" content="${docMetaData.author_facebook}">
      <meta property="fb:app_id"      content="{{site.fb_app_id}}">
      <meta property="og:site_name"   content="{{site.title}}">
      <meta property="og:description" content="${docMetaData.excerpt}">
      <meta property="fb:pages"       content="{{ site.instant_pages }}">
      <meta property="og:updated_time" content="{{  "now"  | date: "%Y-%m-%dT%H:%M:%S" }}">
      <meta property="og:rich_attachment" content="true">
      <!-- twitter metadata for summary_large_image -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:site" content="@{{site.twitter}}">
      <meta name="twitter:creator" content="@${docMetaData.author_twitter}">
      <meta name="twitter:title" content="${docMetaData.title}">
      <meta name="twitter:description" content="${docMetaData.excerpt}">
      <meta name="twitter:image" content="${docMetaData.featured}">
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
      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-100391485-2"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'UA-100391485-2', { 'dataSource': 'REACT', 'use_amp_client_id': true });
      </script>
      <noscript><img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=171238663763950&ev=PageView&noscript=1"
      /></noscript>
      <!-- End Facebook Pixel Code -->
      <!-- Asynchronously load the AMP-with-Shadow-DOM runtime library. -->
      <script async src="https://cdn.ampproject.org/shadow-v0.js"></script>
      </head>
      <body>
      <script>
        window.__preloaded__ = ${JSON.stringify(preloadedState)}
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/service-worker.js');
        }
      </script>
        ${customHtml}
        <div id="root">${html}</div>
        <script src="/javascript/index.bundle.js"></script>
      </body>
      </html>
	  `;
}
var functionName = "server";
// Set router base path for local dev
const routerBasePath =
  process.env.NODE_ENV === "dev"
    ? `/${functionName}`
    : `/.netlify/functions/${functionName}/`;

// Setup routes
app.use(router);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());
exports.handler = serverless(app);
