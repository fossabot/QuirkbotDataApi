/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require( 'passport' );

module.exports = {

    _config: {
        actions: false,
        shortcuts: false,
        rest: false
    },

    login: function( req, res ) {

        passport.authenticate( 'local', function( err, user, info ) {
            if( ( err ) || ( !user ) ) {
                return res.badRequest({
                    message: info.message,
                    data: {
                        error: err,
                        user: user,
                        info: info
                    }
                });
            }

            req.logIn( user, function( err ) {
                if( err ) {
                    return res.serverError({
                        message: 'Could not login',
                        data: {
                            error: err
                        }
                    });
                }
                return res.ok({
                    message: info.message,
                    user: user
                });
            });

        })(req, res);
    },

    logout: function(req, res) {
        req.logout();
        res.ok({
            message: 'You are logged out now.',
            data: {}
        })
    }
};
