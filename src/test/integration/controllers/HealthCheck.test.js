var request = require( 'supertest' );

describe( 'HealthCheck', function() {

  it( 'Should pass health check', function ( done ) {
    request( sails.hooks.http.app )
      .post( '/' )
      .expect( 200 )
			.end( done )
  });

});
