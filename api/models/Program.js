/**
* Program.js
*
* @description :: Quirkbot program
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		modifiedAt: {
			type: 'date'
		},
		author: {
			model: 'user',
			required: true
		},
		name: {
			type: 'string',
			defaultsTo: 'Undefined'
		},
		tree: {
			type: 'array',
			defaultsTo: []
		},
		apiVersion: {
			type: 'string',
			defaultsTo: '0'
		}
	}
};

