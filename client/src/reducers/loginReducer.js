// set user as inital state if there is one
let user = JSON.parse(localStorage.getItem('user'))
const initialState = user ? user : {}

const userReducer = (state = initialState, action) => {
	switch(action.type) {
	case 'LOGIN_REQUEST':
		return { loggingIn: true }
	case 'LOGIN_SUCCESS':
		return action.user
	case 'LOGIN_FAILURE':
		return {}
	case 'LOGOUT':
		return {}
	case 'REFRESH_TOKEN_REQUEST':
		return { ...state, refreshing: true, promise: action.promise }
	case 'REFRESH_TOKEN_SUCCESS':
		return action.user
	case 'REFRESH_TOKEN_FAILURE':
		return {}
	case 'VERIFY_EMAIL_REQUEST':
		return { verifying: true }
	case 'VERIFY_EMAIL_SUCCESS':
		return { verified: true }
	case 'VERIFY_EMAIL_FAILURE':
		return { error: action.error }
	default:
		return state
	}
}

export default userReducer