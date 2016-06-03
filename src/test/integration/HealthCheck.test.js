var request = require( 'supertest-as-promised' );

describe( 'HealthCheck', function() {

  it( 'should return 200 on /', function ( done ) {
    request( sails.hooks.http.app )
      .get( '/' )
      .expect( 200 )
			.end( done )
  });

  it( 'should return 404 on /client', function ( done ) {
    request( sails.hooks.http.app )
      .get( '/client' )
      .expect( 404 )
			.end( done )
  });

  it( 'should return 404 on /accessToken', function ( done ) {
    request( sails.hooks.http.app )
      .get( '/accessToken' )
      .expect( 404 )
			.end( done )
  });

  it( 'should return 404 on /refreshToken', function ( done ) {
    request( sails.hooks.http.app )
      .get( '/refreshToken' )
      .expect( 404 )
			.end( done )
  });

  it( 'should return 404 on /resetRequest', function ( done ) {
    request( sails.hooks.http.app )
      .get( '/resetRequest' )
      .expect( 404 )
			.end( done )
  });



});
