var request = require( 'supertest' );
var requestToken = require( './requestToken' );

describe( 'UserController', function() {

	it( 'should return 200 on /user', function ( done ) {
		request( sails.hooks.http.app )
			.get( '/user' )
			.expect( 200 )
			.end( done )
	});

	it( 'should get a json (array) on /user', function ( done ) {
		request( sails.hooks.http.app )
			.get( '/user' )
			.expect('Content-Type', /json/)
			.expect( function( res ) {
				if( !res.body.length ) {
					throw new Error( 'response should be an array' );
				}
			})
			.end( done )
	});

	it( 'should see only "nickname", "region" and "confirmedEmail" on listed users at /user', function ( done ) {
		request( sails.hooks.http.app )
			.get( '/user' )
			.expect(function( res ) {
				res.body.forEach( function( user ) {

					if( user.id ) {
						throw new Error( 'id should be hidden' );
					}
					if( user.password ) {
						throw new Error( 'password should be hidden' );
					}
					if( user.email ) {
						throw new Error( 'email should be hidden' );
					}
					if( user.country ) {
						throw new Error( 'country should be hidden' );
					}
					if( user.gender ) {
						throw new Error( 'gender should be hidden' );
					}
					if( user.birthdate ) {
						throw new Error( 'birthdate should be hidden' );
					}

				})
			})
			.end( done );
	});

	it( 'should get a json array on /user/?nickname=validnickname', function ( done ) {
		request( sails.hooks.http.app )
			.get( '/user/?nickname=janedoe' )
			.expect(function( res ) {
				if( !res.body.length ) {
					throw new Error( 'response should be an array' );
				}
				if( res.body[ 0 ].nickname.indexOf( 'janedoe' ) == -1 ) {
					throw new Error( 'wrong user' );
				}
			})
			.end( done );
	});

	it( 'should get 403 accessing /user/me without valid access token', function ( done ) {
		request( sails.hooks.http.app )
			.get( '/user/me' )
			.expect( 403 )
			.end( done );
	});


	it( 'should get 200 accessing /user/me with a valid access token', function ( done ) {
		requestToken({
			username: 'janedoe',
			password: '123456'
		})
		.end( function( err, res ) {
			if( err ) {
				done( err );
			} else {
				request( sails.hooks.http.app )
					.get( '/user/me' )
					.set( 'Content-Type', 'application/json; charset=utf-8' )
					.set( 'Authorization', 'Bearer ' + res.body.access_token )
					.expect( 200 )
					.end( done );
			}
		});
	});

	it( 'should be able to get hidden information accessing /me with correct access token', function ( done ) {
		requestToken({
			username: 'janedoe',
			password: '123456'
		})
		.end( function( err, res ) {
			return request( sails.hooks.http.app )
				.get( '/user/me' )
				.set( 'Content-Type', 'application/json; charset=utf-8' )
				.set( 'Authorization', 'Bearer ' + res.body.access_token )
				.expect( 200 )
				.expect( function( res ) {
					if( !res.body.id ) {
						throw new Error( 'id should be visible' );
					}
					if( !res.body.email ) {
						throw new Error( 'email should be visible' );
					}
					if( !res.body.country ) {
						throw new Error( 'country should be visible' );
					}
					if( !res.body.gender ) {
						throw new Error( 'gender should be visible' );
					}
					if( !res.body.birthdate ) {
						throw new Error( 'birthdate should be visible' );
					}
					if( res.body.password ) {
						throw new Error( 'password should not be visible' );
					}
				})
				.end( done );
		});
	});


});
