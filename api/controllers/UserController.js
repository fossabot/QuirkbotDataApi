/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    data:function( req, res ) {
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
                    })
                )
            }
            Program.find( { author: req.user.id } )
            .limit(500)
            .exec( function( err, programs ) {
                if( err ) {
                    return res.forbidden(
                        new ErrorService({
                            code: 'PROGRAMS_NOT_FOUND',
                            message: 'Error finding program',
                            data: err
                        })
                    )
                }
                res.ok( {
                    user : {
                        confirmedEmail: user.confirmedEmail,
                        createdAt: user.createdAt,
                        id: user.id,
                        nickname: user.nickname,
                        updatedAt: user.updatedAt,
                        email: user.email,
                        birthdate: user.birthdate,
                        password: user.password
                    },
                    programs: programs
                } );
            })
        })
    },
    // Confirms that user agrees to new terms and conditions
	terms: function( req, res ) {
		if( !req.params.id ) {
			return res.badRequest(
				new ErrorService({
					code: 'USER_UPDATE',
					message: 'You must specify an ID',
					data: req.params
				})
			);
		}
		User.update( { id: req.params.id }, { confirmedTerms: true } )
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
						user.toJSON = function() {
							var obj = this.toObject();
							delete obj.password;
							return obj;
						}
            res.ok( user );
        })
    }
};
