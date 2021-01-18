/*
 * src/reducers/permissionsReducer.js
 */
import update from 'react/lib/update'


const initialState = {
    registrationCode: {
        text: 'Please enter a unique registration code here',
        updating: false
    },
    showEmailModal: false,
    webUsers: [],
    pagination: {
        currentPage: 0
    },
    tableSorting: {},
 }

 export function permissionsReducer(state = initialState, action) {
    let nextState, nextQuestion, editedQuestion, nextIndex
    let prompts, stack

    switch (action.type) {
        case 'PERMISSIONS-REFRESH_CODE_INIT':
            return update(state, {
                registrationCode: {
                    $merge: {
                        updating: true
                    }
                }
            })

        case 'PERMISSIONS-REFRESH_CODE_DATA':
            return update(state, {
                registrationCode: {
                    $set: {
                        text: action.payload.results.token,
                        updating: false,
                    }
                }
            })

        case 'PERMISSIONS-WEB_USERS_DATA':
            action.payload.pagination.currentPage -= 1
            return update(state, {
                $merge: {
                    webUsers: action.payload.data,
                    pagination: action.payload.pagination,
                }
            })

        case 'PERMISSIONS-TOGGLE_EMAIL_MODAL':
            return update(state, {
                showEmailModal: {
                    $set: !state.showEmailModal
                }
            })

        case 'PARTICIPANTS-SET_TABLE_SORTING':
            return update(state, {
                tableSorting: { $set: action.payload }
            })

        default:
            return state
    }
}