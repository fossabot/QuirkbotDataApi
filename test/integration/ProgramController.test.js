var request = require( 'supertest-as-promised' );
var expect = require( 'chai' ).expect;
var requestToken = require( '../utilities/requestToken' );
var users = require( '../fixtures/User' );
var user = users[ 0 ];

describe( 'ProgramController', function() {

	it( 'should get 403 trying to update a program without access token', function ( done ) {
		Program.create({
			author: users[ 1 ].id
		})
		.then( function( program ) {
			return request( sails.hooks.http.app )
				.put( '/program/' + program.id )
				.set( 'Content-Type', 'application/json; charset=utf-8' )
				.expect( 403 )
		})
		.then( function() { done(); } )
		.catch( done )
	});

	it( 'should get 403 trying to delete a program without access token', function ( done ) {
		Program.create({
			author: users[ 1 ].id
		})
		.then( function( program ) {
			return request( sails.hooks.http.app )
				.del( '/program/' + program.id )
				.set( 'Content-Type', 'application/json; charset=utf-8' )
				.expect( 403 )
		})
		.then( function() { done(); } )
		.catch( done )
	});

	it( 'should get 403 trying to create a program without access token', function ( done ) {
			request( sails.hooks.http.app )
				.post( '/program' )
				.set( 'Content-Type', 'application/json; charset=utf-8' )
				.expect( 403 )
				.end( done );
	});

	it( 'should create a program posting to /program and passing an access token', function( done ) {
		requestToken()
			.then( function( res ) {
				return request( sails.hooks.http.app )
					.post( '/program' )
					.set( 'Content-Type', 'application/json; charset=utf-8' )
					.set( 'Authorization', 'Bearer ' + res.body.access_token )
					.expect( 201 );
			})
			.then( function() { done() } )
			.catch( done );
	});

	it( 'should get your user as owner of a created program', function ( done ) {
		requestToken()
			.then( function( res ) {
				return request( sails.hooks.http.app )
					.post( '/program' )
					.set( 'Content-Type', 'application/json; charset=utf-8' )
					.set( 'Authorization', 'Bearer ' + res.body.access_token )
					.expect( 201 );
			})
			.then( function( res ) {
				expect( res.body.author + '' ).to.equal( user.id + '' );
			})
			.then( function() { done() } )
			.catch( done );
	});

	it( 'should get 200 trying to update your own program', function ( done ) {
		var token;
		requestToken()
			.then( function( res ) {
				token = res.body.access_token;
				return request( sails.hooks.http.app )
					.post( '/program' )
					.set( 'Content-Type', 'application/json; charset=utf-8' )
					.set( 'Authorization', 'Bearer ' + token )
			})
			.then( function( res ) {
				return request( sails.hooks.http.app )
					.put( '/program/' + res.body.id )
					.set( 'Content-Type', 'application/json; charset=utf-8' )
					.set( 'Authorization', 'Bearer ' + token )
					.expect( 200 )
			})
			.then( function() { done() } )
			.catch( done );
	});

	it( 'should get 200 trying to delete your own program', function ( done ) {
		var token;
		requestToken()
			.then( function( res ) {
				token = res.body.access_token;
				return request( sails.hooks.http.app )
					.post( '/program' )
					.set( 'Content-Type', 'application/json; charset=utf-8' )
					.set( 'Authorization', 'Bearer ' + token )
			})
			.then( function( res ) {
				return request( sails.hooks.http.app )
					.del( '/program/' + res.body.id )
					.set( 'Content-Type', 'application/json; charset=utf-8' )
					.set( 'Authorization', 'Bearer ' + token )
					.expect( 200 )
			})
			.then( function() { done() } )
			.catch( done );
	});

	it( 'should get 403 trying to update another program user', function ( done ) {
		var programId;
		requestToken({
				username: users[ 1 ].nickname,
				password: users[ 1 ].password
			})
			.then( function( res ) {
				return request( sails.hooks.http.app )
					.post( '/program' )
					.set( 'Content-Type', 'application/json; charset=utf-8' )
					.set( 'Authorization', 'Bearer ' + res.body.access_token )
			})
			.then( function( res ) {
				programId = res.body.id;
				return requestToken()
			})
			.then( function( res ) {
				return request( sails.hooks.http.app )
					.put( '/program/' + programId )
					.set( 'Content-Type', 'application/json; charset=utf-8' )
					.set( 'Authorization', 'Bearer ' + res.body.access_token )
					.expect( 403 );
			})
			.then( function() { done() } )
			.catch( done );
	});

	it( 'should get 403 trying to delete another program user', function ( done ) {
		var programId;
		requestToken({
				username: users[ 1 ].nickname,
				password: users[ 1 ].password
			})
			.then( function( res ) {
				return request( sails.hooks.http.app )
					.post( '/program' )
					.set( 'Content-Type', 'application/json; charset=utf-8' )
					.set( 'Authorization', 'Bearer ' + res.body.access_token )
			})
			.then( function( res ) {
				programId = res.body.id;
				return requestToken()
			})
			.then( function( res ) {
				return request( sails.hooks.http.app )
					.del( '/program/' + programId )
					.set( 'Content-Type', 'application/json; charset=utf-8' )
					.set( 'Authorization', 'Bearer ' + res.body.access_token )
					.expect( 403 );
			})
			.then( function() { done() } )
			.catch( done );
	});

	it( 'should get a json array on GET /program', function ( done ) {
		request( sails.hooks.http.app )
			.get( '/program' )
			.expect( 200 )
			.expect( 'Content-Type', /json/ )
			.expect( function( res ) {
				expect( res.body.length ).to.exist;
			})
			.end( done )
	})

	it( 'should get all programs on GET /program', function ( done ) {
		requestToken()
		.then( function( res ) {
			return request( sails.hooks.http.app )
				.post( '/program' )
				.set( 'Content-Type', 'application/json; charset=utf-8' )
				.set( 'Authorization', 'Bearer ' + res.body.access_token )
		})
		.then( function( res ) {
			return requestToken({
				username: users[ 1 ].nickname,
				password: users[ 1 ].password
			})
		})
		.then( function( res ) {
			return request( sails.hooks.http.app )
				.post( '/program' )
				.set( 'Content-Type', 'application/json; charset=utf-8' )
				.set( 'Authorization', 'Bearer ' + res.body.access_token )
		})
		.then( function( res ) {
			return request( sails.hooks.http.app )
				.get( '/program' )
				.expect( 200 )
				.expect( 'Content-Type', /json/ )
				.expect( function( res ) {
					expect( res.body.length ).to.equal( 2 );
				})
		})
		.then( function() { done() } )
		.catch( done );
	})

	it( 'should get a list of programs from a specific user on /program?author=id', function ( done ) {
		var programId;
		requestToken()
		.then( function( res ) {
			return request( sails.hooks.http.app )
				.post( '/program' )
				.set( 'Content-Type', 'application/json; charset=utf-8' )
				.set( 'Authorization', 'Bearer ' + res.body.access_token )
		})
		.then( function( res ) {
			return requestToken({
				username: users[ 1 ].nickname,
				password: users[ 1 ].password
			})
		})
		.then( function( res ) {
			return request( sails.hooks.http.app )
				.post( '/program' )
				.set( 'Content-Type', 'application/json; charset=utf-8' )
				.set( 'Authorization', 'Bearer ' + res.body.access_token )
		})
		.then( function( res ) {
			programId = res.body.id;
			return request( sails.hooks.http.app )
				.get( '/program/?author=' + users[ 1 ].id )
				.set( 'Content-Type', 'application/json; charset=utf-8' )
		})
		.then( function( res ) {
			expect( res.body.length ).to.equal( 1 );
			expect( res.body[ 0 ].id ).to.equal( programId );
		})
		.then( function() { done() } )
		.catch( done );
	})


});
