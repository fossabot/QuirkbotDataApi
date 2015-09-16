/**
 * ProgramController
 *
 * @description :: Server-side logic for managing programs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	create: function( req, res, next ) {
		req.body = req.body || {};
		req.body.author = req.user.id;
		next();
	},

	createOrUpdate: function( req, res ) {
		if( req.body.id ) {
			console.log( 'Id passed' );
			Program.findOne( { id: req.body.id } )
			.exec( function( err, program ) {
				// Program found
				if( program ) {
					console.log( 'Program found' );
					if( program.author == req.user.id ) {
						// You are the author
						console.log( 'You are the author' );
						if( program.version > req.body.version ) {
							// Server program is newer
							console.log( 'Server program is newer' );
							console.log( '-------------------' );
							res.ok( program );
						} else {
							// Posted program is newer
							console.log( 'Posted program is newer' );
							delete req.body.id;
							Program.update(
								{ id: program.id },
								req.body
							).exec( function( err, updatedProgram ) {
								console.log( 'Program updated' );
								console.log( '-------------------' );
								res.ok( updatedProgram );
							})
						}
					} else {
						// You are not the author, fork it
						console.log( 'You are not the author' );
						delete program.id;
						program.author = req.user.id;
						Program.create( program.toJSON() )
						.exec( function( err, forkedProgram ) {
							console.log( 'forked program created' );
							console.log( '-------------------' );
							res.ok( forkedProgram );
						});
					}
				} else {
					// Program not found, create program from scratch
					console.log( 'program not found, creating from scratch' );
					delete req.body.id;
					req.body.author = req.user.id;
					Program.create( req.body )
					.exec( function( err, newProgram ) {
						console.log( 'new program created' );
						console.log( '-------------------' );
						res.ok( newProgram );
					});
				}
			})
		} else {
			// No program id passed, create program from scratch
			console.log( 'No id passed, creating program from scratch' );
			req.body.author = req.user.id;
			Program.create( req.body )
			.exec( function( err, newProgram ) {
				console.log( 'new program created' );
				console.log( '-------------------' );
				res.ok( newProgram );
			});
		}
	}

};
