/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  app_name: [ process.env.NEW_RELIC_APP_NAME || 'local' ],
  license_key: process.env.NEW_RELIC_KEY,
  logging: {
    level: process.env.NEW_RELIC_LEVEL || 'trace'
  }
}
