/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	confirm: function( req, res ) {
		User.update( { id: req.user.id }, { confirmedEmail: true } )
		.exec( function( err, user ) {
			if( err ) {
				return res.serverError( err );
			}
			res.json( user );
		});
	}
};

