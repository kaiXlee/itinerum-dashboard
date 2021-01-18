/*
 * src/actions/surveyProfileActions.js
 */

import { baseApiUrl } from 'utils/config'
import { tokenRequest, tokenFileRequest } from 'utils/requests'

const baseUrl = baseApiUrl


function fetchAvatarSuccess(json) {
    return {
        type: 'AVATAR_FETCH_SUCCESS',
        imgUri: json.results.avatarUri
    }
}

function fetchAvatarFailed(error) {
    console.log('Fetching survey avatar failed: ' + error) 
    return {
        type: 'AVATAR_FETCH_FAIL'
    }
}

export function fetchSurveyAvatar() {
    return function(dispatch) {
        const params = {
            url: baseUrl + 'profile/avatar',
            method: 'GET'
        }
        const jsonCallbacks = {
            begin: function() {},
            success: function(json) { dispatch(fetchAvatarSuccess(json)) },
            error: function(error) { dispatch(fetchAvatarFailed(error)) }
        }
        tokenRequest(params, jsonCallbacks)
    }
}

function uploadAvatarSuccess(json) {
    return {
        type: 'AVATAR_UPLOAD_SUCCESS',
        imgUri: json.results.avatarUri
    }
}

function uploadAvatarFailed(error) {
    console.log('Uploading survey avatar failed: ' + error) 
    return {
        type: 'AVATAR_UPLOAD_FAIL'
    }
}

export function uploadSurveyAvatar(file) {
    return function(dispatch) {
        const data = new FormData()
        data.append('avatar', file)

        const params = {
            url: baseUrl + 'profile/avatar',
            method: 'POST',
            body: data
        }
        const jsonCallbacks = {
            begin: function() {},
            success: function(json) { dispatch(uploadAvatarSuccess(json)) },
            error: function(error) { dispatch(uploadAvatarFailed(error)) }
        }
        tokenFileRequest(params, jsonCallbacks)
    }
}
