var mandrill = require('node-mandrill/mandrill')( process.env.MANDRILL_API_KEY || '' );

var defaultMessage = {
	to: [{email: 'hello@quirkbot.com', name: 'Quirkbot'}],
	from_email: 'hello@quirkbot.com',
	subject: "Hey, what's up?",
	text: "Hello, I sent this message using the Quirkbot API."
}

var send = function( message, cb ) {
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

	message.subject = "Quirkbot CODE verification";
	message.text = "Hey "+user.nickname+"! Welcome to Quirkbot CODE! Please verify your account by entering the link: " + process.env.APP_CONFIRMATION_URL + user.id;
	message.html = "<h1>Hey "+user.nickname+", welcome to Quirkbot CODE!</h1><p>Please verify your account by entering the link: " + process.env.APP_CONFIRMATION_URL + user.id + "</p>";

	send( message, cb );
}

var sendReset = function( user, request, cb ) {
	var message = defaultMessage;
	message.to = [{
		email: user.email,
		type: "to"
	}];
	message.text = "Access " + process.env.APP_RESET_URL + request.token + " to reset your password. If you did not request your password, ignore this email.";
	message.html = "<h1>Hey!</h1><p>Access " + process.env.APP_RESET_URL + request.token + " to reset your password. If you did not request your password, ignore this email.</p>";

	send( message, cb );
}

module.exports = {
	sendConfirmation: sendConfirmation,
	sendReset: sendReset
}
