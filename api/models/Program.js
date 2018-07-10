/**
* Program.js
*
* @description :: Quirkbot program
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		author: {
			model: 'user'
		},
		name: {
			type: 'string',
			defaultsTo: 'Undefined'
		},
		tree: {
			type: 'json',
			defaultsTo: []
		},
		version: {
			type: 'integer',
			required: true,
			defaultsTo: 0
		},
		original: {
			type: 'string'
		},
		apiVersion: {
			type: 'string',
			defaultsTo: '0'
		}
	}
};
