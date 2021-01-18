/*
 * src/appHistory
 * 
 * Define a global history for react-redux-router to allow programmatic navigation
 * throughout the app
 */
import createHistory from 'history/createBrowserHistory'

const history = createHistory()
export default history;