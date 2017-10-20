const request = require('request');
const express = require('express');
const app = express();
const snoowrap = require('snoowrap');
//Load view engine
app.set('views', './views')
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
var routes = require('./routes')(app);

app.listen(3060, function () {
  console.log('Example app listening on port 3000!')
})
