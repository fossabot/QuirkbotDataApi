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
	}
	
};
