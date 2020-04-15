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
  cheerio = require("cheerio");

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
  dsn: "https://85af5db342274936a7088e5e00f3eb33@sentry.io/1225109"
});

// i think this is cousing the errors
//app.use(Sentry.Handlers.requestHandler());
//app.use(Sentry.Handlers.errorHandler());
//// Optional fallthrough error handler
//app.use(function onError(err, req, res, next) {
//// The error id is attached to `res.sentry` to be returned
//// and optionally displayed to the user for support.
//res.statusCode = 500;
//res.end(res.sentry + '\n');
//});

app.set("views", "./views");
app.set("view engine", "ejs");

require("es6-promise").polyfill();
require("isomorphic-fetch");
console.log("server is actually running");

//server side fetch polifyll
//import routes from "./_javascript/routes";
import { match, RouterContext } from "react-router";
//import { read, write, push, sendToDevice, update, remove } from "./chatbot/db";
//import { Promise } from "firebase";
import reducer from "../_javascript/reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { log } from "util";
// set this var for react inner components
console.log(fs.readFileSync("./_site/documents.json", "utf8"));
//global.__preloaded__ = JSON.parse(fs.readFileSync("./documents.json", "utf8"));
// mocking shopify responses
global.__mocking__ = true;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

router.get(`*`, (req, res) => {
  console.log("visitando", req.url);
  res.json({
    users: [
      {
        name: "steve"
      },
      {
        name: "joe"
      }
    ]
  });
});

var functionName = "server";
// Set router base path for local dev
const routerBasePath =
  process.env.NODE_ENV === "dev"
    ? `/${functionName}`
    : `/.netlify/functions/${functionName}/`;
console.log(routerBasePath);
// Setup routes
app.use(router);
exports.handler = serverless(app);
