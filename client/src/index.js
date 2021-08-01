import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import store from './store'
import { Router } from 'react-router-dom'
import { history } from './helpers/history'
import axios from 'axios'

// logout if 401
// use axios.create() in separate module - blogApi and userApi ?
axios.interceptors.response.use(response => {
	return response
}, error => {
	if (error.response.status === 401 || error.response.data.error === 'invalid token') {
		// no logoutAction since, with invalid token, we get error from controller
		// split revoke and logout (?)
		window.localStorage.clear()
		store.dispatch({ type: 'LOGOUT' })
		history.push('/')
	}
	throw error
})

ReactDOM.render(
	<Provider store={store}>
		<Router history={history}>
			<App />
		</Router>
	</Provider>,
	document.getElementById('root')
)