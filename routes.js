const express = require('express');
const app = express();
const routeCtrl = require('./controllers/routesController');
const chartsCtrl = require('./controllers/chartsController');
var instancePromise = null;
const snoowrap = require('snoowrap');
module.exports = function(app){
  app.use(function (req, res, next) {
    if(instancePromise || req.originalUrl == '/authenticate' || req.query.state == "fe211bebc52eb3da9bef8db6e63104d3") next()
    //TODO: redirect unauthenticated users
    else res.render("index", {
      doNotShowHeaders: true
    })
  })
  app.get('/', function (req, res) {
    try{
      instancePromise.then(r => {
        r.getMe().then(user => {
          routeCtrl.showUpvoted(user,100,res)
        })
      })
    }
    catch (e) {
      res.render('index');
    }
  })
  app.get('/upvoted', function (req, res) {
    instancePromise.then(r => {
      r.getMe().then(user => {
        routeCtrl.showUpvoted(user,100,res)
      })
    })
  })
  app.get('/keys', function (req, res) {
    instancePromise.then(r => {
      r.getSubmission('5sl52a').fetch().then(post => {
        res.render('keys',{
          post: post
        })
      })
    })
  })
  app.get('/charts', function(req, res) {
    var limit = 100;
    instancePromise.then(r => {
      r.getMe().then(user => {
        user.getUpvotedContent({limit: limit}).then(upvoted => {
          var data = routeCtrl.getUpvotedData(user, limit, upvoted);
          chartsCtrl.createChart(data, limit, res);
        });
      })
    })
  })
  app.get('/authors', function(req, res){
    instancePromise.then(r => {
      r.getMe().then(user => {
        routeCtrl.showUpvotedAuthors(user,50,res)
      })
    })
  })
  app.get('/sandbox', function(req, res){
    instancePromise.then(r => {
      r.getSubmission('74f01f').fetch().then(post => {
        if (!post.media) {
          post.url = changeGifvExtention(post.url);
          post.embedPost = false;
        } else {
          post.embedPost = true;
        }
        res.render('sandbox', {
          post: post
        })
      })
    })
  })

  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;

  app.get('/authenticate', function(req, res){
      var authenticationUrl = snoowrap.getAuthUrl({
        clientId: clientId,
        scope: ['identity history read'],
        redirectUri: 'http://localhost:3000/success',
        permanent: false,
        state: 'fe211bebc52eb3da9bef8db6e63104d3'
    });
    res.redirect(authenticationUrl);
  })
  app.get('/success', function (req, res) {
    var code = req.query.code;
    instancePromise = snoowrap.fromAuthCode({
      code: code,
      userAgent: 'stats-for-reddit 1.0.0 by u/atanunq',
      clientId: clientId,
      clientSecret: clientSecret,
      redirectUri: 'http://localhost:3000/success'
    })
    res.render("success");
  })
  app.get('/logout', function (req, res) {
    instancePromise = null;
    // change in production
    res.render('index', {
      doNotShowHeaders: true
    });
  })
  app.get('/:url', function (req, res){
    res.render("error", {
      url: req.params.url
    });
  })
}
