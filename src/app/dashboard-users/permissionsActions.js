/*
 * src/actions/permissionsActions.js
 */

import { baseApiUrl } from 'utils/config'
import { tokenRequest, encodeUrlData } from 'utils/requests'

const baseUrl = baseApiUrl

// Web Users actions
function refreshCodeInit() {
    return {
        type: 'PERMISSIONS-REFRESH_CODE_INIT',
    }
}

function refreshCodeSuccess(payload) {
    return {
        type: 'PERMISSIONS-REFRESH_CODE_DATA',
        payload
    }
}

export function fetchInviteCode() {
    return function(dispatch) {
        const params = { url: baseApiUrl + 'auth/signup/code', method: 'GET' }
        const jsonCallbacks = {
            begin: function() { dispatch(refreshCodeInit()) },
            success: function(json) { dispatch(refreshCodeSuccess(json)) },
            error: function(error) { dispatch(console.log('Retrieving new update code error: ' + error)) }
        }
        tokenRequest(params, jsonCallbacks)
    }
}

export function refreshInviteCode() {
    return function(dispatch) {
        const params = { url: baseApiUrl + 'auth/signup/code', method: 'POST' }
        const jsonCallbacks = {
            begin: function() { dispatch(refreshCodeInit()) },
            success: function(json) { dispatch(refreshCodeSuccess(json)) },
            error: function(error) { dispatch(console.log('Retrieving new update code error: ' + error)) }
        }
        tokenRequest(params, jsonCallbacks)
    }
}

export function toggleEmailModal() {
    return {
        type: 'PERMISSIONS-TOGGLE_EMAIL_MODAL'
    }
}

function webUsersSuccess(payload) {
    return {
        type: 'PERMISSIONS-WEB_USERS_DATA',
        payload: payload.results
    }
}

function webUsersFailed(error) {
    return {
        type: 'PERMISSIONS-WEB_USERS_FAILED',
    }
}

export function fetchWebUsers(urlParams) {
    return function(dispatch) {
        const params = {
            url: baseUrl + 'webusers/table' + encodeUrlData(urlParams),
            method: 'GET'
        }
        const jsonCallbacks = {
            begin: function() {},
            success: function(json) { dispatch(webUsersSuccess(json)) },
            error: function(error) { 
                console.log('Signups JSON parsing failed: ' + error)
                dispatch(webUsersFailed(error))
            }
        }
        tokenRequest(params, jsonCallbacks)
    }
}

export function removeWebUser(email, urlParams) {
    return dispatch => new Promise((resolve, reject) => {
        const params = { url: baseUrl + 'webusers/' + email, method: 'DELETE' }
        const jsonCallbacks = {
            begin: function() {},
            success: function() { resolve(200) },
            error: function(error) { 
                reject(Error('Deleting user \''+ email +'\' failed: ' + error))
            }
        }
        tokenRequest(params, jsonCallbacks)
    })
}

export function setTableSorting(payload) {
    return {
        type: 'PERMISSIONS-SET_TABLE_SORTING',
        payload
    }
}

