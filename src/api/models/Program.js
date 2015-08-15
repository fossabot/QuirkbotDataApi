/**
* Program.js
*
* @description :: Quirkbot program
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
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
		version: {
			type: 'integer',
			required: true,
			defaultsTo: 0
		},
		apiVersion: {
			type: 'string',
			defaultsTo: '0'
		}
	}
};

