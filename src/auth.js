/*
 * src/auth.js 
 */
import React from 'react'
import { routerActions } from 'react-router-redux'
import { UserAuthWrapper } from 'redux-auth-wrapper'
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'
import connectedAuthWrapper from 'redux-auth-wrapper/connectedAuthWrapper'


// creates redirect back to requested page after successful login
const locationHelper = locationHelperBuilder({})


// Display an empty (TBA: loading) component to display while auth-wrapper is authenticating
class NullLoadingComponent extends React.Component {
    render() {
        console.log('Displaying NullLoadingComponent...')

        return(
            <div>NullLoadingComponent...</div>
        )
    }
}

// wrapper for auto-redirect to authenticated views from public views
const userIsNotAuthenticatedDefaults = {
    // Want to redirect the user when they are done loading and authenticated
    authenticatedSelector: state => state.login.auth === null,
    wrapperDisplayName: 'UserIsNotAuthenticated'
}
const userIsNotAuthenticated = connectedAuthWrapper(userIsNotAuthenticatedDefaults)
export const userIsNotAuthenticatedRedir = connectedRouterRedirect({
    ...userIsNotAuthenticatedDefaults,
    redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
    allowRedirectBack: false
})


// wrapper for authenticated views
const userIsAuthenticatedDefaults = {
    authenticatedSelector: state => state.login.auth !== null,
    authenticatingSelector: state => state.login.isAuthenticating,
    wrapperDisplayName: 'UserIsAuthenticated'
}

const userIsAuthenticated = connectedAuthWrapper(userIsAuthenticatedDefaults)

export const userIsAuthenticatedRedir = connectedRouterRedirect({
    ...userIsAuthenticatedDefaults,
    AuthenticatingComponent: NullLoadingComponent,
    redirectPath: '/login'
})


// user-level authentication
export const userIsResearcher= (view) => view
export const userIsAdmin = (view) => view

