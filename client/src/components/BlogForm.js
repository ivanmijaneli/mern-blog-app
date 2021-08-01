import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addBlogAction } from '../actions/blogActions'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers'
import { blogSchema } from '../helpers/yupSchemas'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

const BlogForm = () => {
    // form
    const { register, handleSubmit, errors, formState } = useForm({
        mode: 'onChange',
        resolver: yupResolver(blogSchema)
    });

    // password visibility
    const [visible, setVisible] = useState(false)

    // post blog loading
    const posting = useSelector(state => state.blogs.posting)
    // refreshing reset token
    const refreshing = useSelector(state => state.login.refreshing)

    const dispatch = useDispatch()

    const handlePost = (data) => {
        dispatch(addBlogAction(data))
    }

    // close form after blog is posted
    useEffect(() => {
        if (!posting && !refreshing) {
            setVisible(false)
        }
    }, [posting, refreshing])

    if (!visible) {
        return (
            <div className='mb-4'>
                <Button onClick={() => setVisible(!visible)}>Add Blog</Button>
            </div>
        )
    }

    return(
        <Form onSubmit={handleSubmit(handlePost)} autoComplete='off' className='mb-4' id='add-blog-form'>
            <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                    className={errors.title && 'is-invalid'}
                    name='title'
                    ref={register}
                    id='title'
                />
                <Form.Control.Feedback type='invalid'>{errors.title?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>Author</Form.Label>
                <Form.Control
                    className={errors.author && 'is-invalid'}
                    name='author'
                    ref={register}
                    id='author'
                />
                <Form.Control.Feedback type='invalid'>{errors.author?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>URL</Form.Label>
                <Form.Control
                    className={errors.url && 'is-invalid'}
                    name='url'
                    ref={register}
                    id='url'
                />
                <Form.Control.Feedback type='invalid'>{errors.url?.message}</Form.Control.Feedback>
            </Form.Group>
            <div className='d-flex flex-row-reverse'>
                <Button type='submit' disabled={!(formState.isValid) || posting}>
                    {(posting) && <Spinner as='span' animation='border' size='sm' className='mr-1' />}
                    post
                </Button>
                <Button variant='outline-danger' className='mr-2' onClick={() => setVisible(!visible)}>cancel</Button>
            </div>
        </Form>
    )
}

export default BlogForm