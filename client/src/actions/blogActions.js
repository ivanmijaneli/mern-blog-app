import blogService from '../services/blogs'
import { addAlertAction } from '../actions/alertActions'
import { history } from '../helpers/history'

export const getBlogsAction = () => {
	return async (dispatch) => {
		dispatch(request())

		try {
			const blogs = await blogService.getAll()
			dispatch(success(blogs))
		} catch (error) {
			dispatch(failure(error.toString()))
		}
	}

	function request() { return { type: 'GET_BLOGS_REQUEST' } }
	function success(blogs) { return { type: 'GET_BLOGS_SUCCESS', blogs } }
	function failure(error) { return { type: 'GET_BLOGS_FAILURE', error } }
}

export const addBlogAction = (blogObject) => {
	return async (dispatch) => {
		dispatch(request())

		try {
			const newBlog = await blogService.create(blogObject)
			dispatch(success(newBlog))
			dispatch(addAlertAction('blog added', 'success'))
		} catch (error) {
			// no need to store the error as we show it in alert
			dispatch(failure())
			dispatch(addAlertAction(error.response.data.error, 'danger'))
		}
	}

	function request() { return { type: 'POST_BLOG_REQUEST' } }
	function success(newBlog) { return { type: 'POST_BLOG_SUCCESS', newBlog } }
	function failure() { return { type: 'POST_BLOG_FAILURE' } }
}

export const likeBlogAction = (id, data) => {
	return async (dispatch) => {
		dispatch(request())

		try {
			const likedBlog = await blogService.update(id, data)
			dispatch(success(likedBlog))
		} catch (error) {
			dispatch(failure())
			// blog is deleted from another browser or tab
			if (error.response.data.error === 'blog not found') {
				dispatch({ type: 'DELETE_BLOG_SUCCESS', id })
				history.push('/')
			}
			dispatch(addAlertAction(error.response.data.error, 'danger'))
		}
	}

	function request() { return { type: 'LIKE_BLOG_REQUEST' } }
	function success(likedBlog) { return { type: 'LIKE_BLOG_SUCCESS', likedBlog } }
	function failure() { return { type: 'LIKE_BLOG_FAILURE' } }
}

export const deleteBlogAction = (blogId) => {
	return async (dispatch) => {
		dispatch(request())

		try {
			await blogService.remove(blogId)
			dispatch(success(blogId))
			history.push('/')
			dispatch(addAlertAction('blog deleted', 'success'))
		} catch (error) {
			dispatch(failure())
			// blog is deleted from another browser
			if (error.response.data.error === 'blog not found') {
				dispatch(success(blogId))
				history.push('/')
			}
			dispatch(addAlertAction(error.response.data.error, 'danger'))
		}
		dispatch({
			type: 'DELETE_BLOG',
			data: { blogId }
		})
	}

	function request() { return { type: 'DELETE_BLOG_REQUEST' } }
	function success(id) { return { type: 'DELETE_BLOG_SUCCESS', id } }
	function failure() { return { type: 'DELETE_BLOG_FAILURE' } }
}

export const addCommentAction = (id, comment) => {
	return async (dispatch) => {
		dispatch(request())

		try {
			const commentedBlog = await blogService.comment(id, comment)
			dispatch(success(commentedBlog))
			dispatch(addAlertAction('comment added', 'success'))
		} catch (error) {
			dispatch(failure())
			// blog is deleted from another browser
			if (error.response.data.error === 'blog not found') {
				dispatch({ type: 'DELETE_BLOG_SUCCESS', id })
				history.push('/')
			}
			dispatch(addAlertAction(error.response.data.error, 'danger'))
		}
	}

	function request() { return { type: 'COMMENT_BLOG_REQUEST' } }
	function success(commentedBlog) { return { type: 'COMMENT_BLOG_SUCCESS', commentedBlog } }
	function failure() { return { type: 'COMMENT_BLOG_FAILURE' } }
}