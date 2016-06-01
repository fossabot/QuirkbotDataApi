/**
 * isYou
 *
 * @module      :: Policy
 * @description :: Check if it's the logged in user is the same as the
 *                 user to be updated
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function( req, res, next ) {
	if( req.params.id == req.user.id ) {
		return next();
	}
	return res.forbidden(
		new ErrorService({
			code: 'NOT_YOURSELF',
			message: 'You are not permitted to perform this action',
			data: undefined
		})

	);
};
