const usersRouter = require('express').Router()
const userConroller = require('../controllers/userController')
const middleware = require('../utils/middleware')
const userController = require('../controllers/userController')

// get all users
usersRouter.get('/', middleware.verifyToken, userConroller.users_get)

// login user
usersRouter.post('/login', userConroller.user_login)

// refresh token
usersRouter.post('/refresh-token', userConroller.user_refresh)

// revoke token
usersRouter.post('/revoke-token', middleware.verifyToken, userConroller.user_revoke)

// verify user
usersRouter.post('/verify-email', userConroller.user_verify)

// forgot password
usersRouter.post('/forgot-password', userConroller.user_forgot)

// validate reset token
usersRouter.post('/validate-reset-token', userController.user_validate)

// reset password
usersRouter.post('/reset-password', userConroller.user_reset)

// register user
usersRouter.post('/', userConroller.user_register)

module.exports = usersRouter