/*
 * src/containers/Panels/Settings/settingsActions.js
 */
import Moment from  'moment'
import { baseApiUrl } from 'utils/config'
import { tokenRequest, encodeUrlData } from 'utils/requests'

export function editAboutText(aboutText) {
    return {
        type: 'SETTINGS-EDIT_ABOUT_TEXT',
        aboutText
    }
}

export function editContactEmail(email) {
    return {
        type: 'SETTINGS-EDIT_CONTACT_EMAIL',
        email
    }
}

export function editSurveyMaxDays(surveyMaxDays) {
    return {
        type: 'SETTINGS-EDIT_SURVEY_MAX_DAYS',
        surveyMaxDays
    }
}

export function editSurveyMaxPrompts(surveyMaxPrompts) {
    return {
        type: 'SETTINGS-EDIT_SURVEY_MAX_PROMPTS',
        surveyMaxPrompts
    }
}

export function editTermsOfService(termsOfService) {
    return {
        type: 'SETTINGS-EDIT_TERMS_OF_SERVICE',
        termsOfService
    }
}

export function editGpsAccuracyThreshold(gpsAccuracyThresholdMeters) {
    return {
        type: 'SETTINGS-EDIT_GPS_ACCURACY_THRESHOLD',
        gpsAccuracyThresholdMeters
    }
}

export function editTripbreakerColdStartDistance(tripbreakerColdStartDistanceMeters) {
    return {
        type: 'SETTINGS-EDIT_TRIPBREAKER_COLD_START_DISTANCE',
        tripbreakerColdStartDistanceMeters
    }
}

export function editTripbreakerInterval(tripbreakerIntervalSeconds) {
    return {
        type: 'SETTINGS-EDIT_TRIPBREAKER_INTERVAL',
        tripbreakerIntervalSeconds
    }
}

export function editTripbreakerSubwayBuffer(tripbreakerSubwayBufferMeters) {
    return {
        type: 'SETTINGS-EDIT_TRIPBREAKER_SUBWAY_BUFFER',
        tripbreakerSubwayBufferMeters
    }
}

function fetchSettingsSuccess(payload) {
    if (payload.results.surveyStart) {
        payload.results.surveyStartDatetime = Moment(payload.results.surveyStart)
    }

    if (payload.results.aboutText === null) {
        payload.results.aboutText = undefined
    }

    if (payload.results.termsOfService === null) {
        payload.results.termsOfService = undefined
    }

    return {
        type: 'SETTINGS-FETCHED_PARAMETERS',
        payload: payload.results
    }
}

function fetchSettingsFailed(error) {
    return {
        type: 'SETTINGS-FETCHING_PARAMETERS_FAILED'
    }
}

export function fetchSettings() {
    return function(dispatch) {
        const params = {
            url: baseApiUrl + 'settings',
            method: 'GET',
        }

        const jsonCallbacks = {
            begin: function() {},
            success: function(json) { dispatch(fetchSettingsSuccess(json)) },
            error: function(error) { dispatch(fetchSettingsFailed(error)) }
        }

        tokenRequest(params, jsonCallbacks)
    }
}

function showSpinnerIcon() {
    return {
        type: 'SETTINGS-PAGE_IS_SAVING'
    }
}


function saveSettingsSuccess(payload) {
    if (payload.results.surveyStart) {
        payload.results.surveyStartDatetime = Moment(payload.results.surveyStart)
    }

    if (payload.results.aboutText === null) {
        payload.results.aboutText = undefined
    }

    if (payload.results.termsOfService === null) {
        payload.results.termsOfService = undefined
    }    
    
    return {
        type: 'SETTINGS-SAVE_SUCCESSFUL',
        payload: payload.results
    }
}

function saveSettingsFailed(error) {
    return {
        type: 'SETTINGS-SAVE_FAILED'
    }
}

export function saveSettings(settings) {
    return function(dispatch) {
        const params = {
            url: baseApiUrl + 'settings',
            method: 'POST',
            body: JSON.stringify(settings)
        }

        const jsonCallbacks = {
            begin: function() { dispatch(showSpinnerIcon()) },
            success: function(json) { dispatch(saveSettingsSuccess(json)) },
            error: function(error) { dispatch(saveSettingsFailed(error)) }
        }

        tokenRequest(params, jsonCallbacks)
    }
}


function resetSurveySuccess(payload) {
    return {
        type: 'SETTINGS-SURVEY_RESET_SUCCESS',
        payload: payload.results
    }
}

function resetSurveyFailed(error) {
    return {
        type: 'SETTINGS-SURVEY_RESET_FAILED',
        error: 'Survey did not reset successfully, check database connection.'
    }
}

export function resetSurveyData() {
    return function(dispatch) {
        const params = {
            url: baseApiUrl + 'settings/reset',
            method: 'POST'
        }

        const jsonCallbacks = {
            begin: function() {},
            success: function(json) { dispatch(resetSurveySuccess(json)) },
            error: function(error) { dispatch(resetSurveyFailed(error)) }
        }

        tokenRequest(params, jsonCallbacks)
    }
}