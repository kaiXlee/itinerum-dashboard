/*
 * src/actions/metricsActions.js
 */

import { baseApiUrl } from 'utils/config'
import { tokenRequest } from 'utils/requests'

const baseUrl = baseApiUrl + 'itinerum/'


function encodeUrlData(data) {
    if (data) {
        let encoded = Object.keys(data).map(function(key) {
            return [key, data[key]].map(encodeURIComponent).join('=')
        }).join('&')
        return '?' + encoded
    }
    return ''
}

export function updatePeriodType(payload) {
    return function(dispatch) {
        return dispatch({
            type: 'METRICS-SET_DATETIME_PERIOD_TYPE',
            payload
        })
    }
}


export function updatePeriodsNum(payload) {
    return function(dispatch) {
        return dispatch({
            type: 'METRICS-SET_DATETIME_PERIOD_NUM',
            payload
        })
    }
}


function surveyMetricsSuccess(payload) {
    return {
        type: 'METRICS-FETCHED_DATA_SUCCESS',
        payload: payload.results
    }
}

export function fetchSurveyMetrics(urlParams) {
    return function(dispatch) {
        const params = {
            url: baseUrl + 'metrics' + encodeUrlData(urlParams),
            method: 'GET'
        }
        const jsonCallbacks = {
            begin: function() {},
            success: function(json) { dispatch(surveyMetricsSuccess(json)) },
            error: function(error) { console.log('Fetching server metrics error: ' + error) }
        }
        tokenRequest(params, jsonCallbacks)
    }
}
