import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logInAction } from '../actions/userActions'
import { Link } from 'react-router-dom'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers'
import { loginSchema } from '../helpers/yupSchemas'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Spinner from 'react-bootstrap/Spinner'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

import Alert from './Alert'

const LoginForm = () => {
    // form
    const { register, handleSubmit, errors, formState } = useForm({
      mode: 'onChange',
        resolver: yupResolver(loginSchema)
    });

    // password visibility
    const [passVisible, setPassVisible] = useState(false)

    // login loading
    const loggingIn = useSelector(state => state.login.loggingIn)

    const dispatch = useDispatch()

    const handleLogin = (data) => {
        // it made sense to catch error here when we called service directly
        dispatch(logInAction(data))
    }

    return(
        <div className="col-sm-8 col-md-6 col-lg-4 mx-auto">
            <h1 className='text-center my-4'>Blog App</h1>
            <Alert />
            <div className='d-flex align-items-center justify-content-between'>
                <h2 className='my-4'>Login</h2>
                <div className='d-flex flex-column'>
                    <span>user: zukohere</span>
                    <span>pass: mei123</span>
                </div>
            </div>
            <Form onSubmit={handleSubmit(handleLogin)} className='login-form' autoComplete='off' id='login-form'>
                <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        className={errors.username && 'is-invalid'}
                        name="username"
                        ref={register}
                        id='username'
                    />
                    <Form.Control.Feedback type='invalid'>{errors.username?.message}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <InputGroup>                         
                        <Form.Control 
                            className={errors.password && 'is-invalid'}
                            name="password" 
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
                <Button type='submit' id='login-button' className='mr-2' disabled={!formState.isValid || loggingIn}>
                    {loggingIn && <Spinner as='span' animation='border' size='sm' className='mr-1' />}
                    Login
                </Button>
                <Link to='/register'><Button variant='outline-primary'>Register</Button></Link>
                <Link to='forgot-password' className='float-right'>Forgot password?</Link>
            </Form>
        </div>
    )
}

export default LoginForm