var request = require( 'supertest-as-promised' );
var expect = require( 'chai' ).expect;
var requestToken = require( '../utilities/requestToken' );

describe( 'AuthController', function() {

	it( 'should get 403 posting to /auth/token with incorrect fields', function ( done ) {
    	requestToken({
				username: 'janedoe',
				password: '12345'
			})
      .expect( 403 )
			.end( done )
  });

  it( 'should get 200 posting to /auth/token with all correct fields and headers', function ( done ) {
    	requestToken({
				username: 'janedoe',
				password: '123456'
			})
      .expect( 200 )
			.end( done )
  });

	it( 'should get 403 using an expired access token', function ( done ) {
		var token;
		requestToken()
			.then( function( res ) {
				token = res.body.access_token;
				return AccessToken.update(
					{ accessToken: token },
					{ expires: new Date( '1989-04-14 00:00:00' ) }
				);
			})
			.then( function() {
				return request( sails.hooks.http.app )
					.get( '/user/me' )
					.set( 'Content-Type', 'application/json; charset=utf-8' )
					.set( 'Authorization', 'Bearer ' + token )
					.expect( 403 )
			})
			.then( function( res ) {
				done();
			})
			.catch( function( err ) {
				done( err );
			})
	});

	it( 'should get a new access token using a refresh token', function ( done ) {
		var token;
		requestToken()
			.then( function( res ) {
				token = res.body;
				return request( sails.hooks.http.app )
					.post( '/oauth/token' )
					.set( 'Content-Type', 'application/x-www-form-urlencoded; charset=utf-8' )
					.set( 'Authorization', 'Basic YWJjMTphc2Q=' )
					.send({
						grant_type: 'refresh_token',
						refresh_token: token.refresh_token
					})
			})
			.then( function( res ) {
				expect( token.access_token ).to.not.equal( res.body.access_token );
				return request( sails.hooks.http.app )
				.get( '/user/me' )
				.set( 'Content-Type', 'application/json; charset=utf-8' )
				.set( 'Authorization', 'Bearer ' + res.body.access_token )
				.expect( 200 )
			})
			.then( function( res ) {
				done();
			})
			.catch( function( err ) {
				done( err );
			});
	})

	it( 'should get 403 using an expired refresh token', function ( done ) {
		var refreshToken;
		requestToken()
			.then( function( res ) {
				refreshToken = res.body.accessToken;
				return RefreshToken.update(
					{ refreshToken: refreshToken },
					{	expires: new Date( '1989-04-14 00:00:00' ) }
				);
			})
			.then( function( res ) {
				return request( sails.hooks.http.app )
					.post( '/oauth/token' )
					.set( 'Content-Type', 'application/x-www-form-urlencoded; charset=utf-8' )
					.set( 'Authorization', 'Basic YWJjMTphc2Q=' )
					.send({
						grant_type: 'refresh_token',
						refresh_token: refreshToken
					})
					.expect( 403 )
			})
			.then( function( res ) {
				done();
			})
			.catch( function( err ) {
				done( err );
			})
	})

});
