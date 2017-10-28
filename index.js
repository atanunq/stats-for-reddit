const express = require('express');
const app = express();

//Load view engine
app.set('views', './views')
app.set('view engine', 'pug');

//folder structure
app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules/chart.js/dist/'));

//import routing file and run it with the app variable
var routes = require('./routes')(app);

// check for PORT env variable or 3000 for localhost
var port = process.env.PORT || 3000;

// run the app
app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!')
})
