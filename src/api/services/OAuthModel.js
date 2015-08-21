var bcrypt = require( 'bcrypt' );
var model = module.exports;

model.getAccessToken = function ( bearerToken, callback ) {
	AccessToken.findOne(
		{ accessToken: bearerToken }, 
		function( err, token ) {
			if( err ) { 
				return callback( err ) 
			};
			if( !token ) { 
				return callback( true );
			};
			return callback( null, {
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
model.saveAccessToken = function ( accessToken, clientId, expires, user, callback ) {
	AccessToken.create({
		accessToken: accessToken,
		clientId: clientId,
		userId: user.id,
		expires: expires
	}).exec( function( err, token ) {
		callback( err, token );
	});
}
model.getUser = function ( email, password, callback ) {
	User.findOne(
		{ email: email },
		function( err, user ) {
			if( user ) {
				bcrypt.compare( password, user.password, function ( err, success ) {
					callback( err, user || false );
				});
			} else {
				callback( true );
			}
		}
	);
}

/*
 * Required to support refreshToken grant type
 */
model.saveRefreshToken = function ( token, clientId, expires, user, callback ) {
	RefreshToken.create({
		refreshToken: token,
		clientId: clientId,
		userId: user.id,
		expires: expires
	})
	.exec( function( err, refreshToken ) {
  		console.log('in saveRefreshToken (token: ' + token + ', clientId: ' + clientId +', userId: ' + user.id + ', expires: ' + expires + ')');
		callback( err, refreshToken );
	});
};

model.getRefreshToken = function ( refreshToken, callback ) {
	RefreshToken.findOne( 
		{ refreshToken: refreshToken }, 
		function( err, token ) {
			console.log('in getRefreshToken (refreshToken: ' + refreshToken + ')');
			callback( err, token )
		}
	)
};