import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerAction } from '../actions/userActions'
import { Link } from 'react-router-dom'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers'
import { registerSchema } from '../helpers/yupSchemas'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Spinner from 'react-bootstrap/Spinner'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

import Alert from './Alert'

const RegisterForm = () => {
    // form
    const { register, handleSubmit, errors, formState } = useForm({
        mode: 'onChange',
        resolver: yupResolver(registerSchema)
    });

    // password visibility
    const [passVisible, setPassVisible] = useState(false)

    // register loading
    const registering = useSelector(state => state.register.registering)

    const dispatch = useDispatch()
    
    const handleRegister = (data) => {
        dispatch(registerAction(data))
    }

    return(
        <div className="col-sm-8 col-md-6 col-lg-4 mx-auto mb-4">
            <h1 className='text-center my-4'>Blog App</h1>
            <Alert />
            <h2 className='my-4'>Register</h2>
            <Form onSubmit={handleSubmit(handleRegister)} autoComplete='off' id='register-form'>
                <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        className={errors.firstName && 'is-invalid'}
                        name='firstName'
                        ref={register}
                        id='first-name'
                    />
                    <Form.Control.Feedback type='invalid'>{errors.firstName?.message}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        className={errors.lastName && 'is-invalid'}
                        name='lastName'
                        ref={register}
                        id='last-name'
                    />
                    <Form.Control.Feedback type='invalid'>{errors.lastName?.message}</Form.Control.Feedback>
                </Form.Group>
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
                <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        className={errors.username && 'is-invalid'}
                        name='username'
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
                <Button type='submit' className='mr-2' disabled={!formState.isValid || registering}>
                    {registering && <Spinner as='span' animation='border' size='sm' className='mr-1' />}
                    Register
                </Button>
                <Link to='/login'><Button variant='outline-danger'>cancel</Button></Link>
            </Form>
        </div>
    )
}

export default RegisterForm