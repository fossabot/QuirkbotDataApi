/**
 * Built-in Log Configuration
 * (sails.config.log)
 *
 * Configure the log level for your app, as well as the transport
 * (Underneath the covers, Sails uses Winston for logging, which
 * allows for some pretty neat custom transports/adapters for log messages)
 *
 * For more information on the Sails logger, check out:
 * http://sailsjs.org/#!/documentation/concepts/Logging
 */

var Winston = require('winston');
var Loggly = require('winston-loggly');

module.exports.log = {
	prefixes: {},
	level: 'verbose',
	custom: new Winston.Logger({
		transports: [

			new Winston.transports.Loggly({
				level: 'debug',
				subdomain: process.env.LOGGLY_SUBDOMAIN,
				inputToken: process.env.LOGGLY_TOKEN
			}),

      new Winston.transports.Console({
        level: 'silly'
      })

		]
	})

};
