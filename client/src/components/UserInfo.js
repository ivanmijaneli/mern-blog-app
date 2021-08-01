import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useRouteMatch } from 'react-router-dom'

import ListGroup from 'react-bootstrap/ListGroup'
import Card from 'react-bootstrap/Card'

const UserInfo = () => {
	const users = useSelector(state => state.users)
	// we use blogs instead of user.blogs so blog count updates when we add a new blog
	const blogs = useSelector(state => state.blogs)

	// get id from route params
	const matchUser = useRouteMatch('/users/:id')
	const user = users.items && matchUser ? users.items.find(user => user.id === matchUser.params.id) : false

	return(
		<div>
			<h1 className='my-4'>User Info</h1>
			{users.loading && <em>Loading user info...</em>}
			{users.error && <em>{users.error}</em>}
			{user && blogs.items &&
				<>
					<Card>
						<Card.Header>{user.username}</Card.Header>
						<Card.Body>{user.firstName + ' ' + user.lastName}</Card.Body>
					</Card>
					<h2 className='my-4'>Blogs added</h2>
					<ListGroup className='mb-4'>
						{blogs.items.filter(blog => blog.user.id === user.id).map(blog =>
							<ListGroup.Item key={blog.id}>
								<Link to={`/blogs/${blog.id}`} style={{ textDecoration: 'none' }}>
									{blog.title}
								</Link>
							</ListGroup.Item>
						)}
					</ListGroup>
				</>
			}
		</div>
	)
}

export default UserInfo