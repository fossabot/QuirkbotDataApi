var OAuthModel = require( './OAuthModel' );
var oauthserver = require('oauth2-server');
var oauth = oauthserver({
  model: OAuthModel,
  grants: [ 'password', 'refresh_token' ],
  debug: true
});

module.exports = oauth;