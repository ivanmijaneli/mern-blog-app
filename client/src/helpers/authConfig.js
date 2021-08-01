// auth header
const setConfig = () => {
	const user = JSON.parse(localStorage.getItem('user'))

	if (user && user.token) {
		return { headers: { Authorization: `Bearer ${user.token}` } }
	}

	return {}
}

export default setConfig