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
	User.findOne(
		{ id: req.user.id },
		function( err, user ) {
			if( err || !user.confirmedEmail ) {
				return res.forbidden(
					new ErrorService({
						code: 'NOT_CONFIRMED',
						message: 'You must confirm your email before proceed',
						data: err
					})
				);
			}
			return next();
		}
	);
};
