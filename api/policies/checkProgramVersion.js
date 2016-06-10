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
    req.body.version = req.body.version || 0;
    return Program.findOne( { id: req.params.id } )
    // populate( 'author' )
    .exec( function( err, program ) {
        if( program.version >= req.body.version ) {
            return res.ok( program );
        } else {
            return next();
        }
    })
};
