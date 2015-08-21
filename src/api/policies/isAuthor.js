/**
 * isYou
 *
 * @module      :: Policy
 * @description :: Check if it's the logged in user is the same as the 
 *                 program author
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function( req, res, next ) {
	Program.findOne( 
		{ author: req.user.id, id: req.params.id },
		function( err, program ) {
			if( err || !program ) {
				return res.forbidden( 'You are not permitted to perform this action.' );
			}
			return next();
		}
	);
};
