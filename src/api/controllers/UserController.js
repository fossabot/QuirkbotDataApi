/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    me: function( req, res ) {
        User.findOne( { id: req.user.id } )
        .exec( function( err, user ) {
            if( err ) {
                return res.forbidden(
                    new ErrorService({
                        code: 'USER_NOT_FOUND',
                        message: 'Error finding user',
                        data: err
                    })
                )
            }
            if( !user ) {
                return res.forbidden(
                    new ErrorService({
                        code: 'USER_NOT_FOUND',
                        message: 'Couldn\'t find user',
                        data: err
                    })
                )
            }
            res.ok( user );
        })
    }
};
