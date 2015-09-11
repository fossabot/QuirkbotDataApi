/**
* User.js
*
* @description :: General user
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require( 'bcrypt' );
var uniqueEmail = false;
var uniqueNickname = false;

module.exports = {
	/**
	* Custom validation types
	*/
	types: {
		uniqueEmail: function( value ) {
			return uniqueEmail;
		},
		uniqueNickname: function( value ) {
			return uniqueNickname;
		}
	},
	
	attributes: {
		email: {
			type: 'email',
			unique: true,
			uniqueEmail: true,
			required: true
		},
		password: {
			type: 'string',
			required: true
		},
		birthdate: {
			type: 'date',
			required: true
		},
		country: {
			type: 'string',
			enum: [ 'se', 'cn', 'br', 'us', 'uk' ],
			required: true
		},
		gender: {
			type: 'string',
			enum: [ 'm', 'f', 'noneof' ]
		},
		nickname: {
			type: 'string',
			size: 45,
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
		},
		toJSON: function() {
			var obj = this.toObject();
			// delete obj.confirmedEmail;
			delete obj.password;
			return obj;
		}
	},
	beforeCreate: function( value, next ) {
		if( !value.password ) {
			return next( { err: [ 'Password not found' ] } );
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
