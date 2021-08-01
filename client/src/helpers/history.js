import { createBrowserHistory } from 'history'

// custom browser history so we can push from outside of <Router>
// history version 4 works with react-router 4 and 5
export const history = createBrowserHistory()