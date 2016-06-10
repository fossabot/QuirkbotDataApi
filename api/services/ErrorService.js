var Error = function( opts ) {
	opts = opts || {};
	this.message = opts.message || 'Unexpected error';
	this.code = opts.code || 'UNEXPECTED_ERROR';
	this.data = opts.data || {};
};

Error.prototype.toString = function() {
	return JSON.stringify({
		message: this.message,
		code: this.code,
		data: this.data
	});
}

module.exports = Error;
