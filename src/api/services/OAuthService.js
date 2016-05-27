var OAuthServiceModel = require( './OAuthServiceModel' );
var oauthserver = require('oauth2-server');
var oauth = oauthserver({
  model: OAuthServiceModel,
  grants: [ 'password', 'refresh_token' ],
  debug: ( process.env.NODE_ENV == 'development' )
});

module.exports = oauth;
