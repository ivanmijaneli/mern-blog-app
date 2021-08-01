import axios from 'axios'
import setConfig from '../helpers/authConfig'
const baseUrl = '/api/blogs'

const getAll = async () => {
	const response = await axios.get(baseUrl, setConfig())
	return response.data
}

const create = async (blog) => {
	const response = await axios.post(baseUrl, blog, setConfig())
	return response.data
}

const update = async (id, data) => {
	const response = await axios.put(`${baseUrl}/${id}`, data, setConfig())
	return response.data
}

const remove = async (id) => {
	await axios.delete(`${baseUrl}/${id}`, setConfig())
}

const comment = async (id, comment) => {
	const response = await axios.post(`${baseUrl}/${id}/comments`, comment, setConfig())
	return response.data
}

export default {
	getAll,
	create,
	update,
	remove,
	comment
}