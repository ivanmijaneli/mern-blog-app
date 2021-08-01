import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getBlogsAction } from '../actions/blogActions'
import { getUsersAction } from '../actions/userActions'
import { Route, Switch } from 'react-router-dom'

import Alert from './Alert'
import BlogInfo from './BlogInfo'
import BlogList from './BlogList'
import Navigation from './Navbar'
import UserList from './UserList'
import UserInfo from './UserInfo'

const Homepage = () => {
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getBlogsAction())
		dispatch(getUsersAction())
	}, [dispatch])

	return (
		<div>
			<Navigation />
			<div className="col-sm-8 col-md-6 col-lg-4 mx-auto mt-4">
				<Alert />
				<Switch>
					<Route exact path='/' component={BlogList} />
					<Route exact path='/blogs/:id' component={BlogInfo} />
					<Route exact path='/users/:id' component={UserInfo} />
					<Route exact path='/users' component={UserList} />
				</Switch>
			</div>
		</div>
	)
}

export default Homepage