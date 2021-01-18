/*
 * src/app/mobile-participants/participantsReducer.js
 */

import update from 'react/lib/update'

const initialState = {
    mobileUsers: [],
    pagination: {
        currentPage: 0
    },
    columns: [],
    selectedUuid: undefined,
    tableFilter: '',
    tableSorting: {}
}

export function participantsReducer(state = initialState, action) {
    switch (action.type) {
        case 'PARTICIPANTS-MOBILE_USERS_DATA':
            action.payload.pagination.currentPage -= 1
            return update(state, {
                mobileUsers: {
                    $set: action.payload.data
                },
                pagination: {
                    $set: action.payload.pagination
                },
                columns: {
                    $set: action.payload.columns
                }
            })

        case 'PARTICIPANTS-SET_TABLE_FILTER':
            return update(state, {
                tableFilter: { $set: action.searchString }
            })

        case 'PARTICIPANTS-SET_TABLE_SORTING':
            return update(state, {
                tableSorting: { $set: action.payload }
            })
        
        case 'PARTICIPANTS-SELECTED_UUID':
            return update(state, {
                $merge: {
                    selectedUuid: action.payload
                }
            })

        case 'LOGIN-USER_LOGOUT':
            return update(state, {
                selectedUuid: { $set: undefined }
            })


        default:
            return state
    }
}