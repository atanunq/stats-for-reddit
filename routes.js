// constants
const express = require('express');
const snoowrap = require('snoowrap');

//controllers
const routeCtrl = require('./controllers/routesController');
const chartsCtrl = require('./controllers/chartsController');

//variables for the amount of posts processed
const upvotedCount = 100;
const authorCount = 100;
const chartCount = 100;
const domainCount = 100;
const keysID = "5sl52a";

//get environment variables for the web app
const clientId = process.env.REDDIT_CLIENT_ID;
const clientSecret = process.env.REDDIT_CLIENT_SECRET;

//value must match the value provided when creating the Web App from Reddit
const redirectUri = 'http://localhost:3000/success';
const state = 'fe211bebc52eb3da9bef8db6e63104d3';

// promise renturned after Reddit's API authentication
var instancePromise = null;

//function to be exproted to the index.js
module.exports = function(app){
  app.use(function (req, res, next) {
    if(instancePromise || req.originalUrl == '/authenticate' || req.query.state == state) {
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
          routeCtrl.showUpvoted(user, upvotedCount, res);
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
        routeCtrl.showUpvoted(user, upvotedCount, res);
      });
    });
  });

  // handle routes to /keys
  app.get('/keys', function (req, res) {
    instancePromise.then(r => {
      //get a post with an ID and print its properties and values
      r.getSubmission(keysID).fetch().then(post => {
        res.render('keys',{
          post: post
        });
      });
    });
  });

  // handle routes to /charts
  app.get('/charts', function(req, res) {
    instancePromise.then(r => {
      r.getMe().then(user => {
        user.getUpvotedContent({limit: chartCount}).then(upvoted => {
          var data = routeCtrl.getUpvotedData(user, chartCount, upvoted);
          chartsCtrl.createChart(data, chartCount, res);
        });
      });
    });
  });

  app.get('/domains', function (req, res){
    instancePromise.then(r => {
      r.getSubreddit('all').getTop({time: 'day', limit: domainCount}).then(data => {
        routeCtrl.showDomains(data, res);
      });
    });
  });

  // handle routes to /authors
  app.get('/authors', function(req, res){
    instancePromise.then(r => {
      r.getMe().then(user => {
        routeCtrl.showUpvotedAuthors(user,authorCount,res);
      });
    })
  });

  // send the user to the Reddit page to authenticate
  app.get('/authenticate', function(req, res){
      var authenticationUrl = snoowrap.getAuthUrl({
        clientId: clientId,
        scope: ['identity history read'],
        redirectUri: redirectUri,
        permanent: false,
        state: state
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
      redirectUri: redirectUri
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
