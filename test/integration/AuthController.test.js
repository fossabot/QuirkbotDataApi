var request = require( 'supertest-as-promised' );
var expect = require( 'chai' ).expect;
var requestToken = require( '../utilities/requestToken' );
var users = require( '../fixtures/User' );
var user = users[ 0 ];

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
    	requestToken()
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

	it( 'should set confirmedEmail to true by accessing /auth/confirm/id', function ( done ) {
		var token;
		requestToken()
			.then( function( res ) {
				token = res.body.access_token;
				return request( sails.hooks.http.app )
					.post( '/auth/confirm/' + user.id )
					.set( 'Content-Type', 'application/x-www-form-urlencoded; charset=utf-8' )
					.set( 'Authorization', 'Bearer ' + token )
					.expect( 200 )
					.expect( function( res ) {
						expect( res.body.confirmedEmail ).to.be.true;
					});
			})
			.then( function( res ) {
				done();
			})
			.catch( function( err ) {
				done( err );
			});
	});

	it( 'should generate a reset password request by accessing /auth/resetRequest passing your nickname', function ( done ) {
		request( sails.hooks.http.app )
			.post( '/auth/resetRequest' )
			.set( 'Content-Type', 'application/json; charset=utf-8' )
			.send({
				nickname: user.nickname
			})
			.then( function( res ) {
				return ResetRequest.findOne( res.body.data.requestId )
					.exec( function( err, request ) {
						expect( err ).to.not.be.ok;
						expect( request ).to.be.ok;
						expect( request.active ).to.be.true;
					})
			})
			.then( function( res ) {
				done();
			})
			.catch( function( err ) {
				done( err );
			})

	})

	it( 'should modify user\'s password by accessing /auth/reset passing a token and password', function ( done ) {
		var newPassword = 'abcdef';
		var requestId;
		// Request a reset
		request( sails.hooks.http.app )
			.post( '/auth/resetRequest' )
			.set( 'Content-Type', 'application/json; charset=utf-8' )
			.send({
				nickname: user.nickname
			})
			// Find the reset request in order to get the token
			.then( function( res ) {
				requestId = res.body.data.requestId;
				return ResetRequest.findOne( requestId )
			})
			// Reset password
			.then( function( resetRequest ) {
				return request( sails.hooks.http.app )
				.post( '/auth/reset' )
				.set( 'Content-Type', 'application/json; charset=utf-8' )
				.send({
					token: resetRequest.token,
					password: newPassword
				})
				.expect( 200 )
			})
			// Get an access token with the new password
			.then( function( res ){
				return requestToken({
					username: user.nickname,
					password: newPassword
				})
			})
			// Try to login with token generated by the new password
			.then( function( res ) {
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
			})
	});

	it( 'should deactivate the reset password request by accessing /auth/reset passing a token and password', function ( done ) {
		var newPassword = 'abcdef';
		var requestId;
		// Request a reset
		request( sails.hooks.http.app )
			.post( '/auth/resetRequest' )
			.set( 'Content-Type', 'application/json; charset=utf-8' )
			.send({
				nickname: user.nickname
			})
			// Find the reset request in order to get the token
			.then( function( res ) {
				requestId = res.body.data.requestId;
				return ResetRequest.findOne( requestId )
			})
			// Reset password
			.then( function( resetRequest ) {
				return request( sails.hooks.http.app )
				.post( '/auth/reset' )
				.set( 'Content-Type', 'application/json; charset=utf-8' )
				.send({
					token: resetRequest.token,
					password: newPassword
				})
				.expect( 200 )
			})
			// Find the reset request again
			.then( function( res ) {
				return ResetRequest.findOne( requestId )
			})
			// Check if it's deactivated
			.then( function( res ) {
				expect( res.active ).to.not.be.true;
			})
			.then( function( res ) {
				done();
			})
			.catch( function( err ) {
				done( err );
			})
	});

});
