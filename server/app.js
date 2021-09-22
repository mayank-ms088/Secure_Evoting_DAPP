// //index.js

// /*  EXPRESS */

// const express = require("express");
// const app = express();
// const session = require("express-session");

// app.use(
//   session({
//     resave: false,
//     saveUninitialized: true,
//     secret: "SECRET",
//   })
// );

// app.get("/", function (req, res) {
//   res.render("pages/auth");
// });

// const port = process.env.PORT || 8080;
// app.listen(port, () => console.log("App listening on port " + port));

// /*  PASSPORT SETUP  */

// const passport = require("passport");
// var userProfile;

// app.use(passport.initialize());
// app.use(passport.session());

// app.get("/success", (req, res) => res.send(userProfile));
// app.get("/error", (req, res) => res.send("error logging in"));

// passport.serializeUser(function (user, cb) {
//   cb(null, user);
// });

// passport.deserializeUser(function (obj, cb) {
//   cb(null, obj);
// });

// /*  Google AUTH  */

// const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
// const GOOGLE_CLIENT_ID =
//   "734928268076-dki2mrdmbjme8t7rqirtv80g3bbhn219.apps.googleusercontent.com";
// const GOOGLE_CLIENT_SECRET = "U5pCg2vCsoJ_dtLv6sLOL0nE";
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:3000/auth/google/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       userProfile = profile;
//       return done(null, userProfile);
//     }
//   )
// );

// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/error" }),
//   function (req, res) {
//     // Successful authentication, redirect success.
//     res.redirect("/success");
//   }
// );

const http = require("http");

var express = require("express");
var paillier = require("jspaillier");
var jsbn = require("jsbn");
var body = require("body-parser");
require("datejs");

var app = express();

var keys = paillier.generateKeys(128);

const hostname = "127.0.0.1";
const port = 8080;

app.get("/", function (req, res) {
  res.send("Backend Server");
});

app.listen(port, function (res) {
  console.log("Backend Server Listening on Port " + port);
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
  ekey = keys.pub.encrypt(keys.pub.convertToBn(ekey)).toString();
  res.send(ekey);
});

app.get("/decrypt/:id", function (req, res) {
  var dkey = req.params.id;
  dkey = keys.sec.decrypt(keys.pub.convertToBn(dkey)).toString();
  res.send(dkey);
});

app.get("/add/:id/:id2", function (req, res) {
  var ein1 = req.params.id;
  var ein2 = req.params.id2;
  eadd = keys.pub
    .add(keys.pub.convertToBn(ein1), keys.pub.convertToBn(ein2))
    .toString();
  res.send(eadd);
});

app.get("/getTime", function (req, res) {
  var timestamp = Math.round(new Date().getTime() / 1000);
  res.send("" + timestamp);
});
