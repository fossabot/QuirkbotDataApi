# 0.2.2

- Create "lite" environment
- Adding DB_URL for "lite" connection
- Changing the package name for "quirkbot-api"
- Improve readme
- Changed bcrypt module to bcrypt-nodejs
- NPM shrink wrap

# 0.2.1

- Rearranged files to account for the new EB configuration (without dockerfile)

# 0.1.19

- Added back "id" field to user requests.

# 0.1.17

- Behaviour test for API endpoints as seen in `/src/test/SUMMARY.md`
- OAuth in debug mode only in development environment
- Removed `isConfirmed` policy to create programs
- Cron to clean expired access tokens as seen in `/src/config/cron.js`

# 0.1.16

Consider that as the initial version for Quirkbot's API. It contain the following features:

## Available endpoints

- RESTful User
- RESTful Program
- AuthController endpoints:
	- token
	- resendConfirmation
	- confirm
	- resetRequest
	- reset
- Other endpoints are described at `/config/routes.js`:

## Permissions (Policies)

- `/config/policies.js`
- `/api/policies`

## Authentication

Explanation and examples can be found on README.md.

- OAuth Authentication
- Access token
- Refresh token
- Password reset
- Account verification

## Provided error codes:

- EMAIL_NOT_FOUND
- USER_NOT_FOUND
- USER_UPDATE
- RESET_PASSWORD_REQUEST
- RESET_PASSWORD
- RESET_REQUEST_NOT_FOUND
- ENCRYPT_PASSWORD
- PROGRAM_NOT_FOUND
- PROGRAM_UPDATE
- PROGRAM_CREATE
- NOT_AUTHENTICATED
- NOT_AUTHOR
- NOT_CONFIRMED
- NOT_YOURSELF
- AUTH_GRANT
