const http = require("http");
const express = require("express");

// Homomorphic Encryption Library
const paillierBigint = require("paillier-bigint");
const { publicKey, privateKey } = paillierBigint.generateRandomKeysSync(128);

const PORT = 8080;
const app = express();

app.get("/", function (req, res) {
  res.send("Backend Server");
});

app.listen(PORT, function (res) {
  console.log("Backend Server Listening on PORT " + PORT);
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/encrypt/:id", function (req, res) {
  var ekey = req.params.id;
  ekey = publicKey.encrypt(parseInt(ekey));
  res.send(ekey.toString());
});

app.get("/decrypt/:id", function (req, res) {
  var dkey = req.params.id;
  dkey = privateKey.decrypt(BigInt(dkey)).toString();
  res.send(dkey);
});

app.get("/add/:id/:id2", function (req, res) {
  var ein1 = req.params.id;
  var ein2 = req.params.id2;
  eadd = publicKey.addition(BigInt(Number(ein1)), BigInt(Number(ein2)));
  res.send(eadd.toString());
});
