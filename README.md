# Stats for Reddit
Gives you user-specific stats about your most upvoted subreddits
## Usage
In order to get the project up and running on your machine you have to :
- Clone the repo
- Go to the newly created folder (```cd stats-for-reddit```)
- Install dependancies with (```npm install```)
- Create a Reddit web app from [here](https://www.reddit.com/prefs/apps/) and make sure ```redirectUri``` in the web app and in ```routes.js``` is identical
- Set ```REDDIT_CLIENT_ID``` and ``REDDIT_CLIENT_SECRET`` as [environmental variables](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html)
- Run on localhost with ```node index.js``` (or [nodemon](https://github.com/remy/nodemon))
