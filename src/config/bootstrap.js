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
	User.create({
		email: 'murilo@asd.com',
		nickname: 'murilo',
		password: 'murilo',
		birthdate: '1989-04-14',
		country: 'br'
	})
	.exec( function( err, user ) {
		console.log( 'USER CREATED', user );
		Client.create({
			clientId: 'abc1',
			clientSecret: 'asd'
		})
		.exec( function( err, client ) {
			console.log( 'CLIENT CREATED', client );
			cb();
		});
	})
};
