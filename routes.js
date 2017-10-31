// constants
const express = require('express');
const snoowrap = require('snoowrap');
const app = express();

//controllers
const routeCtrl = require('./controllers/routesController');
const chartsCtrl = require('./controllers/chartsController');

// promise renturned after Reddit's API authentication
var instancePromise = null;

//function to be exproted to the index.js
module.exports = function(app){
  app.use(function (req, res, next) {
    if(instancePromise || req.originalUrl == '/authenticate' || req.query.state == "fe211bebc52eb3da9bef8db6e63104d3") {
      // allow the user to route
      next();
    }
    // if the user is not authenticated,
    // send them to an incomplete version of the site
    else res.render("index", {
      doNotShowHeaders: true
    });
  });

  //handle "/" route, usually used when coming to the site after being authenticated
  app.get('/', function (req, res) {
    try{
      instancePromise.then(r => {
        r.getMe().then(user => {
          routeCtrl.showUpvoted(user,100,res)
        });
      });
    }
    catch (e) {
      res.render('index');
    }
  });

  // handle routes to /upvoted
  app.get('/upvoted', function (req, res) {
    instancePromise.then(r => {
      r.getMe().then(user => {
        routeCtrl.showUpvoted(user,100,res)
      });
    });
  });

  // handle routes to /keys
  app.get('/keys', function (req, res) {
    instancePromise.then(r => {
      //get a post with an ID and print its properties and values
      r.getSubmission('5sl52a').fetch().then(post => {
        res.render('keys',{
          post: post
        });
      });
    });
  });

  // handle routes to /charts
  app.get('/charts', function(req, res) {
    var limit = 100;
    instancePromise.then(r => {
      r.getMe().then(user => {
        user.getUpvotedContent({limit: limit}).then(upvoted => {
          var data = routeCtrl.getUpvotedData(user, limit, upvoted);
          chartsCtrl.createChart(data, limit, res);
        });
      });
    });
  });

  // handle routes to /authors
  app.get('/authors', function(req, res){
    instancePromise.then(r => {
      r.getMe().then(user => {
        routeCtrl.showUpvotedAuthors(user,50,res)
      });
    });
  });

  // get environment variables for the web app
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;

  // send the user to the Reddit page to authenticate
  app.get('/authenticate', function(req, res){
      var authenticationUrl = snoowrap.getAuthUrl({
        clientId: clientId,
        scope: ['identity history read'],
        // must be equal to the one in the Reddit web app settings
        redirectUri: 'http://localhost:3000/success',
        permanent: false,
        state: 'fe211bebc52eb3da9bef8db6e63104d3'
    });
    res.redirect(authenticationUrl);
  });

  // user will be sent here after authenticating in the Reddit page
  // they will have a unique 'code' to make requests with
  app.get('/success', function (req, res) {
    var code = req.query.code;
    // instantiate the promise, allowing them to make request
    // throughout the website
    instancePromise = snoowrap.fromAuthCode({
      code: code,
      userAgent: 'stats-for-reddit 1.0.0 by u/atanunq',
      clientId: clientId,
      clientSecret: clientSecret,
      // must be equal to the one in the Reddit web app settings
      redirectUri: 'http://localhost:3000/success'
    });
    res.render("success");
  });
  // the instancePromise is set to null
  // which means the user is no longer authenticated
  app.get('/logout', function (req, res) {
    instancePromise = null;
    // change in production
    res.render('index', {
      doNotShowHeaders: true
    });
  });
  // if we get to here, no known url has been called
  // => a 404 error is called
  app.get('/:url', function (req, res){
    res.render("error", {
      url: req.params.url
    });
  });
}
