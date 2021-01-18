/*
 * src/reducers/loginReducer.js
 */
import update from 'react/lib/update'

const initialState = {
    auth: null,
    isAuthenticating: false,
    role: {
        isResearcher: false,
        isAdmin: false
    },
    newSurvey: {
        serverValidations: {}
    },
    resetPassword: {
        submitResult: undefined,
        statusHeaderId: 'Request pending...',
        statusId: undefined
    },
    statusId: undefined,
}

export function loginReducer(state = initialState, action) {
    switch(action.type) {
        case 'LOGIN-CLEAR_STATUS_ID':
            return update(state, {
                $merge: {
                    statusId: undefined
                }
            })

        case 'LOGIN-SET_STATUS_ID':
            return update(state, {
                $merge: {
                    statusId: action.statusId
                }
            })

        case 'LOGIN-USER_LOGIN_REQUEST':
            return update(state, {
                $merge: {
                    isAuthenticating: true
                }
            })

        case 'LOGIN-USER_LOGIN_SUCCESS':
            return update(state, {
                $merge: {
                    isAuthenticating: false,
                    auth: { token: action.payload.accessToken }
                }
            })

        case 'LOGIN-USER_LOGIN_FAILED':
            return update(state, {
                $merge: {
                    isAuthenticating: false,
                    statusId: action.payload.text,
                    auth: null
                }
            })

        case 'LOGIN-JWT_LOGIN_SUCCESS':
            return update(state, {
                $merge: {
                    isAuthenticating: true,
                    auth: { token: action.payload.accessToken }
                }
            })

        case 'LOGIN-SET_USER_LEVEL':
            if (action.payload === 0) {        
                return update(state, {
                    $merge: {
                        role: {
                            isAdmin: true,
                            isResearcher: true                     
                        },
                        isAuthenticating: false
                    }
                })      
            }
            if (action.payload === 1) {
                return update(state, {
                    $merge: {
                        role: {
                            isAdmin: false,
                            isResearcher: true                     
                        },
                        isAuthenticating: false
                    }
                })          
            }
            return update(state, {
                $merge: {
                    role: {
                        isAdmin: false,
                        isResearcher: false                        
                    },
                    isAuthenticating: false
                }
            })

        case 'LOGIN-USER_LOGOUT':
            return initialState

        case 'LOGIN-USER_REGISTER_SUCCESS':
            return update(state, {
                $merge: { statusId: action.payload.statusId }
            })

        case 'LOGIN-USER_REGISTER_FAILED':
            return update(state, {
                $merge: { statusId: action.payload.statusId }
            })

        case 'LOGIN-VALIDATIONS_RESULTS':
            return update(state, {
                newSurvey: {
                    serverValidations: {
                        $merge: { ...action.payload.results }
                    }
                }
            })

        case 'LOGIN-NEW_SURVEY_SUCCESS':
            return update(state, {
                $merge: {
                    helpText: '',
                    statusId: action.payload.messageId
                }
            })

        case 'LOGIN-NEW_SURVEY_FAILED':
            return update(state, {
                newSurvey: {
                    $merge: {
                        validationDuplicates: action.payload
                    }
                }
            })            

        case 'LOGIN-PASSWORD_RESET_CONFIRMED':
            return update(state, {
                resetPassword: {
                    $merge: {
                        statusHeaderId: 'Confirmed',
                        statusId: 'An email with password reset instructions will be sent to the provided email shortly.'
                    }
                }
            })

        case 'LOGIN-PASSWORD_RESET_FAILED':
            return update(state, {
                resetPassword: {
                    $merge: { 
                        statusHeaderId: 'Email not found',
                        statusId: 'A user for the provided email could not be found. Please check spelling and try again.'
                    }
                }
            })

        case 'LOGIN-PASSWORD_UPDATE_SUCCESS':
            return update(state, {
                $merge: { statusId: 'User password has been updated.' }
            })

        case 'LOGIN-PASSWORD_UPDATE_FAILED':
            return update(state, {
                $merge: { statusId: 'Password could not be updated.' }
            })

        default:
            return state
    }
}

