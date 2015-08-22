var bcrypt = require( 'bcrypt' );

module.exports = {
	attributes: {
		userId: {
			type: 'string',
			required: true
		},
		token: {
			type: 'string'
		}
	},
	beforeCreate: function( values, next ) {
		bcrypt.genSalt( 10, function( err, salt ) {
			bcrypt.hash(
				'reset_password',
				salt, 
				function token( err, token ) {
					if( err ) {
						return next( err );
					}
					values.token = token;
					next();
				}
			)
		});
	}
}