var request = require( 'supertest-as-promised' );
var users = require( '../fixtures/User' );
var user = users[ 0 ];

module.exports = function( nickname ) {
	nickname = nickname || undefined;
	return request( sails.hooks.http.app )
		.get( '/user?nickname=' + ( nickname || user.nickname ) );
}
