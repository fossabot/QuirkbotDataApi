/**
* User.js
*
* @description :: General user
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require( 'bcrypt' );

module.exports = {

	attributes: {
		email: {
			type: 'email',
			unique: true,
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
		programs: {
			collection: 'program',
			via: 'author'
		},
		toJSON: function() {
			var obj = this.toObject();
			delete obj.confirmedEmail;
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
	}
};

