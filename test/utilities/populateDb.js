var Barrels = require('barrels');
var barrels = new Barrels();
var fixtures = barrels.data;

module.exports = function( cb ) {
	barrels.populate( function( err ) {
		if( err ) return done( err );
		if( cb ) cb();
	});
}
