const express = require("express"),
  app = express(),
  router = express.Router(),
  fs = require("fs"),
  React = require("react"),
  ReactDOMServer = require("react-dom/server"),
  bodyParser = require("body-parser"),
  webpush = require("web-push"),
  path = require("path"),
  md5 = require("md5"),
  multer = require("multer"),
  session = require("express-session"),
  request = require("request"),
  sm = require("sitemap"),
  Sentry = require("@sentry/node"),
  serverless = require("serverless-http"),
  cheerio = require("cheerio"),
  cors = require("cors");

import { SheetsRegistry } from "react-jss/lib/jss";
//import {
//lineItemAdd,
//lineItemRemove,
//updateLineItem,
//shopNameAndProductsPromise,
//cartPromise,
//productByHandle,
//createCheckout,
//fetchCheckout
//} from "../shopifyPromises.js";
import JssProvider from "react-jss/lib/JssProvider";
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName
} from "@material-ui/core/styles";
import blueGrey from "@material-ui/core/colors/blueGrey";

let upload = multer();

Sentry.init({
  dsn:
    "https://2ff395a5fa134476b6467e4164a514be@o98027.ingest.sentry.io/5204380"
});
// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

const documents = require("../_site/documents.json");
const globalStyles = require("../_includes/styles.html");

// i think this is cousing the errors
app.set("views", "../views");
app.set("view engine", "ejs");

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
// mocking shopify responses
global.__mocking__ = true;


// Use the session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7200000 }
  })
);

// Sitemap route
router.get("/sitemap.xml", function(req, res) {
  let allDocs = Object.values(global.__preloaded__.documents).reduce(
    (acu, prev) => acu.concat(prev),
    []
  );
  //TODO set all the sitemap parameters properly
  let sitemap = sm.createSitemap({
    hostname: "https://rutasdelosandes.com/",
    cacheTime: 600000, // 600 sec - cache purge period
    urls: allDocs.map(doc => ({
      url: doc.url,
      changefreq: "daily",
      priority: 0.3
    }))
  });
  sitemap.toXML(function(err, xml) {
    if (err) {
      return res.status(500).end();
    }
    res.header("Content-Type", "application/xml");
    res.send(xml);
  });
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
      lineItems = shopifyCart.data.node.lineItems.edges.map(item => item.node);
    }

    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.json({
      number: lineItems.length,
      items: lineItems,
      checkoutId,
      open: cartOpen
    });
  } catch (error) {
    return next(error);
  }
});
// if not a static file come to react router
router.get(`*`, (req, res) => {
  let ampEquivalent = false;
  if (req.originalUrl.match(/[a-z/].html[-a-zA-Z0-9()@:%_\+.~#?&//=]*/)) {
    ampEquivalent = `${req.protocol}://${req.get(
      "host"
    )}/amp${req.originalUrl.split("?").shift()}`;
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
      type: "light"
    }
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
  let structuredData = ``;
  if (process.env.NODE_ENV == "production") {
    RegisterSW = ``;
  }

  if (ampEquivalent) {
    var ampDoc = ``;
    try {
      //ampDoc = import(`../_site/amp${decodeURI(reqUrl)}`)
    } catch (err) {
      return 404;
    }

    const $ = cheerio.load(ampDoc);
    structuredData = $('script[type="application/ld+json"]').html();
    $("link[rel=canonical]").remove();
    $("style").remove();
    $("script").remove();
    $("noscript").remove();
    $("amp-analytics").remove();
    console.log(`html comming from the server ${html}`);
    amptag = ` ${$("head").html()} <link rel="amphtml" href="${ampEquivalent}"> `;
  }

  return `
      <!doctype html>
      <html>
      <head>
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
      <script type="application/ld+json">
        ${structuredData}
      </script>
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
console.log(routerBasePath);

// Setup routes
app.use(router);

router.use(bodyParser.json());

router.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

router.use(cors())
// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());
exports.handler = serverless(app);
