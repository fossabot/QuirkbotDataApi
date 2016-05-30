require( 'dotenv' ).config( { silent: true } );
console.log( 'NODE_ENV', process.env.NODE_ENV );

var sails = require( 'sails' );

before( function( done ) {

  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout( 5000 );

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

			var Barrels = require('barrels');
			var barrels = new Barrels();
			var fixtures = barrels.data;
			barrels.populate( function( err ) {
				if( err ) return done( err );
				console.log( 'Database populated' );
				done();
			});
	  }
	);

});

after( function( done ) {
	console.log( 'Cleaning fixtures' );
  // Cleaning fixtures
	sails.lower( done );
});
