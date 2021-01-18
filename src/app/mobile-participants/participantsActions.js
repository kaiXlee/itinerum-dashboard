/*
 * src/app/mobile-participants/participantsActions.js
 */
import Moment from 'moment'
import { baseApiUrl } from 'utils/config'
import { tokenRequest, downloadToFile, encodeUrlData } from 'utils/requests'

const baseUrl = baseApiUrl + 'itinerum/'


export function setSelectedUser(uuid) {
    return function(dispatch) {
        dispatch({
            type: 'PARTICIPANTS-SELECTED_UUID',
            payload: uuid
        })
    }
}

// ITINERUM USERS TABLE ACTIONS
function mobileUsersSuccess(payload) {
    return {
        type: 'PARTICIPANTS-MOBILE_USERS_DATA',
        payload: payload.results
    }
}

function mobileUsersFailed(error) {
    return {
        type: 'PARTICIPANTS-MOBILE_USERS_FAILED',
    }
}

export function fetchMobileUsers(urlParams) {
    return function(dispatch) {
        const params = {
            url: baseUrl + 'users/table' + encodeUrlData(urlParams),
            method: 'GET'
        }

        const jsonCallbacks = {
            begin: function() {},
            success: function(json) { dispatch(mobileUsersSuccess(json)) },
            error: function(error) {
                console.log('Signups JSON parsing failed: ' + error)
                dispatch(mobileUsersFailed(error))
            }
        }
        tokenRequest(params, jsonCallbacks)
    }
}

export function setTableFilter(searchString) {
    return {
        type: 'PARTICIPANTS-SET_TABLE_FILTER',
        searchString
    }
}

export function setTableSorting(payload) {
    return {
        type: 'PARTICIPANTS-SET_TABLE_SORTING',
        payload
    }
}
