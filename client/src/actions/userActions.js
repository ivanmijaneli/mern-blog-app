import userService from '../services/users'
import { addAlertAction } from '../actions/alertActions'
import { history } from '../helpers/history'

export const getUsersAction = () => {
	return async (dispatch) => {
		dispatch(request())
		try {
			const users = await userService.getUsers()
			dispatch(success(users))
		} catch (error) {
			dispatch(failure(error.toString()))
		}
	}

	function request() { return { type: 'GET_USERS_REQUEST' } }
	function success(users) { return { type: 'GET_USERS_SUCCESS', users } }
	function failure() { return { type: 'GET_USERS_FAILURE' } }
}

export const logInAction = (credentials) => {
	return async (dispatch) => {
		dispatch(request())

		try {
			const user = await userService.login(credentials)
			window.localStorage.setItem('user', JSON.stringify(user))
			// set auth header here, so we don't call the function every time we make a request?
			dispatch(success(user))
			history.push('/')
		} catch (error) {
			dispatch(failure())
			dispatch(addAlertAction(error.response.data.error, 'danger'))
		}
	}

	function request() { return { type: 'LOGIN_REQUEST' } }
	function success(user) { return { type: 'LOGIN_SUCCESS', user } }
	function failure() { return { type: 'LOGIN_FAILURE' } }
}

export const logOutAction = () => {
	return (dispatch) => {
		userService.revoke()
		window.localStorage.clear()
		dispatch({ type: 'LOGOUT' })
		history.push('/')
	}
}

export const refreshTokenAction = async (dispatch, postponedAction) => {

	// save the promise in state (see jwt middleware)
	const refreshTokenPromise = async () => {
		try {
			const user = await userService.refresh()
			window.localStorage.setItem('user', JSON.stringify(user))
			// set auth header here, so we don't call the function every time we make a request?
			dispatch(success(user))
			dispatch(postponedAction)
		} catch (error) {
			dispatch(failure())
		}
	}

	dispatch(request(refreshTokenPromise()))

	function request(promise) { return { type: 'REFRESH_TOKEN_REQUEST', promise } }
	function success(user) { return { type: 'REFRESH_TOKEN_SUCCESS', user } }
	function failure() { return { type: 'REFRESH_TOKEN_FAILURE' } }
}

export const registerAction = (user) => {
	return async (dispatch) => {
		dispatch(request())

		try {
			const response = await userService.register(user)
			dispatch(success())
			history.push('/login')
			dispatch(addAlertAction(response.message, 'success'))
		} catch (error) {
			dispatch(failure())
			dispatch(addAlertAction(error.response.data.error, 'danger'))
		}
	}

	function request() { return { type: 'REGISTER_REQUEST' } }
	function success() { return { type: 'REGISTER_SUCCESS' } }
	function failure() { return { type: 'REGISTER_FAILURE' } }
}

export const verifyEmailAction = (token) => {
	return async (dispatch) => {
		dispatch(request())

		try {
			await userService.verify(token)
			dispatch(success())
		} catch (error) {
			dispatch(failure(error.response.data.error))
		}
	}

	function request() { return { type: 'VERIFY_EMAIL_REQUEST' } }
	function success() { return { type: 'VERIFY_EMAIL_SUCCESS' } }
	function failure(error) { return { type: 'VERIFY_EMAIL_FAILURE', error } }
}

export const forgotPasswordAction = (email) => {
	return (dispatch) => {
		try {
			// prevent enumeration
			// dispatch alert first, since if we await for it, time is different when emails exists and when it doesn't
			// no need to keep anything in state
			dispatch(addAlertAction('check email for reset instructions', 'success'))
			userService.forgot(email)
		} catch (error) {
			dispatch(addAlertAction('Oops, something went wrong!', 'danger'))
		}
	}
}

export const validateResetTokenAction = (token) => {
	return async (dispatch) => {
		dispatch(request())

		try {
			await userService.validate(token)
			dispatch(success())
		} catch (error) {
			dispatch(failure(error.response.data.error))
		}
	}

	function request() { return { type: 'VALIDATE_RESET_TOKEN_REQUEST' } }
	function success() { return { type: 'VALIDATE_RESET_TOKEN_SUCCESS' } }
	function failure(error) { return { type: 'VALIDATE_RESET_TOKEN_FAILURE', error } }
}

export const resetPasswordAction = (password, resetToken) => {
	return async (dispatch) => {
		dispatch(request())

		try {
			const response = await userService.reset(password, resetToken)
			dispatch(success())
			dispatch(addAlertAction(response.message, 'success'))
		} catch (error) {
			dispatch(failure())
			dispatch(addAlertAction(error.response.data.error, 'danger'))
		}
	}

	function request() { return { type: 'RESET_PASSWORD_REQUEST' } }
	function success() { return { type: 'RESET_PASSWORD_SUCCESS' } }
	function failure() { return { type: 'RESET_PASSWORD_FAILURE' } }
}