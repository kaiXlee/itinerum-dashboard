/*
 * src/reducers/dataManagementReducer.js
 */
import update from 'react/lib/update'

const initialState = {
    avatarMaxFilesize: '10MB',
    avatarUri: '/it/static/defaultAvatar.png',
    avatarErrorMessage: ''
}

export function surveyProfileReducer(state = initialState, action) {
    switch (action.type) {
        case 'AVATAR_FETCH_SUCCESS':
            return update(state, {
                $merge: { 
                    avatarUri: action.imgUri,
                    avatarErrorMessage: ''

                }
            })

        case 'AVATAR_FETCH_FAIL':
            return update(state, {
                $merge: { 
                    avatarUri: initialState.avatarUri,
                    avatarErrorMessage: 'profile.uploadAvatar.emptyWarning'
                }
            })

        case 'AVATAR_UPLOAD_SUCCESS':
            return update(state, {
                $merge: { 
                    avatarUri: action.imgUri,
                    avatarErrorMessage: ''

                }
            })

        case 'AVATAR_UPLOAD_FAIL':
            return update(state, {
                $merge: { 
                    avatarErrorMessage: 'profile.uploadAvatar.emptyWarning',
                    avatarUri: ''
                }
            })        

        default:
            return state
    }
}
