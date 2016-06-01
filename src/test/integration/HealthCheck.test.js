var request = require( 'supertest-as-promised' );

describe( 'HealthCheck', function() {

  it( 'Should pass health check', function ( done ) {
    request( sails.hooks.http.app )
      .post( '/' )
      .expect( 200 )
			.end( done )
  });

});
