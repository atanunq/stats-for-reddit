const request = require('request');
const snoowrap = require('snoowrap');
const express = require('express');
var config = require('./config');
var app = express();

const r = config.init();
getUpvotedCount('atanunq');
app.get('/', function (req, res) {
  res.send("Kek");
})
app.listen(4000, function () {
  console.log('Example app listening on port 4000!')
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
function getUpvotedCount(user){
  r.getUser(user).getUpvotedContent({limit: Infinity}).then(value => {
    console.log(value.length)
  });
}
//findComments('spez');
