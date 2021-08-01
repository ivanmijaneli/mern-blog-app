import React, { useEffect } from 'react'
import { Switch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearAlertAction } from './actions/alertActions'
import { history } from './helpers/history'

import Homepage from './components/Homepage'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import PublicRoute from './components/PublicRoute'
import PrivateRoute from './components/PrivateRoute'
import VerifyEmail from './components/VerifyEmail'
import ResetPassword from './components/ResetPassword'
import ForgotPassword from './components/ForgotPassword'

const App = () => {
	const dispatch = useDispatch()

	useEffect(() => {
		// clear alert on location change
		history.listen(() => {
			dispatch(clearAlertAction())
		})
	}, [dispatch])

	return (
		<div>
			<Switch>
				<PublicRoute path='/login' component={LoginForm} />
				<PublicRoute path='/register' component={RegisterForm} />
				<PublicRoute path='/verify-email' component={VerifyEmail} />
				<PublicRoute path='/forgot-password' component={ForgotPassword} />
				<PublicRoute path='/reset-password' component={ResetPassword} />
				<PrivateRoute path='/' component={Homepage} />
			</Switch>
		</div>
	)
}

export default App