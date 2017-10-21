const moment = require('moment');
function changeGifvExtention(url) {
    var parts = url.split(".");
    if (parts[parts.length - 1] == "gifv") {
        parts[parts.length - 1] = "gif";
    }
    return parts.join('.');
}
function showUpvotedAuthors(user, limit, res){
  var authorNames = [];
  user.getUpvotedContent({limit:limit}).then(upvoted => {
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
function getUpvotedData(user, limit, upvoted){
  var subredditNames = [];
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
  subreddits.sort(function (a, b) {
      return b.count - a.count;
  });
  // add postedAgo and postedDate properties to every element
  for(var i = 0; i < subreddits.length; i++) {
    for(var j = 0;j < subreddits[i].posts.length; j++){
      var currentElement = subreddits[i].posts[j];
      var day = moment.unix(currentElement.created_utc);
      currentElement.postedAgo = day.fromNow(false,'d');
      currentElement.postedDate = day.format("DD MMMM YYYY");
        // change every .gifv extention to .gif
      if (!currentElement.media) {
          currentElement.url = changeGifvExtention(currentElement.url);
          currentElement.embedPost = false;
      } else {
          currentElement.embedPost = true;
      }
    }
  }
  return subreddits;
}

function showUpvoted(user, limit, res){
  user.getUpvotedContent({limit: limit}).then(upvoted => {
    var data = getUpvotedData(user, limit, upvoted);

    //console.log(subreddits[0].posts[0].subreddit_name_prefixed);
    //console.log(subreddits['r/Dota2'])
    res.render('upvoted', {
        subreddits: data,
        user: user,
        limit: limit
      });
  });
}
module.exports = {
  showUpvotedAuthors: showUpvotedAuthors,
  getUpvotedData: getUpvotedData,
  showUpvoted: showUpvoted
}
