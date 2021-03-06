/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */

module.exports.policies = {

  '*': false,
  '/': true,
  UserController: {
    'find': true,
    'findOne': true,
    'create': true,
    'update': [ 'isAuthenticated', 'isYou' ],
    'destroy': [ 'isAuthenticated', 'isYou' ],
    'terms': true,
    'me': 'isAuthenticated',
    'data': 'isAuthenticated'
  },

  ProgramController: {
    'find': true,
    'findOne': true,
    'create': [ 'isAuthenticated', 'overrideAuthor' ],
    'update': [
        'isAuthenticated', 'isAuthor',
        'checkProgramVersion', 'overrideAuthor'
    ],
    'destroy': [ 'isAuthenticated', 'isAuthor' ]
  },

  AuthController: {
    'confirm': true,
    'resendConfirmation': [ 'isAuthenticated', 'isYou' ],
    'token': true,
    'resetRequest': true,
    'reset': true
  }

};
