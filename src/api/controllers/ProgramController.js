/**
 * ProgramController
 *
 * @description :: Server-side logic for managing programs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function( req, res, next ) {
		// Always override the author with the current logged user
		req.body.author = req.user.id;

		Program.findOne(
			{ id: req.body.id },
			function( err, program ) {
				if( err ) {
					return res.serverError(
						new ErrorService({
							code: 'PROGRAM_NOT_FOUND',
							message: 'Error finding program',
							data: err
						})
					);
				}

				// If program exists, check if the server's version is newer and return
				// it else if server's version is older, update with posted version.
				// If program doesn't exist, create a new program, replace posted id
				// with database generated id and return the brand new program.
				if( program ) {
					if( program.version > req.body.version ) {
						return res.ok( program );
					} else {
						Program.update(
							{ id: program.id },
							// TODO: Validate this body request
							req.body
						).exec( function( err, updatedProgram ) {
							if( err ) {
								return res.serverError(
									new ErrorService({
										code: 'PROGRAM_UPDATE',
										message: 'Error updating program',
										data: err
									})
								);
							}
							return res.ok( updatedProgram );
						});
					}
				} else {
					delete req.body.id;
					Program.create( req.body ).exec( function( err, program ) {
						if( err ) {
							return res.serverError(
								new ErrorService({
									code: 'PROGRAM_CREATE',
									message: 'Error creating program',
									data: err
								})
							);
						}
						return res.ok( program );
					})
				}

			}
		);
	}
};
