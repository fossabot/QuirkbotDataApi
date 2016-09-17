if(process.env.MANDRILL_API_KEY){
	var mandrill = require('node-mandrill/mandrill')( process.env.MANDRILL_API_KEY || '' );
}


var defaultMessage = {
	to: [{email: 'no-reply@quirkbot.com', name: 'Quirkbot CODE'}],
	from_email: 'no-reply@quirkbot.com',
	from_name: 'Quirkbot CODE',
	subject: "Hello from Quirkbot CODE",
	text: "Hello, I sent this message using the Quirkbot API."
}

var send = function( message, cb ) {
	if(!mandril) {
		return cb('Mandrill not defined.')
	}
	mandrill(
		'/messages/send',
		{ message: message || defaultMessage },
		function( err, response ) {
				if( err ) { sails.log( 'error', err ) };
				cb( err, response );
		}
	);
}

var sendConfirmation = function( user, cb ) {
	var message = defaultMessage;
	message.to = [{
		email: user.email,
		type: "to"
	}];

	message.subject = "Welcome to Quirkbot CODE";
	message.text = "Hey "+user.nickname+"! Welcome to Quirkbot CODE! Please verify your account by entering the link: " + process.env.APP_CONFIRMATION_URL + user.id;
	message.html = "<h2>Hey "+user.nickname+", welcome to Quirkbot CODE!</h2><p>Please verify your account by entering the link: " + process.env.APP_CONFIRMATION_URL + user.id + "</p>";

	send( message, cb );
}

var sendReset = function( user, request, cb ) {
	var message = defaultMessage;
	message.to = [{
		email: user.email,
		type: "to"
	}];
	message.subject = "Password reset";
	message.text = "Access " + process.env.APP_RESET_URL + request.token + " to reset your password. If you did not request a password reset, please ignore this email.";
	message.html = "<h2>Do you want to reset your password?</h2>"+
		"<p>We got a request to reset the password for the user <b>"+user.nickname+"</b>.</p>" +
		"<p>To procceed with the reset, please access "+process.env.APP_RESET_URL + request.token+" and follow the instructions.</p>"+
		"<p>If you did not request a password reset, please ignore this email.</p>";

	send( message, cb );
}

module.exports = {
	sendConfirmation: sendConfirmation,
	sendReset: sendReset
}
