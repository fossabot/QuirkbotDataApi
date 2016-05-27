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
