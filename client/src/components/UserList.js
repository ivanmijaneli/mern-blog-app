import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import Table from 'react-bootstrap/Table'

const UserList = () => {
	const users = useSelector(state => state.users)
	// we use blogs instead of user.blogs so blog count updates when we add a new blog
	const blogs = useSelector(state => state.blogs)

	return(
		<div>
			<h1 className='my-4'>Users</h1>
			{users.loading && <em>Loading users...</em>}
			{users.error && <em>{users.error}</em>}
			{users.items && blogs.items &&
			<Table bordered className='mb-4'>
				<tbody>
					<tr>
						<td><strong>name</strong></td>
						<td className='w-25'><strong>blogs created</strong></td>
					</tr>
					{users.items.map(user =>
						<tr key={user.id}>
							<td>
								<Link to={`users/${user.id}`} style={{ textDecoration: 'none' }} id='username-link'>
									{user.username}
								</Link>
							</td>
							<td>{blogs.items.filter(blog => blog.user.id === user.id).length}</td>
						</tr>
					)}
				</tbody>
			</Table>}
		</div>
	)
}

export default UserList