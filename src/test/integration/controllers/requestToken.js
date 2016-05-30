var request = require( 'supertest' );

module.exports = function( opts ) {
	return request( sails.hooks.http.app )
		.post( '/oauth/token' )
		.set( 'Content-Type', 'application/x-www-form-urlencoded' )
		.set( 'Authorization', 'Basic YWJjMTphc2Q=' )
		.send({
			username: opts.username,
			password: opts.password,
			grant_type: 'password'
		});
}
