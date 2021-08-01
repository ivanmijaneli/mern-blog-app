let timeoutId

export const addAlertAction = (alert, variant) => {
	return (dispatch) => {
		dispatch({
			type: 'ADD_ALERT',
			data: { alert, variant }
		})
		clearTimeout(timeoutId)
		timeoutId = setTimeout(() => dispatch({
			type: 'CLEAR_ALERT'
		}), 5000)
	}
}

export const clearAlertAction = () => {
	return { type: 'CLEAR_ALERT' }
}