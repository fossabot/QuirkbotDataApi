/**
 * ProgramController
 *
 * @description :: Server-side logic for managing programs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	// if id
	// 	find program
	// 		if program exists
	// 			if is author
	// 				if server version is newer
	// 					return server program
	// 				else server version is older
	// 					update program
	// 					return updated program
	// 			else is not author
	// 				clear id
	// 				set author to logged user
	// 				create program
	// 				return created program
	// 		else program does not exist
	// 			clear id
	// 			set author to logged user
	// 			create program
	// 			return created program
	// else no id
	// 	set author to logged user
	// 	create program
	// 	return created program

	create: function( req, res ) {
		if( !req.body ) {
			res.badRequest(
				new ErrorService({
					code: 'PROGRAM_NOT_FOUND',
					message: 'Program id not provided',
					data: req.body
				})
			)
		}
		if( req.body.id ) {
			// Find the program
			Program.findOne( { id: req.body.id }, function( err, program ) {
				if( err ) {
					return res.serverError(
						new ErrorService({
							code: 'PROGRAM_NOT_FOUND',
							message: 'Error searching program',
							data: err
						})
					);
				}
				// If program exists
				if( program ) {
					// If you are the author
					if( program.author.id == req.user.id ) {
						// If server program is newer
						if( program.version > req.body.version ) {
							// Return server program
							res.ok( program );
						} else {
							// If posted program is newer, update it
							Program.update(
								{ id: program.id },
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
						// If you are not the author
						delete program.id;
						program.author = req.user.id;
						Program.create( program ).exec( function( err, newProgram ) {
							if( err ) {
								return res.serverError(
									new ErrorService({
										code: 'PROGRAM_CREATE',
										message: 'Error creating program',
										data: err
									})
								);
							}
							res.ok( newProgram );
						})
					}
				} else {
					// If program doesn't exist
					delete req.body.id;
					req.body.author = req.user.id;
					Program.create( req.body ).exec( function( err, newProgram ) {
						if( err ) {
							return res.serverError(
								new ErrorService({
									code: 'PROGRAM_CREATE',
									message: 'Error creating program',
									data: err
								})
							);
						}
						res.ok( newProgram );
					})
				}
			})
		} else {
			// No program id provided
			program.author = req.user.id;
			Program.create( program ).exec( function( err, newProgram ) {
				if( err ) {
					return res.serverError(
						new ErrorService({
							code: 'PROGRAM_CREATE',
							message: 'Error creating program',
							data: err
						})
					);
				}
				res.ok( newProgram );
			})
		}
	}

};
