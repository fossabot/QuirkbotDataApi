/**
 * ProgramController
 *
 * @description :: Server-side logic for managing programs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function( req, res, next ) {
		req.body.author = req.user.id;

		Program.findOne(
			{ id: req.body.id },
			function( err, program ) {
				if( err ) {
					return res.serverError( err );
				}

				if( program ) {
					if( program.version > req.body.version ) {
						// Server program is the newest version
						return res.ok( program );
					} else {
						// Server program is an older version
						Program.update(
							{ id: program.id },
							req.body
						).exec( function( err, updatedProgram ) {
							if( err ) {
								return res.serverError( err );
							}
							return res.ok( updatedProgram );
						});
					}
				} else {
					delete req.body.id;
					Program.create( req.body ).exec( function( err, program ) {
						if( err ) {
							return res.serverError( err );
						}
						return res.ok( program );
					})
				}

			}
		);
	}
};
