const http = require("http");

var express = require("express");
const paillierBigint = require("paillier-bigint");
var body = require("body-parser");
const { publicKey, privateKey } = paillierBigint.generateRandomKeysSync(128);
const PORT = 8080;
var app = express();

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
  const t = ekey;
  ekey = publicKey.encrypt(parseInt(ekey));

  const d = privateKey.decrypt(ekey);
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
  // const x = 1;
  // const y = 1;
  // const enc_x = publicKey.encrypt(x);
  // const enc_y = publicKey.encrypt(y);
  // const ed = publicKey.addition(enc_x, enc_y);

  // console.log(privateKey.decrypt(eadd).toString(), ed);
  // console.log(ein1, ein2,privateKey.decrypt(eadd).toString() "addition");

  res.send(eadd.toString());
});
