const request = require('request');
const express = require('express');
const config = require('./config');
const app = express();
const r = config.init();
const moment = require('moment')

//Load view engine
app.set('views', './views')
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  showUpvoted(r.username,25,res)
})
app.get('/authors', function(req, res){
  showUpvotedAuthors(r.username,50,res)
})
app.get('/keys', function (req, res) {
  r.getSubmission('6ov6cj').fetch().then(post =>{
    res.render('keys',{
      post: post
    })
  })
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
      subredditNames.push({
        subreddit_name: upvoted[i].subreddit_name_prefixed,
        post: upvoted[i]
      });
    }
    var subreddits = [];
    subredditNames.forEach(function(x) {
      var found = false;
      for(var i = 0; i < subreddits.length; i++) {
          if (subreddits[i].subreddit_name == x.subreddit_name) {
              found = true;
              subreddit = subreddits[i];
          }
      }
      if(found){
        subreddit.count ++;
        subreddit.posts.push(x.post)
      } else {
        subreddits.push({
          subreddit_name: x.subreddit_name,
          count: 1,
          posts: [x.post]
        })
      }
    });
    subreddits.sort(function(a,b){
      return b.count-a.count;
    })
    for(var i = 0; i < subreddits.length; i++) {
      for(var j = 0;j < subreddits[i].posts.length; j++){
        var day=moment.unix(subreddits[i].posts[j].created_utc);
        subreddits[i].posts[j].postedAgo = day.fromNow(false,'d');
        subreddits[i].posts[j].postedDate = day.format("DD MMMM YYYY")
      }
    }
    //console.log(subreddits[0].posts[0].subreddit_name_prefixed);

    //console.log(subreddits['r/Dota2'])
    res.render('index', {
        subreddits: subreddits,
        user: user,
        limit: limit
      });
  });
}
