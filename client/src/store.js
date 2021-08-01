import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import blogReducer from './reducers/blogReducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import loginReducer from './reducers/loginReducer'
import userReducer from './reducers/userReducer'
import alertReducer from './reducers/alertReducer'
import registerReducer from './reducers/registerReducer'
import { jwt } from './helpers/middleware'
import passwordReducer from './reducers/passwordReducer'

const store = createStore(combineReducers({
	blogs: blogReducer,
	login: loginReducer,
	alert: alertReducer,
	users: userReducer,
	register: registerReducer,
	password: passwordReducer
}), composeWithDevTools(applyMiddleware(jwt, thunk)))

export default store