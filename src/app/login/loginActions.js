/*
 * src/actions/loginActions.js
 */
import jwtDecode from 'jwt-decode'
import { baseApiUrl } from 'utils/config'
import { unauthenticatedRequest, tokenRequest, tokenRefreshRequest } from 'utils/requests'
import appHistory from 'appHistory'
import { updateIntl } from 'react-intl-redux'
import { en, fr } from 'language'

const languages = { en, fr }

/*
 * Login AJAX and responses
 */
export function clearStatusId() {
    return {
        type: 'LOGIN-CLEAR_STATUS_ID'
    }
}

export function setStatusId(statusId) {
    return function(dispatch) {
        return dispatch({
            type: 'LOGIN-SET_STATUS_ID',
            statusId
        })
    }
}


function saveLogin(response) {
    try {
        localStorage.setItem('dmdashboard-jwt', response.accessToken)
        localStorage.setItem('dmdashboard-survey', response.surveyName)
    } catch (e) {
        console.warn('Your browser does not support localStorage for persisting user login session. ' +
                     'This is often the case for private browsing mode.')
    }
}

function loginInitialized() {
    return {
        type: 'LOGIN-USER_LOGIN_REQUEST'
    }
}

function loginSuccess(response) {
    saveLogin(response)
    return {
        type: 'LOGIN-USER_LOGIN_SUCCESS',
        payload: response
    }
}

function loginFailed(error) {
    let message, status
    if (error.response && error.response.status !== undefined) {
        status = error.response.status
    }
    switch (status) {
        case 401:
            message = 'Email or password not found in database.'
            break
        case 500:
            message = status + ': Malformed request to server.'
            break
        case 998:
            message = ''  // first page load w/ expired jwt
            break
        case 999:
            message = 'User session is expired, please login again.'
            break
        default:
            message = 'Could not connect to Itinerum dashboard database.'
    }

    localStorage.removeItem('dmdashboard-jwt')
    localStorage.removeItem('dmdashboard-survey')
    return {
        type: 'LOGIN-USER_LOGIN_FAILED',
        payload: {
            text: message,
            color: 'red'
        }
    }
}

export function login(data) { 
    return function(dispatch) {
        const params = {
            url: baseApiUrl + 'auth',
            body: {
                email: data.email,
                password: data.password
            }
        }

        const jsonCallbacks = {
            begin: function() { dispatch(loginInitialized()) },
            success: function(json) { dispatch(loginSuccess(json)) },
            error: function(error) { dispatch(loginFailed(error)) }
        }

        unauthenticatedRequest(params, jsonCallbacks, 'POST')
    }
}


export function logout() {
    localStorage.removeItem('dmdashboard-jwt')
    localStorage.removeItem('dmdashboard-survey')
    return {
        type: 'LOGIN-USER_LOGOUT',
        payload: {}
    }
}


/*
 * JWT actions
 */
export function tokenIsExpired(jwt) {
    let tokenExpiration = jwt.exp,
        currentTime = Date.now() / 1000 | 0,
        expired = (tokenExpiration - currentTime) < 0
    return expired
}

function loginJwtSuccess(payload) {
    return {
        type: 'LOGIN-JWT_LOGIN_SUCCESS',
        payload
    }
}

export function loginJwt(params) {
    const payload = {
        accessToken: localStorage.getItem('dmdashboard-jwt')
    }

    // decode jwt from localstorage
    let jwt
    try { jwt = jwtDecode(payload.accessToken) } 
    catch (e) {
        let error 
        if (params.suppressStatus === true) error = { response: { status: 998 } }
        else error = { response: { status: 999 } }
        return loginFailed(error)
    }

    // test if token is expired
    let error = { response: { status: 999 } }
    if (tokenIsExpired(jwt)) { return loginFailed(error)}
    else return loginJwtSuccess(payload)
}

function setUserLevel(payload) {
    return {
        type: 'LOGIN-SET_USER_LEVEL',
        payload
    }
}

export function refreshJwt() {
    return function(dispatch) {
        const params = {
            url: baseApiUrl + 'auth/refresh',
            method: 'POST'
        }

        const jsonCallbacks = {
            begin: function() {},
            success: function(json) {
                localStorage.setItem('dmdashboard-jwt', json.accessToken)
                dispatch(setUserLevel(json.userLevel))
            },
            error: function(error) { dispatch(loginFailed(error)) }
        }

        tokenRefreshRequest(params, jsonCallbacks)
    }
}



/*
 * Signup Component Actions
 */
function registerInitialized() {
    return {
        type: 'LOGIN-USER_REGISTER_REQUEST--UNIMPLEMENTED'
    }
}

function registerSuccess(response) {
    return {
        type: 'LOGIN-USER_REGISTER_SUCCESS',
        payload: { statusId: 'login.userSignup.success' }
    }
}


function registerFailed(statusId) {
    return {
        type: 'LOGIN-USER_REGISTER_FAILED',
        payload: { statusId }
    }
}


export function registerUser(data) {
    return function(dispatch) {
        const params = {
            url: baseApiUrl + 'auth/signup',
            body: {
                surveyName: data.surveyName,
                email: data.email,
                password: data.password,
                registrationToken: data.registrationToken
            }
        }        
        const jsonCallbacks = {
            begin: function() { dispatch(registerInitialized()) },
            success: function(json) { dispatch(registerSuccess(json)) },
            error: function(error) {
                let { status, statusText } = error.response

                let messageId
                switch (status) {
                    case 400:
                        messageId = 'login.userSignup.error.userExists'
                        break
                    case 401:
                        messageId = 'Error message should not be reached during registration.'
                        break
                    case 403:
                        messageId = 'login.userSignup.error.tokenIsInvalid'
                        break
                    case 404:
                        messageId = 'login.userSignup.error.emailNotFound'
                        break
                    case 500:
                        messageId = 'login.userSignup.error.internalServer'
                        break
                    default:
                        messageId = 'login.userSignup.error.unknown'
                }

                dispatch(registerFailed(messageId))
            }
        }
        unauthenticatedRequest(params, jsonCallbacks, 'POST')
    }
}

function fetchedValidationsSuccess(results) {
    return {
        type: 'LOGIN-VALIDATIONS_RESULTS',
        payload: results
    }
}

function fetchedValidationsFailed() {
    return {
        type: 'LOGIN-COULD_NOT_FETCH_VALIDATIONS'
    }
}

export function validationCheck(fieldInput) {
    return function(dispatch) {
        const params = {
            url: baseApiUrl + 'new/validate',
            body: {
                ...fieldInput
            }
        }

        const jsonCallbacks = {
            begin: function() {},
            success: function(json) { dispatch(fetchedValidationsSuccess(json)) },
            error: function(error) { dispatch(fetchedValidationsFailed(error)) }
        }

        unauthenticatedRequest(params, jsonCallbacks, 'POST')
    }
}


function registrationSuccess(response) {
    return {
        type: 'LOGIN-NEW_SURVEY_SUCCESS',
        payload: {
            text: 'New survey registered, please login.',
            color: 'green'
        }
    }
}

function registrationFailed(error) {
    let { status, statusText } = error.response
    let messageId
    switch(status) {
        case 400:
            messageId = 'login.newSurvey.error.failedToCreateSurvey'
            break
        case 401:
            messageId = 'login.newSurvey.error.surveyExists'
            break
        case 403:
            messageId = 'login.newSurvey.error.tokenIsInvalid'
            break
        default:
            messageId = 'login.newSurvey.error.unknown'
    }

    return {
        type: 'LOGIN-NEW_SURVEY_FAILED',
        messageId
    }
}

export function registerSurvey(data) {
    return function(dispatch) {
        const params = {
            url: baseApiUrl + 'new',
            body: {
                email: data.email,
                password: data.password,
                surveyName: data.surveyName,
                signupCode: data.signupCode
            }
        }

        const jsonCallbacks = {
            begin: function() {},
            success: function(json) {
                dispatch(registrationSuccess(json))
                appHistory.push('/login')
            },
            error: function(error) { dispatch(registrationFailed(error)) }
        }
        unauthenticatedRequest(params, jsonCallbacks, 'POST')
    }
}


export function changeCurrentLanguage(languageCode) {
    localStorage.setItem('dmdashboard-language', languageCode)

    return function(dispatch) {
        dispatch(updateIntl({
            locale: languageCode.toLowerCase(),
            messages: languages[languageCode.toLowerCase()].messages
        }))
    }
}


function passwordResetConfirmed(response) {
    return {
        type: 'LOGIN-PASSWORD_RESET_CONFIRMED'
    }
}

function passwordResetFailed(error) {
    return {
        type: 'LOGIN-PASSWORD_RESET_FAILED'
    }
}

function passwordResetSuccess(response) {
    return {
        type: 'LOGIN-PASSWORD_RESET_SUCCESS'
    }
}

export function resetUserPassword(email) {
    let baseUrl = window.location.protocol + '//' + 
                  window.location.hostname
    if (window.location.port) {
        baseUrl += ':' + window.location.port
    }

    return function(dispatch) {
        const params = {
            url: baseApiUrl + 'auth/password/reset',
            body: { email, baseUrl }
        }

        const jsonCallbacks = {
            begin: function() {},
            success: function(json) {
                dispatch(passwordResetConfirmed(json))
            },
            error: function(error) { dispatch(passwordResetFailed(error)) }
        }

        unauthenticatedRequest(params, jsonCallbacks, 'POST')
    }
}

function passwordUpdateSuccess(response) {
    return {
        type: 'LOGIN-PASSWORD_UPDATE_SUCCESS'
    }
}

function passwordUpdateFailed(error) {
    return {
        type: 'LOGIN-PASSWORD_UPDATE_FAILED'
    }
}

export function updateUserPassword(email, password, token) {
    return function(dispatch) {
        const params = {
            url: baseApiUrl + 'auth/password/reset',
            body: { email, password, token }
        }
        const jsonCallbacks = {
            begin: function() {},
            success: function(json) {
                dispatch(passwordUpdateSuccess(json))
            },
            error: function(error) { dispatch(passwordUpdateFailed(error)) }
        }
        unauthenticatedRequest(params, jsonCallbacks, 'PUT')
    }
}
