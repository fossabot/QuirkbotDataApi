require( 'dotenv' ).config( { silent: true } );
console.log( 'NODE_ENV', process.env.NODE_ENV );

var sails = require( 'sails' );
var populate = require( './utilities/populateDb' );


beforeEach( function( done ) {
	populate( done );
});

before( function( done ) {

  sails.lift(
		{
			models: {
	      connection: 'test',
	      migrate: 'drop'
	    }
		},
		function( err, server ) {
			if( sails.config.models.connection != 'test' ) {
				return done( "Can't run tests if it's not on test environment!" );;
			}
	    if ( err ) {
				return done( err );
			}

			console.log( 'Adding fixtures' );
			populate( done );
	  }
	);

});

after( function( done ) {
	console.log( 'Cleaning fixtures' );
  // Cleaning fixtures
	sails.lower( done );
});
