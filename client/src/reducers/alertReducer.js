const alertReducer = (state = '', action) => {
	switch(action.type) {
	case 'ADD_ALERT':
		return action.data
	case 'CLEAR_ALERT':
		return ''
	default:
		return state
	}
}

export default alertReducer