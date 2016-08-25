/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require( 'passport' );
var bcrypt = require( 'bcrypt-nodejs' );

module.exports = {

	_config: {
		rest: false
	},
	// Get an access token or refresh it. Check README.md to know the parameters
	token: function( req, res ) {
		OAuthService.grant()( req, res, function( err, data ) {
			if( err ) {
				return res.forbidden(
					new ErrorService({
						code: 'AUTH_GRANT',
						message: 'Failed on authenticate user',
						data: err
					})
				);
			}
		});
	},
	// Resend account authentication request by email
	resendConfirmation: function( req, res ) {
		if( !req.body || !req.body.nickname ) {
			return res.badRequest(
				new ErrorService({
					code: 'USER_NOT_FOUND',
					message: 'User not found',
					data: err
				})
			);
		}
		User.findOne(
			{ nickname: req.body.nickname },
			function( err, user ) {
				if( err || !user ) {
					res.serverError(
						new ErrorService({
							code: 'USER_NOT_FOUND',
							message: 'User not found',
							data: err
						})
					);
				}
				EmailService.sendConfirmation( user, function( err ) {
					if( err ) {
						sails.log( 'error', err, user );
					}
				});
				res.ok( 'Email sent' );
			}
		)
	},
	// Confirm user account.
	confirm: function( req, res ) {
		if( !req.params.id ) {
			return res.badRequest(
				new ErrorService({
					code: 'USER_UPDATE',
					message: 'You must specify an ID',
					data: req.params
				})
			);
		}
		User.update( { id: req.params.id }, { confirmedEmail: true } )
		.exec( function( err, users ) {
			if( err ) {
				return res.serverError(
					new ErrorService({
						code: 'USER_UPDATE',
						message: 'Error updating user',
						data: err
					})
				);
			}
			if( users.length == 0 ) {
				return res.notFound(
					new ErrorService({
						code: 'USER_UPDATE',
						message: 'User not found',
						data: err
					})
				);
			}
			res.json( users[ 0 ] );
		});
	},
	// Send a reset password link to user
	resetRequest: function( req, res ) {
		if( !req.body || !req.body.nickname ) {
			return res.badRequest(
				new ErrorService({
					code: 'RESET_PASSWORD_REQUEST',
					message: 'You must specify a nickname',
					data: req.body
				})
			);
		}

		User.findOne(
			{ nickname: req.body.nickname },
			function( err, user ) {
				if( err ) {
					return res.serverError(
						new ErrorService({
							code: 'RESET_PASSWORD_REQUEST',
							message: 'Error requesting password reset',
							data: err
						})
					);
				}
				if( !user ) {
					return res.notFound(
						new ErrorService({
							code: 'USER_NOT_FOUND',
							message: 'User not found',
							data: err
						})
					);
				}
				ResetRequest.create({
					userId: user.id
				}).exec( function( err, request ) {
					if( err ) {
						return res.serverError(
							new ErrorService({
								code: 'RESET_PASSWORD_REQUEST',
								message: 'Error requesting password reset',
								data: err
							})
						);
					}
					if( process.env.MANDRILL_API_KEY ) {
						EmailService.sendReset( user, request, function( err, data ) {
							if( err ) {
								sails.log( 'error', err, data );
							}
						})
					}
					return res.ok({
						code: '',
						message: 'Email sent',
						data: {
							requestId: request.id,
							nickname: user.nickname
						}
					});
				});
			}
		);

	},
	// Update user password to a new one without need to authenticate.
	reset: function( req, res ) {
		if( !req.body || !req.body.token || !req.body.password ) {
			return res.badRequest(
				new ErrorService({
					code: 'RESET_PASSWORD',
					message: 'Could not reset password',
					data: req.body
				})
			);
		}
		ResetRequest.findOne(
			{ token: req.body.token, active: true },
			function( err, request ) {
				if( err || !request ) {
					return res.serverError(
						new ErrorService({
							code: 'RESET_REQUEST_NOT_FOUND',
							message: 'Invalid reset token',
							data: req.body
						})
					);
				}
				bcrypt.hash(
					req.body.password, 10,
					function() { /*progress*/ },
					function passwordEncrypted( err, encryptedPassword ) {
						if( err ) {
							return res.serverError(
								new ErrorService({
									code: 'ENCRYPT_PASSWORD',
									message: 'Could not encrypt password',
									data: err
								})
							);
						}
						User.update(
							{ id: request.userId },
							{ password: encryptedPassword}
						)
						.exec( function( err, user ) {
							if( err || !user ) {
								return res.serverError(
									new ErrorService({
										code: 'USER_UPDATE',
										message: 'Error updating user',
										data: err
									})
								);
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
