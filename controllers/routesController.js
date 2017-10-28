const moment = require('moment');

// if the post has a .gifv extention, change it to .gif
// this allows the img tag to play gfycat content
function changeGifvExtention(url) {
    var parts = url.split(".");
    if (parts[parts.length - 1] == "gifv") {
        parts[parts.length - 1] = "gif";
    }
    return parts.join('.');
}

// gets the user's latest upvotes and orders the authors by number of upvotes
function showUpvotedAuthors(user, limit, res){
  var authorNames = [];
  user.getUpvotedContent({limit:limit}).then(upvoted => {
    // populate the array with author names
    for (var i = 0; i < upvoted.length; i++) {
      authorNames.push(upvoted[i].author.name);
    }
    var counts = {};
    // counts how many times each author appears in the array
    authorNames.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    var authors = [];
    for (var author in counts) {
        authors.push([author, counts[author]]);
    }
    // sort the array such that the most upvoted is on the top
    authors.sort(function(a, b) {
        return b[1] - a[1];
    });
    // render the authors view with the data
    res.render('authors', {
        user: user,
        limit: limit,
        authors: authors
      });
  })
}

// returns an array of the upvoted subreddits and data about each post
function getUpvotedData(user, limit, upvoted){
  var subredditNames = [];
  for (var i = 0; i < upvoted.length; i++) {
    subredditNames.push({
      subreddit_name: upvoted[i].subreddit_name_prefixed,
      post: upvoted[i]
    });
  }
  var subreddits = [];
  // loop through subredditNames and structure the data into subreddits[]
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
      // if the element has media_embed element, change the iframe's src to data-src
      // to reduce loading times
      if(currentElement.media_embed.content){
        currentElement.media_embed.content = currentElement.media_embed.content.replace('src="','data-src="');
      }
    }
  }
  return subreddits;
}

// get the data and render the upvoted view
function showUpvoted(user, limit, res){
  user.getUpvotedContent({limit: limit}).then(upvoted => {
    var data = getUpvotedData(user, limit, upvoted);

    res.render('upvoted', {
        subreddits: data,
        user: user,
        limit: limit
      });
  });
}
// export the functions from the controller
module.exports = {
  showUpvotedAuthors: showUpvotedAuthors,
  getUpvotedData: getUpvotedData,
  showUpvoted: showUpvoted
}
