const request = require('request');
const express = require('express');
const config = require('./config');
const app = express();
const r = config.init();

//Load view engine
app.set('views', './views')
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  showUpvoted(r.username,10,res)
})
app.get('/keys', function (req, res) {
  r.getSubmission('5by1wy').fetch().then(post =>{
    res.render('keys',{
      post: post
    })
  })
})
app.get('/authors', function(req, res){
  showUpvotedAuthors(r.username,20,res)
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
//findComments('spez');
function showUpvotedAuthors(user, limit, res){
  var authorNames = [];
  r.getUser(user).getUpvotedContent({limit:limit}).then(upvoted => {
    for (var i = 0; i < upvoted.length; i++) {
      authorNames.push(upvoted[i].author.name);
    }
    var counts = {};
    authorNames.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    var authors = [];
    for (var author in counts) {
        authors.push([author, counts[author]]);
    }
    authors.sort(function(a, b) {
        return b[1] - a[1];
    });
    res.render('authors', {
        user: user,
        limit: limit,
        authors: authors
      });
  })
}

function showUpvoted(user, limit, res){
  var subredditNames = [];
  r.getUser(user).getUpvotedContent({limit: limit}).then(upvoted => {
    for (var i = 0; i < upvoted.length; i++) {
      subredditNames.push(upvoted[i].subreddit_name_prefixed);
    }
    var counts = {};
    subredditNames.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    var subreddits = [];
    for (var subreddit in counts) {
        subreddits.push([subreddit, counts[subreddit]]);
    }
    subreddits.sort(function(a, b) {
        return b[1] - a[1];
    });
    res.render('index', {
        subreddits: subreddits,
        user: user,
        limit: limit
      });
  });
}
