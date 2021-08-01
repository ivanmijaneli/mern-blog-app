import axios from 'axios'
import setConfig from '../helpers/authConfig'
const baseUrl = '/api/users'

const getUsers = async () => {
	const response = await axios.get(baseUrl, setConfig())
	return response.data
}

const register = async (user) => {
	const response = await axios.post(baseUrl, user, setConfig())
	return response.data
}

const login = async (credentials) => {
	const response = await axios.post(`${baseUrl}/login`, credentials)
	return response.data
}

const refresh = async () => {
	const response = await axios.post(`${baseUrl}/refresh-token`)
	return response.data
}

const revoke = async () => {
	const response = await axios.post(`${baseUrl}/revoke-token`, {}, setConfig())
	return response.data
}

const verify = async (token) => {
	const response = await axios.post(`${baseUrl}/verify-email`, token)
	return response.data
}

const forgot = async (email) => {
	const response = await axios.post(`${baseUrl}/forgot-password`, email)
	return response.data
}

const validate = async (token) => {
	const response = await axios.post(`${baseUrl}/validate-reset-token`, token)
	return response.data
}

const reset = async (password, token) => {
	const response = await axios.post(`${baseUrl}/reset-password`, { password, token })
	return response.data
}

export default {
	getUsers,
	register,
	login,
	refresh,
	revoke,
	verify,
	forgot,
	validate,
	reset
}