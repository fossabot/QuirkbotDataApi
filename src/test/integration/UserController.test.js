var request = require( 'supertest-as-promised' );
var expect = require( 'chai' ).expect;
var requestToken = require( '../utilities/requestToken' );
var getUser = require( '../utilities/getUser' );
var populate = require( '../utilities/populateDb' );
var users = require( '../fixtures/User' );
var user = users[ 0 ];

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
				expect( res.body.length ).to.exist;
			})
			.end( done )
	});

	it( 'should see only "nickname", "region" and "confirmedEmail" on listed users at /user', function ( done ) {
		request( sails.hooks.http.app )
			.get( '/user' )
			.expect(function( res ) {
				res.body.forEach( function( user ) {
					expect( user.id ).to.not.exist;
					expect( user.password ).to.not.exist;
					expect( user.email ).to.not.exist;
					expect( user.email ).to.not.exist;
					expect( user.gender ).to.not.exist;
					expect( user.birthdate ).to.not.exist;

					expect( user.nickname ).to.exist;
					expect( user.region ).to.exist;
					expect( user.confirmedEmail ).to.exist;
				})
			})
			.end( done );
	});

	it( 'should get a json array on /user/?nickname=validnickname', function ( done ) {
		request( sails.hooks.http.app )
			.get( '/user/?nickname=janedoe' )
			.expect(function( res ) {
				expect( res.body[ 0 ].nickname ).to.contain( 'janedoe' );
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
		requestToken()
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
			});
	});

	it( 'should be able to get hidden information accessing /me with correct access token', function ( done ) {
		requestToken()
		.then( function( res ) {
			return request( sails.hooks.http.app )
				.get( '/user/me' )
				.set( 'Content-Type', 'application/json; charset=utf-8' )
				.set( 'Authorization', 'Bearer ' + res.body.access_token )
				.expect( 200 )
				.expect( function( res ) {
					expect( res.body.id ).to.exist;
					expect( res.body.password ).to.not.exist;
					expect( res.body.email ).to.exist;
					expect( res.body.country ).to.exist;
					expect( res.body.gender ).to.exist;
					expect( res.body.birthdate ).to.exist;

					expect( res.body.nickname ).to.exist;
					expect( res.body.region ).to.exist;
					expect( res.body.confirmedEmail ).to.exist;
				});
		})
		.then( function( res ) {
			done();
		})
		.catch( function( err ) {
			done( err );
		});
	});

	it( 'should be able to get your user object accessing /me with an access token', function ( done ) {
		requestToken()
		.then( function( res ) {
			return request( sails.hooks.http.app )
				.get( '/user/me' )
				.set( 'Content-Type', 'application/json; charset=utf-8' )
				.set( 'Authorization', 'Bearer ' + res.body.access_token )
				.expect( function( res ) {
					expect( res.body.nickname ).to.equal( user.nickname );
					expect( res.body.region ).to.equal( user.region );
					expect( res.body.confirmedEmail ).to.equal( user.confirmedEmail );
					expect( res.body.birthdate ).to.equal( user.birthdate );
					expect( res.body.gender ).to.equal( user.gender );
					expect( res.body.country ).to.equal( user.country );
					expect( res.body.email ).to.equal( user.email );
				});
		})
		.then( function( res ) {
			done();
		})
		.catch( function( err ) {
			done( err );
		});
	});

	describe( 'Should get error creating user without required fields', function() {
		it( 'should get 400 creating user without "email"', function ( done ) {
			request( sails.hooks.http.app )
			.post( '/user' )
			.send({
				nickname: 'ladyjane',
				birthdate: new Date(),
				password: 123123
			})
			.expect( 400 )
			.end( done );
		});
		it( 'should get 400 creating user without "password"', function ( done ) {
			request( sails.hooks.http.app )
			.post( '/user' )
			.send({
				email: 'ladyjane@quirkbot.com',
				nickname: 'ladyjane',
				birthdate: new Date()
			})
			.expect( 400 )
			.end( done );
		});
		it( 'should get 400 creating user without "birthdate"', function ( done ) {
			request( sails.hooks.http.app )
			.post( '/user' )
			.send({
				email: 'ladyjane@quirkbot.com',
				nickname: 'ladyjane',
				password: 123123
			})
			.expect( 400 )
			.end( done );
		});
		it( 'should get 400 creating user without "nickname"', function ( done ) {
			request( sails.hooks.http.app )
			.post( '/user' )
			.send({
				email: 'ladyjane@quirkbot.com',
				birthdate: new Date(),
				password: 123123
			})
			.expect( 400 )
			.end( done );
		});
	});

	it( 'should get 201 by posting to /user if "email", "password", "birthdate" and "nickname" are being sent', function ( done ) {
		request( sails.hooks.http.app )
		.post( '/user' )
		.send({
			email: 'ladyjane@quirkbot.com',
			nickname: 'ladyjane',
			birthdate: new Date(),
			password: 123123
		})
		.expect( 201 )
		.end( done );
	});

	it( 'should get 403 trying to update user without access token', function ( done ) {
		request( sails.hooks.http.app )
			.put( '/user/' + user.id )
			.expect( 403 )
			.end( done );
	});

	it( 'should get 403 trying to delete user without access token', function ( done ) {
		request( sails.hooks.http.app )
			.del( '/user/' + user.id )
			.expect( 403 )
			.end( done );
	});

/*
	it( 'should get 200 trying to update your own user', function ( done ) {
		var token;
		requestToken()
			.then( function ( res ) {
				token = res.body.access_token;
				console.log( 'token', token, user.id );
				return request( sails.hooks.http.app )
					.put( '/user/' + user.id )
					.set( 'Content-Type', 'application/json; charset=utf-8' )
					.set( 'Authorization', 'Bearer ' + token )
					.expect( 200 )
			})
			.then( function ( res ) {
				done();
			})
			.catch( function ( err ) {
				done( err );
			})
	});

	it( 'should get 200 trying to delete your own user', function ( done ) {
		var token;
		requestToken()
			.then( function ( res ) {
				token = res.body.access_token;
				return request( sails.hooks.http.app )
					.del( '/user/' + user.id )
					.set( 'Content-Type', 'application/json; charset=utf-8' )
					.set( 'Authorization', 'Bearer ' + token )
					.expect( 200 )
			})
			.then( function ( res ) {
				done();
			})
			.catch( function ( err ) {
				done( err );
			})
	});

	it( 'should get 403 trying to update another user', function ( done ) {
		var token;
		requestToken()
			.then( function( res ) {
				token = res.body.access_token;
				return getUser( 'johndoe' )
			})
			.then( function( res ) {
				console.log( res.body );
				done();
			})
	})
	*/
});
