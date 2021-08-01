import * as yup from 'yup'

export const loginSchema = yup.object().shape({
	username: yup.string().required('Username is required.'),
	password: yup.string().required('Password is required.')
})

export const forgotPasswordSchema = yup.object().shape({
	email: yup.string().email('Email is invalid.').required('Email is required.')
})

export const resetPasswordSchema = yup.object().shape({
	password:
		yup.string()
			.required('Password is required.')
			.min(6, 'Password must be at least 6 characters.'),
	confirmPassword:
		yup.string()
			.oneOf([yup.ref('password'), null], 'Passwords must match.')
			.required('Confirm Password is required.')
})

export const registerSchema = yup.object().shape({
	firstName:
		yup.string()
			.required('First Name is required.')
			.matches(/^[A-Za-z]+$/, 'Use letters only.'),
	lastName:
		yup.string()
			.required('Last Name is required.')
			.matches(/^[A-Za-z]+$/, 'Use letters only.'),
	email:
		yup.string()
			.email('Email is invalid.')
			.required('Email is required.'),
	username:
		yup.string()
			.required('Username is required.')
			.min(4, 'Use 4 to 30 letters & digits only.')
			.max(30, 'Use 4 to 30 letters & digits only.')
			.matches(/^[A-Za-z0-9]+$/, 'Only letters and numbers allowed.'),
	password:
		yup.string()
			.required('Password is required.')
			.min(6, 'Password must be at least 6 characters.'),
	confirmPassword:
		yup.string()
			.oneOf([yup.ref('password'), null], 'Passwords must match.')
			.required('Confirm Password is required.')
})

export const blogSchema = yup.object().shape({
	title: yup.string().required('Title is required.'),
	author: yup.string().required('Author is required.'),
	url: yup.string().url('Must be a valid URL.').required('URL is required.')
})

export const commentSchema = yup.object().shape({
	comment: yup.string().required('Comment is required.')
})