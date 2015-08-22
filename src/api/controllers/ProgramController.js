/**
 * ProgramController
 *
 * @description :: Server-side logic for managing programs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function( req, res, next ) {
		req.body.author = req.user.id;
		Program.create( req.body )
		.exec( function( err, program ) {
			if( err ) {
				return res.serverError( err );
			}
			res.json( program );
		});
	}
};

