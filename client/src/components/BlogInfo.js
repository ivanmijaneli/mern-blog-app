import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { likeBlogAction, deleteBlogAction, addCommentAction } from '../actions/blogActions'
import { useRouteMatch } from "react-router-dom";

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers'
import { commentSchema } from '../helpers/yupSchemas'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import { FaThumbsUp } from 'react-icons/fa'

import DeleteWindow from './DeleteWindow'

const BlogInfo = () => {
    const blogs = useSelector(state => state.blogs)
    const user = useSelector(state => state.login)

    // form
    const { register, handleSubmit, errors } = useForm({
        resolver: yupResolver(commentSchema)
    });

    // modal controls
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(!show);

    // get id from route params
    const matchBlog = useRouteMatch('/blogs/:id')
    const blog = blogs.items && matchBlog ? blogs.items.find(blog => blog.id === matchBlog.params.id) : false

    // enable dispatch
    const dispatch = useDispatch()

    // like, comment, delete
    const handleLike = () => {
        dispatch(likeBlogAction(blog.id, { userId: user.id }))
    }

    const addComment = async (data, event) => {
        // await allows to close the form after the blog is posted successfuly
        await dispatch(addCommentAction(blog.id, data))
        event.target.reset()
    }
    
    const handleDelete = () => {
        dispatch(deleteBlogAction(blog.id))
        handleShow()
    }

    const deleteButton = () => {
        return blog && user.id === blog.user.id
            ? <Button onClick={handleShow} variant='outline-danger' disabled={blogs.deleting} className='mr-2'>
                {(blogs.deleting) && <Spinner as='span' animation='border' size='sm' className='mr-1' />}
                delete
              </Button>
            : false
    }

    return( 
        <div>
            <DeleteWindow show={show} handleShow={handleShow} handleDelete={handleDelete} />         
            <h1 className='my-4'>Blog Info</h1>
            {blogs.loading && <em>Loading blog info...</em>}
            {blogs.error && <em>{blogs.error}</em>}
            {
                blog &&
                <>
                    <Card variant='flush' className='mb-2'>
                        <Card.Header className='border-bottom-0'>
                            {blog.title}
                            <span className='float-right'>
                                <FaThumbsUp style={{ verticalAlign: 'baseline' }} className='mr-2' />
                                {blog.likes}
                            </span> 
                        </Card.Header>
                        <ListGroup variant='flush'>
                            <ListGroup.Item><a href={blog.url} style={{ textDecoration: 'none' }}>{blog.url}</a></ListGroup.Item>
                            <ListGroup.Item>by {blog.author}</ListGroup.Item>
                        </ListGroup>
                    </Card>
                    <div className='d-flex flex-row-reverse'>
                        <Button onClick={handleLike} disabled={blogs.liking}>{blog.likedBy.find(id => id === user.id) ? 'unlike' : 'like'}</Button>  
                        {deleteButton()}
                    </div>
                    <Form onSubmit={handleSubmit(addComment)} className='mt-2' id='comment-form'>
                            <Form.Label>Comment:</Form.Label>
                            <Form.Control
                                as='textarea'
                                className={errors.comment && 'is-invalid'}
                                name='comment'
                                ref={register}
                                style={{ resize: 'none' }}
                                id='comment'
                            />
                            <Form.Control.Feedback type='invalid'>{errors.comment?.message}</Form.Control.Feedback>
                            <div className='d-flex flex-row-reverse'>
                                <Button type='submit' className='mt-2' disabled={blogs.commenting}>
                                    {(blogs.commenting) && <Spinner as='span' animation='border' size='sm' className='mr-1' />}
                                    post
                                </Button>
                            </div>     
                    </Form>
                    <h2>Comments</h2>
                    <ListGroup className='text-break mb-4'>
                        {blog.comments.map(comment =>
                            <ListGroup.Item key={blog.id + Math.random()}>{comment}</ListGroup.Item>
                        )}
                    </ListGroup>
                </>
            }
        </div>
    )
}

export default BlogInfo