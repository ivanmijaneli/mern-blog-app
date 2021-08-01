import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { validateResetTokenAction, resetPasswordAction } from '../actions/userActions'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers'
import { resetPasswordSchema } from '../helpers/yupSchemas'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Spinner from 'react-bootstrap/Spinner'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

import Alert from './Alert'

const ResetPassword = ({ history, location }) => {
    const tokenValidation = useSelector(state => state.password)

    // form
    const { register, handleSubmit, errors, formState } = useForm({
        mode: 'onChange',
        resolver: yupResolver(resetPasswordSchema)
    })

    // password visibility
    const [passVisible, setPassVisible] = useState(false)

    // reset token
    const [resetToken, setResetToken] = useState('')

    const dispatch = useDispatch()

    useEffect(() => {
        const { token } = queryString.parse(location.search)
        setResetToken(token)

        // remove token from url to prevent http referer leakage
        history.replace(location.pathname)

        // if we already validated and hit back arrow, we don't wanna validate again
        if (!tokenValidation.valid && !tokenValidation.error) {
            dispatch(validateResetTokenAction({ token }))  
        }
    }, [dispatch])

    const handleResetPassword = ({ password }) => {
        dispatch(resetPasswordAction(password, resetToken))
    }

    return (
        <div className="col-sm-8 col-md-6 col-lg-4 mx-auto">
            <h1 className='text-center my-4'>Blog App</h1>
            <Alert />
            <h2 className='my-4'>Reset Password</h2>
            {tokenValidation.validating && <Spinner animation='border' />}
            {tokenValidation.error && <p>Oops, {tokenValidation.error}! <Link to='/forgot-password'>Try again</Link> or <Link to='/login'>back to login</Link>?</p>}
            {tokenValidation.valid && <Form onSubmit={handleSubmit(handleResetPassword)} id='reset-password-form'>
                <Form.Group>
                    <Form.Label>New Password</Form.Label>
                    <InputGroup>
                        <Form.Control
                            className={errors.password && 'is-invalid'}
                            name='password'
                            ref={register}
                            type={passVisible ? 'text' : 'password'}
                            id='password'
                        />
                        <InputGroup.Append>
                            <Button variant='outline-secondary' onClick={() => setPassVisible(!passVisible)} style={{ borderRadius: '0 4px 4px 0' }}>
                                {
                                    passVisible
                                    ? <FaEyeSlash  style={{ verticalAlign: 'sub' }} />
                                    : <FaEye style={{ verticalAlign: 'sub' }} />
                                }
                            </Button>
                        </InputGroup.Append>
                        <Form.Control.Feedback type='invalid'>{errors.password?.message}</Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        className={errors.confirmPassword && 'is-invalid'}
                        name='confirmPassword'
                        ref={register}
                        type={passVisible ? 'text' : 'password'}
                        id='confirm-password'
                    />
                    <Form.Control.Feedback type='invalid'>{errors.confirmPassword?.message}</Form.Control.Feedback>
                </Form.Group>
                <Button type='submit' className='mr-2' disabled={!formState.isValid}>
                    {tokenValidation.resetting && <Spinner as='span' animation='border' size='sm' className='mr-1' />}
                    Reset Password
                </Button>
                <Link to='/login'><Button variant='outline-primary'>Login</Button></Link>
            </Form>}
        </div>
    )
}

export default ResetPassword