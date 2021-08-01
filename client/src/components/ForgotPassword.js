import React from 'react'
import { useDispatch } from 'react-redux'
import { forgotPasswordAction } from '../actions/userActions'
import { Link } from 'react-router-dom'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers'
import { forgotPasswordSchema } from '../helpers/yupSchemas'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import Alert from './Alert'

const ForgotPassword = () => {

    // form
    const { register, handleSubmit, errors, formState } = useForm({
        mode: 'onChange',
        resolver: yupResolver(forgotPasswordSchema)
    })

    const dispatch = useDispatch()

    const handleSendEmail = (data) => {
        dispatch(forgotPasswordAction(data))
    }

    return (
        <div className="col-sm-8 col-md-6 col-lg-4 mx-auto">
            <h1 className='text-center my-4'>Blog App</h1>
            <Alert />
            <h2 className='my-4'>Reset Password</h2>
            <Form onSubmit={handleSubmit(handleSendEmail)} id='forgot-password-form'>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        className={errors.email && 'is-invalid'}
                        name='email'
                        ref={register}
                        id='email'
                    />
                    <Form.Control.Feedback type='invalid'>{errors.email?.message}</Form.Control.Feedback>
                </Form.Group>
                <Button type='submit' className='mr-2' disabled={!formState.isValid}>
                    Send Reset Email
                </Button>
                <Link to='/login'><Button variant='outline-primary'>Login</Button></Link>
            </Form>
        </div>
    )
}

export default ForgotPassword