import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { verifyEmailAction } from '../actions/userActions'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

const VerifyEmail = ({ history, location }) => {
	const verification = useSelector(state => state.login)
	const dispatch = useDispatch()

	useEffect(() => {
		const { token } = queryString.parse(location.search)

		// remove token from url to prevent http referer leakage
		history.replace(location.pathname)

		dispatch(verifyEmailAction({ token }))
	}, [dispatch])


	return (
		<div className="col-sm-8 col-md-6 col-lg-4 my-4 mx-auto text-center">
			<Card>
				<Card.Header>Email verification</Card.Header>
				<Card.Body>
					{verification.verifying && <Spinner animation='grow' />}
					{verification.error && <em>{`Oops, ${verification.error}.`}</em>}
					{verification.verified && <p>Your email has been verified!</p>}
					<Link to='/login'><Button className='d-block w-100 mt-4'>Back to Login</Button></Link>
				</Card.Body>
			</Card>
		</div>
	)
}

export default VerifyEmail