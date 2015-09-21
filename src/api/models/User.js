/**
* User.js
*
* @description :: General user
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require( 'bcrypt' );
var uniqueNickname = false;

module.exports = {
	/**
	* Custom validation types
	*/
	types: {
		uniqueNickname: function( value ) {
			return uniqueNickname;
		}
	},

	attributes: {
		email: {
			type: 'email',
			required: true
		},
		password: {
			type: 'string',
			required: true,
			protected: true
		},
		birthdate: {
			type: 'date',
			required: true
		},
		country: {
			type: 'string',
			enum: [ 'se', 'cn', 'br', 'us', 'uk' ]
		},
		gender: {
			type: 'string',
			enum: [ 'm', 'f', 'noneof' ]
		},
		nickname: {
			type: 'alphanumericdashed',
			size: 30,
			uniqueNickname: true,
			required: true
		},
		region: {
			type: 'string',
			enum: [ 'china', 'world' ],
			defaultsTo: 'world'
		},
		confirmedEmail: {
			type: 'boolean',
			defaultsTo: false
		}
	},
	beforeCreate: function( value, next ) {
		if( !value.password ) {
			return next( { err: [ 'Password not found' ] } );
		}
		if( value.confirmedEmail ) {
			delete value.confirmedEmail;
		}
		bcrypt.hash(
			value.password,
			10,
			function passwordEncrypted( err, encryptedPassword ) {
				if( err ) return next( err );
				value.password = encryptedPassword;
				next();
			}
		);
	},
	beforeValidate: function( values, cb ) {
		User.findOne( { email: values.email } ).exec( function ( err, record ) {
			uniqueEmail = !err && !record;
			User.findOne( { nickname: values.nickname } ).exec( function( err, record2 ) {
				uniqueNickname = !err && !record2;
				cb();
			});
		});
	},
	afterCreate: function( user, next ) {
		EmailService.sendConfirmation( user, function( err, response ) {});
		next();
	}
};
