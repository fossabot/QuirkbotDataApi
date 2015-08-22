var mandrill = require('mandrill-api/mandrill')
var mandrillClient = new mandrill.Mandrill( process.env.MANDRILL_API_KEY || '' );

var defaultMessage = {
	"html": "<p></p>",
	"text": "",
	"subject": "Oh, hey! What's up?",
	"from_email": "no-reply@quirkbot.com",
	"from_name": "Quirkbot",
	"to": [{
			"email": "murilopolese@gmail.com",
			"name": "Murilo Polese",
			"type": "to"
		}],
	"headers": {
		"Reply-To": "info@quirkbot.com"
	},
	"inline_css": true
};

var send = function( message, cb ) {
	mandrillClient.messages.send(
		{ 
			message: message || defaultMessage,
			async: true
		}, 
		function( response ) {
			if ( response.reject_reason ) {
				cb( response.reject_reason, response );
			} else {
				cb( null, response );
			}
		}
	);
}

var sendConfirmation = function( user, cb ) {
	var message = defaultMessage;
	message.to = [{
		"email": user.email,
		"type": "to"
	}];
	message.text = "Hey! Please confirm your account by entering the following link: http://api.quirkbot.com/confirm/" + user.id;
	message.html = "<h1>Hey!</h1><p>Please confirm your email at http://api.quirkbot.com/confirm/" + user.id + "</p>";

	send( message, cb );
}

module.exports = {
	sendConfirmation: sendConfirmation
}