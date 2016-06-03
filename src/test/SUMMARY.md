# List of tests:

## Health check
- should return 200 on /
- should return 404 on /client
- should return 404 on /accessToken
- should return 404 on /refreshToken
- should return 404 on /resetRequest

## UserController
- should return 200 on /user
- should get a json array on /user
- should see only "nickname" and "confirmedEmail" on listed users at /user
- should get a json array on /user/?nickname=validnickname
- should get 403 accessing /user/me without valid access token
- should get 200 accessing /user/me with a valid access token
- should be able to get your user object accessing /me with an access token
- should be able to get "id", "email", "birthdate", "country" and "gender" accessing /me with correct access token
- should get 400 creating without "email", "password", "birthdate" or "nickname"
- should get 201 by posting to /user if "email", "password", "birthdate" and "nickname" are being sent
- should get 403 trying to update user without access token
- should get 403 trying to delete user without access token
- should get 200 trying to update your own user
- should get 200 trying to delete your own user
- should get 403 trying to update another user
- should get 403 trying to delete another user
- should get 403 trying to use an access token of a deleted user
- should get 500 when creating an user with an existing nickname

## AuthController
- should be able to get an access token posting to /auth/token with "username", "password" and "grant_type" with "Authorization" header with the base64 of "client_id:client_secret"
- should get 403 posting to /auth/token with incorrect fields
- should get 403 using an expired access token
- should get a new access token using a refresh token
- should expire refresh token after is expiration date
- should set confirmedEmail to true by accessing /auth/confirm/?id=id
- should get 403 trying to confirm an email without an access token
- should get 403 trying to confirm an email with an user that is not you
- should generate a reset password request by accessing /auth/resetRequest passing your nickname
- should deactivate the reset password request by accessing /auth/reset passing a token and password
- should modify user's password by accessing /auth/reset passing a token and password

## ProgramController
- should get 403 trying to update a program without access token
- should get 403 trying to delete a program without access token
- should get 403 trying to create a program without access token
- should create a program posting to /program and passing an access token
- should get your user as owner of a created program
- should get 200 trying to update your own program
- should get 200 trying to delete your own program
- should get 403 trying to update another program user
- should get 403 trying to delete another program user
- should get a list of all programs on GET /program
- should get a list of programs from a specific user on /program?author=id
- should get all programs on GET /program
