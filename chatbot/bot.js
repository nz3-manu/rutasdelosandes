"use strict";

const express = require("express"),
  router = express.Router(),
  bodyParser = require("body-parser"),
  fs = require("fs"),
  https = require("https"),
  path = require("path"),
  webhookResponse = require("./webhook.js").webhookResponse,
  notify = require("./notify.js").notify;

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.post("/webhook", webhookResponse);

// Webhook validation
router.get("/webhook", function (req, res) {
  console.log(
    process.env.VERIFY_TOKEN,
    req.query["hub.mode"] === "subscribe",
    req.query["hub.verify_token"]
  );
  if (
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.verify_token"] === "SILENCEISGOLDEN"
  ) {
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    res.sendStatus(403);
  }
});
router.get("/fbnotify", (req, res) => {
  res.status(200).send(`
        <!doctype html>
        <html>
        <head>
                <title> notify in fb </title>
                </head>
        <body>
        <form action="/fbnotify" method="post">
                title<br>
                <input type="text" name="title"><br>
                subtitle<br>
                <input type="text" name="subtitle"><br>
                image url<br>
                <input type="text" name="image"><br>
                url<br>
                <input type="text" name="url"><br>
                secret<br>
                <input type="text" name="secret"><br>
                <input type="submit" value="Submit">
                </form>
                </body>
                </html>
        `);
});
router.post("/fbnotify", notify);

module.exports = router;
