/*
 * src/index.js
 */
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { addLocaleData } from 'react-intl'
import frLocaleData from 'react-intl/locale-data/fr'
import { Provider } from 'react-intl-redux'
import { connect } from 'react-redux'
import ReduxModal from 'lib/react-redux-modal'
import { Router, Route, Switch, withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import appHistory from './appHistory'
import { userIsAuthenticatedRedir,
         userIsNotAuthenticatedRedir } from './auth'
import configureStore from './configureStore'
import ConnectedIntlProvider from 'language/connectedIntlProvider'
import { App, SignIn, NewSurvey, ResearcherSignUp,
         SendResetEmail, ResetPassword, UserSignUp } from 'app'
import * as loginActions from 'app/login/loginActions'

addLocaleData([...frLocaleData])


// Apply the route authentication HOCs here to avoid applying them inside render
const PublicSignIn = userIsNotAuthenticatedRedir(SignIn),
      PublicNewSurvey = userIsNotAuthenticatedRedir(NewSurvey),
      PublicUserSignUp = userIsNotAuthenticatedRedir(UserSignUp),
      PublicSendResetEmail = userIsNotAuthenticatedRedir(SendResetEmail),
      PublicResetPassword = userIsNotAuthenticatedRedir(ResetPassword),
      PrivateApp = userIsAuthenticatedRedir(App)


@withRouter
@connect(
    state => state.login,
    dispatch => bindActionCreators(loginActions, dispatch)
)
class RootComponent extends React.Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    }

    componentWillMount() {
        // attempt to login with jwt token
        this.props.loginJwt({suppressStatus: true})
        this.refreshApiToken()

        // listen for navigation to new routes and refresh jwt token
        this.context.router.history.listen(this.refreshApiToken)
    }

    refreshApiToken = () => {
        let jwt = localStorage.getItem('dmdashboard-jwt')
        if (jwt) this.props.refreshJwt()
    }

    render() {
        return(
            <section>
                <Switch>
                    <Route exact path='/login' component={PublicSignIn} />
                    <Route exact path='/new' component={PublicNewSurvey} />
                    <Route exact path='/signup/user' component={PublicUserSignUp} />
                    <Route exact path='/signup/researcher' component={PublicUserSignUp} />
                    <Route exact path='/reset' component={PublicSendResetEmail} />
                    <Route exact path='/reset/password' component={PublicResetPassword} />

                    <Route component={PrivateApp} />
                </Switch>
                <ReduxModal />
            </section>
        )
    }
}

    
// create a browser history with a prepended base path for routes
const store = configureStore(appHistory)
const app = (
    <Provider store={store}>
        <ConnectedIntlProvider>
            <Router history={appHistory}>
                <RootComponent />
            </Router>
        </ConnectedIntlProvider>
    </Provider>
)
ReactDOM.render(app, document.getElementById('root'))
