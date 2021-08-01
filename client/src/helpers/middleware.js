import { refreshTokenAction } from '../actions/userActions'

export const jwt = ({ dispatch, getState }) => {

	return (next) => (action) => {

		// we're only interested in async functions
		if (typeof action === 'function') {

			// if user is logged in and has a token
			if (getState().login && getState().login.token) {

				// decode and get time
				const expiresAt = JSON.parse(atob(getState().login.token.split('.')[1])).exp

				// if it's not refreshing, we refresh
				// else we wait for refreshing to finish
				if (expiresAt * 1000 - Date.now() < 5000) {
					if (!getState().login.refreshing) {
						return refreshTokenAction(dispatch, action)
					} else {
						return getState().login.promise.then(() => next(action))
					}
				}
			}
		}
		return next(action)
	}
}