import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logOutAction } from '../actions/userActions'
import { Link } from 'react-router-dom'

import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

const Navigation = () => {
	const username = useSelector(state => state.login.username)

	const dispatch = useDispatch()

	const handleLogout = () => {
		dispatch(logOutAction())
	}

	return(
		<Navbar bg='light' expand='sm'>
			<Navbar.Toggle style={{ border: 'none', padding: '0' }} />
			<Navbar.Brand>
				<Link to='/' style={{ textDecoration: 'none', color: 'black' }}>
					Blog App
				</Link>
			</Navbar.Brand>
			<Navbar.Collapse>
				<Nav className='mr-auto'>
					<Link to='/' className='nav-link text-primary'>
						Blogs
					</Link>
					<Link to='/users' className='nav-link text-primary'>
						Users
					</Link>
				</Nav>
				<Nav>
					<Nav.Link disabled className='d-none d-sm-block'>
						{username && `Hola ${username}!`}
					</Nav.Link>
					<Nav.Link className='text-danger' onClick={handleLogout}>
						Logout
					</Nav.Link>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	)
}

export default Navigation