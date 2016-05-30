var request = require( 'supertest' );
var requestToken = require( './requestToken' );

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

});
