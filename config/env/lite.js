/**
 * Quirkbot Lite environment settings
 *
 */

module.exports = {

  models: {
    connection: 'lite'
  },
  port: process.env.API_PORT || process.env.PORT

};
