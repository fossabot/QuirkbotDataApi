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
	createClient( function() {
		if( process.env.NODE_ENV == 'lite' ) {
			createUser( cb )
		} else {
			cb();
		}
	});
};

var createClient = function( cb ) {
	Client.findOne(
		{ clientId: 'abc1' },
		function( err, client ) {
			if( err ) {
				console.log( err );
				cb( err );
			}
			if( client ) {
				console.log( 'default client already exists' );
				cb();
			} else {
				Client.create({
					clientId: 'abc1',
					clientSecret: 'asd'
				})
				.exec( cb );
			}
		}
	)
}

var createUser = function( cb ) {
	User.findOne(
		{ nickname: process.env.LITE_NICKNAME },
		function( err, user ) {
			if( err ) {
				console.log( err )
				cb( err );
			}
			if( user ) {
				console.log( 'default user already exists' );
				cb()
			} else {
				User.create({
					email: process.env.LITE_EMAIL,
					password: process.env.LITE_PASSWORD,
					birthdate: new Date('2000-01-01'),
					nickname: process.env.LITE_NICKNAME,
					confirmedEmail: true
				})
				.exec( cb )
			}
		}
	)
}
