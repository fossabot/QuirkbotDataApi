/**
 * Test environment settings
 *
 */

module.exports = {

  models: {
    connection: 'test'
  },
  port: process.env.API_PORT || process.env.PORT

};
