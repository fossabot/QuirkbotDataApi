/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require( 'passport' );
var bcrypt = require( 'bcrypt' );

module.exports = {

	_config: {
		rest: false
	},
	// Get an access token or refresh it. Check README.md to know
	// the parameters
  token: OAuthService.grant(),
	// Resend account authentication request by email
	resendConfirmation: function( req, res ) {
		if( !req.body || !req.body.email ) {
			return res.serverError( 'Email not found' );
		}
		User.findOne(
			{ email: req.body.email },
			function( err, user ) {
				if( err || !user ) {
					res.serverError( 'Email not found' );
				}
				EmailService.sendConfirmation( user, function( err ) {
					if( err ) {
						console.log( 'error', err, user );
					}
				});
				res.ok( 'Email sent' );
			}
		)
	},
	// Confirm user account.
  confirm: function( req, res ) {
		User.update( { id: req.user.id }, { confirmedEmail: true } )
		.exec( function( err, user ) {
			if( err ) {
				return res.serverError( err );
			}
			res.json( user );
		});
	},
	// Send a reset password link to user
	resetRequest: function( req, res ) {
		if( !req.body || !req.body.email ) {
			return res.serverError( 'Email not found' );
		}

		User.findOne(
			{ email: req.body.email },
			function( err, user ) {
				if( err || !user ) {
					return res.serverError( 'Email not found' );
				}
				ResetRequest.create({
					userId: user.id
				}).exec( function( err, request ) {
					if( err ) {
						return res.serverError( 'Could not request reset' );
					}
					EmailService.sendReset( user, request, function( err, data ) {
						if( err ) {
							return res.serverError( 'Could not send email' );
						}
						return res.ok( data );
					})
				});
			}
		);

	},
	// Update user password to a new one without need to
	// authenticate.
	reset: function( req, res ) {
		if( !req.body || !req.body.token || !req.body.password ) {
			return res.serverError( 'Could not reset password' );
		}
		ResetRequest.findOne(
			{ token: req.body.token, active: true },
			function( err, request ) {
				if( err || !request ) {
					return res.serverError( 'Invalid reset token' );
				}
				bcrypt.hash(
					req.body.password,
					10,
					function passwordEncrypted( err, encryptedPassword ) {
						if( err ) {
							return res.serverError( 'Could not encrypt password' );
						}
						User.update( { id: request.userId }, { password: encryptedPassword})
						.exec( function( err, user ) {
							if( err || !user ) {
								return res.serverError( 'Could not update password' );
							}
							ResetRequest.update(
								{ userId: request.userId },
								{ active: false }
							).exec( function() {
								res.ok( user );
							});
						})
					}
				);
			}
		)

	}
};
