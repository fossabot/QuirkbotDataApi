/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function( req, res, next ) {
	return OAuthService.authorise()( req, res, function( err, data ) {
		if( err ) {
			return res.forbidden(
				new ErrorService({
					code: 'NOT_AUTHENTICATED',
					message: 'You are not logged in',
					data: err
				})
			);
		}
		return next();
	});
};
