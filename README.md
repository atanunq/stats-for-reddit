# reddit-stats
In order for the index.js script to work, you must create a `config.js` file such as in the example below :
```javascript
const snoowrap = require('snoowrap');
module.exports = {
  init: function() {
    return new snoowrap({
      userAgent: 'put your user-agent string here',
      clientId: 'put your clientId here',
      clientSecret: 'put your clientSecret here',
      username: 'put your username here',
      password: 'put your password here'
    });
  }
};
```
