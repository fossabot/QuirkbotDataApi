var bcrypt = require( 'bcrypt' );
var model = module.exports;

model.getAccessToken = function ( bearerToken, callback ) {
	accessToken.findOne(
		{ accessToken: bearerToken }, 
		function( err, token ) {
			if( err ) { callback( err ) };
			callback( null, {
				accessToken: token.accessToken,
				clientId: token.clientId,
				expires: token.expires,
				userId: token.userId
			});
		}
	);
};
model.getClient = function ( clientId, clientSecret, callback ) {
	Client.findOne(
		{ clientId: clientId },
		function( err, client ) {
			if( err ) { callback( err ) };
			if( !client ) { 
				console.log( 'No client was found' );
				callback( 'No client was found' );
			} else {
				callback( null, {
					clientId: client.clientId,
					clientSecret: client.clientSecret
				});
			}
		}
	);
};

var authorizedClientIds = [ 'abc1', 'def2' ];
model.grantTypeAllowed = function ( clientId, grantType, callback ) {
	if (grantType === 'password') {
		return callback( false, 
			authorizedClientIds.indexOf(clientId.toLowerCase()) >= 0
		);
	}
	callback( false, true );
}
model.saveAccessToken = function ( accessToken, clientId, expires, userId, callback ) {
	AccessToken.create({
		accessToken: accessToken,
		clientId: clientId,
		userId: userId,
		expires: expires
	}).exec( function( err, token ) {
		callback( err );
	});
}
model.getUser = function ( email, password, callback ) {
	User.findOne(
		{ email: email },
		function( err, user ) {
			bcrypt.compare( password, user.password, function ( err, res ) {
				callback( err, res || false );
			});
		}
	);
}