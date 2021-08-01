const userReducer = (state = {}, action) => {
	switch (action.type) {
	case 'GET_USERS_REQUEST':
		return { loading: true }
	case 'GET_USERS_SUCCESS':
		return { items: action.users }
	case 'GET_USERS_FAILURE':
		return { error: action.error }
	default:
		return state
	}
}

export default userReducer