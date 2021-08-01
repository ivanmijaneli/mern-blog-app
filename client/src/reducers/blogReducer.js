const blogReducer = (state = {}, action) => {
	switch(action.type) {
	// get blogs
	case 'GET_BLOGS_REQUEST':
		return { loading: true }
	case 'GET_BLOGS_SUCCESS':
		return { items: action.blogs }
	case 'GET_BLOGS_FAILURE':
		return { error: action.error }

		// post blog
		// we don't store an error, just show it using alert action
	case 'POST_BLOG_REQUEST':
		return { ...state, posting: true }
	case 'POST_BLOG_SUCCESS':
		return { ...state, items: [...state.items, action.newBlog], posting: false }
	case 'POST_BLOG_FAILURE':
		return { ...state, posting: false }

		// like blog
	case 'LIKE_BLOG_REQUEST':
		return { ...state, liking: true }
	case 'LIKE_BLOG_SUCCESS':
		return { ...state, items: state.items.map(blog => blog.id === action.likedBlog.id ? action.likedBlog : blog), liking: false }
	case 'LIKE_BLOG_FAILURE':
		return { ...state, liking: false }

		// delete blog
	case 'DELETE_BLOG_REQUEST':
		return { ...state, deleting: true }
	case 'DELETE_BLOG_SUCCESS':
		return { ...state, items: state.items.filter(blog => blog.id !== action.id), deleting: false }
	case 'DELETE_BLOG_FAILURE':
		return { ...state, deleting: false }

		// comment blog
	case 'COMMENT_BLOG_REQUEST':
		return { ...state, commenting: true }
	case 'COMMENT_BLOG_SUCCESS':
		return { ...state, items: state.items.map(blog => blog.id === action.commentedBlog.id ? action.commentedBlog : blog), commenting: false }
	case 'COMMENT_BLOG_FAILURE':
		return { ...state, commenting: false }

	default:
		return state
	}
}

export default blogReducer