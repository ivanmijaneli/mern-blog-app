const passwordReducer = (state = {}, action) => {
	switch(action.type) {
	case 'VALIDATE_RESET_TOKEN_REQUEST':
		return { ...state, validating: true }
	case 'VALIDATE_RESET_TOKEN_SUCCESS':
		return { ...state, validating: false, valid: true }
	case 'VALIDATE_RESET_TOKEN_FAILURE':
		return { ...state, validating: false, error: action.error }
	case 'RESET_PASSWORD_REQUEST':
		return { ...state, resetting: true }
	case 'RESET_PASSWORD_SUCCESS':
		return { ...state, resetting: false }
	case 'RESET_PASSWORD_FAILURE':
		return { ...state, resetting: false }
	default:
		return state
	}
}

export default passwordReducer