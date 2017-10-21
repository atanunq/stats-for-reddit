const request = require('request');
const express = require('express');
const app = express();
//Load view engine
app.set('views', './views')
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules/Chart.js/dist/'));
var routes = require('./routes')(app);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
