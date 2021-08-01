import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const PublicRoute = ({ component: Component, ...rest }) => {
	return (
		<Route {...rest} render={props => {
			return (
				localStorage.getItem('user')
					? <Redirect to={{ pathname: '/', state: { from: props.location } }} />
					: <Component {...props} />
			)
		}} />
	)
}

export default PublicRoute