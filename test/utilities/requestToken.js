var request = require( 'supertest-as-promised' );
var users = require( '../fixtures/User' );
var user = users[ 0 ];

module.exports = function( opts ) {
	opts = opts || {};
	return request( sails.hooks.http.app )
		.post( '/oauth/token' )
		.set( 'Content-Type', 'application/x-www-form-urlencoded' )
		.set( 'Authorization', 'Basic YWJjMTphc2Q=' )
		.send({
			username: opts.username || user.nickname,
			password: opts.password || user.password,
			grant_type: 'password'
		});
}
