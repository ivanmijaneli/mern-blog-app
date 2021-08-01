import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import ListGroup from 'react-bootstrap/ListGroup'
import BlogForm from './BlogForm'

const BlogList = () => {
	const blogs = useSelector(state => state.blogs)

	return(
		<div>
			<h1 className='my-4'>Blogs</h1>
			<BlogForm />
			{blogs.loading && <em>Loading blogs...</em>}
			{blogs.error && <em>{blogs.error}</em>}
			<ListGroup className='text-break mb-4'>
				{blogs.items && blogs.items.map(blog =>
					<ListGroup.Item key={blog.id}>
						<Link to={`blogs/${blog.id}`} style={{ textDecoration: 'none' }}>
							{blog.title}
						</Link>
					</ListGroup.Item>
				)}
			</ListGroup>
		</div>
	)
}

export default BlogList