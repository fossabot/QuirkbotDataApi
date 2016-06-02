/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function( cb ) {
	createClient( cb );
};

var createClient = function( cb ) {
	Client.findOne(
		{ clientId: 'abc1' },
		function( err, client ) {
			if( err ) {
				console.log( err );
			}
			if( client ) {
				console.log( 'default client already exists' );
				cb();
			} else {
				Client.create({
					clientId: 'abc1',
					clientSecret: 'asd'
				})
				.exec( function( err, client ) {
					//console.log( 'CLIENT CREATED', client );
					cb();
				});
			}
		}
	)
}
