const request = require('request');
const snoowrap = require('snoowrap');
const express = require('express');
var config = require('./config');
var app = express();
const r = config.init();


app.get('/', function (req, res) {
  getUpvotedCount('atanunq', 10, res);
})
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

function findComments(user){
  request('https://www.reddit.com/user/' + user + '/.json', function (error, response, body) {
    var dataJSON = JSON.parse(body);
    var posts = dataJSON.data.children;
    for(var i = 0; i<posts.length; i++){
      console.log(" ------- ");
      console.log("Commented in :",posts[i].data.subreddit_name_prefixed);
      console.log(posts[i].data.body);
    }
  });
}
function getUpvotedCount(user, limit, res){
  var subredditNames = [];
  r.getUser(user).getUpvotedContent({limit: limit}).then(value => {
    for (var i = 0; i < value.length; i++) {
      subredditNames.push(value[i].subreddit_name_prefixed);
    }
    var counts = {};
    subredditNames.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    var sortable = [];
    for (var subreddit in counts) {
        sortable.push([subreddit, counts[subreddit]]);
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    var html = "<ul>";
    for (var i = 0; i < sortable.length; i++) {
      html += "<li>";
      var display = sortable[i][0] + ' - ' + sortable[i][1];
      html += display;
      html += "</li>";
    }
    html += "</ul>"
    res.send(html);
  });
}
//findComments('spez');
