/*
 * src/app/data-management/dataManagementActions.js
 */
import { baseApiUrl, sseUri } from 'utils/config'
import { tokenRequest, tokenZipRequest, tokenFileRequest, encodeUrlData } from 'utils/requests'
import Moment from  'moment'

const baseUrl = baseApiUrl + 'data/'
let source

// connect and teardown eventstream for export updates
export function connectServerSentEvents(channelName) {
    return function(dispatch) {
        const streamUri = sseUri + '?channel=' + channelName
        source = new EventSource(streamUri)

        source.onopen = function(e) { console.log('SSE eventstream opened.') }

        source.onmessage = function(e) {
            const payload = JSON.parse(e.data)

            if (payload.type) {
                switch (payload.type) {
                    case 'raw-export-started':
                        // dispatch(exportRawDataStarted(payload))
                        break
                    case 'raw-export-complete':
                        dispatch(exportDataSuccess(payload))
                        break
                    case 'trips-export-started':
                        // dispatch(exportTripsDataStarted(payload))
                        break
                    case 'trips-export-complete':
                        dispatch(exportDataSuccess(payload))
                        break
                    case 'request-ack':
                        // simple handshake for opened connection
                        console.log('hello SSE')
                        break
                    default:
                        console.log('SSE message not matched.', payload.type)
                }
            } else {
                console.log('Unknown server-sent event:', e)
            }
        }

        source.onerror = function(e) { 
            console.log('SSE error.', e)
        }

        return dispatch({
            type: 'DATAMANAGEMENT-SERVER_SIDE_EVENTS_INITIALIZED'
        })
    }
}


export function teardownServerSentEvents() {
    source.close()

    return {
        type: 'DATAMANAGEMENT-SERVER_SIDE_EVENTS_DISCONNECTED'
    }    
}


// redux actions
function surveyStatusSuccess(payload) {
    let surveyStartDatetime
    if (payload.results.startTime) {
        surveyStartDatetime = Moment(payload.results.startTime)
    }

    let rawExport, tripsExport
    if (payload.results.lastExport) {
        rawExport = {
            exportStartDatetime: Moment(payload.results.lastExport.raw.exportStart),
            exportEndDatetime: Moment(payload.results.lastExport.raw.exportEnd),
            exportDatetime: Moment(payload.results.lastExport.raw.exportTime),
            exporting: payload.results.lastExport.raw.exporting,
            uri: payload.results.lastExport.raw.uri
        }
        tripsExport = {
            exportStartDatetime: Moment(payload.results.lastExport.trips.exportStart),
            exportEndDatetime: Moment(payload.results.lastExport.trips.exportEnd),
            exportDatetime: Moment(payload.results.lastExport.trips.exportTime),
            exporting: payload.results.lastExport.trips.exporting,
            uri: payload.results.lastExport.trips.uri
        }
    }

    return {
        type: 'DATAMANAGEMENT-SURVEY_STATUS_UPDATE',
        surveyStartDatetime,
        rawExport,
        tripsExport
    }
}

function surveyStatusError(error) {
    return {
        type: 'DATAMANAGEMENT-FAILED_GETTING_SURVEY_STATUS'
    }
}

export function fetchSurveyStatus() {
    return function(dispatch) {
        const params = {
            url: baseUrl + 'status',
            method: 'GET'
        }

        const jsonCallbacks = {
            begin: function() {},
            success: function(json) { dispatch(surveyStatusSuccess(json)) },
            error: function(error) { dispatch(surveyStatusError(error)) }
        }

        tokenRequest(params, jsonCallbacks)
    }
}


export function editDownloadEndDatetime(downloadEndDatetime) {
    return {
        type: 'DATAMANAGEMENT-EDIT_DOWNLOAD_END_DATETIME',
        downloadEndDatetime
    }
}

export function editDownloadStartDatetime(downloadStartDatetime) {
    return {
        type: 'DATAMANAGEMENT-EDIT_DOWNLOAD_START_DATETIME',
        downloadStartDatetime
    }
}

export function setExportType(exportType) {
    return {
        type: 'DATAMANAGEMENT-SELECTED_EXPORT_TYPE',
        exportRawDataIsSelected: exportType === 'survey'
    }
}


function exportRawDataStarted(payload) {
    return {
        type: 'DATAMANAGEMENT-RAW_DATA_IS_EXPORTING',
        payload
    }
}

function exportDataSuccess(payload) {
    const raw = {
        exportStartDatetime: Moment(payload.raw.exportStart),
        exportEndDatetime: Moment(payload.raw.exportEnd),
        exportDatetime: Moment(payload.raw.exportTime),
        exporting: payload.raw.exporting,
        uri: payload.raw.uri
    }
    const trips = {
        exportStartDatetime: Moment(payload.trips.exportStart),
        exportEndDatetime: Moment(payload.trips.exportEnd),
        exportDatetime: Moment(payload.trips.exportTime),
        exporting: payload.trips.exporting,
        uri: payload.trips.uri
    }

    return {
        type: 'DATAMANAGEMENT-EXPORT_IS_AVAILABLE',
        payload: { raw, trips }
    }
}

export function exportRawData(urlParams) {
    return function(dispatch) {
        const params = {
            url: baseApiUrl + 'data/export/raw/events' + encodeUrlData(urlParams),
            method: 'GET'
        }

        const callbacks = {
            begin: function() {
                dispatch(exportRawDataStarted(urlParams))
            },
            success: function(json) {
                // console.log('request submitted:', json) 
            },
            error: function(error) { console.log('Error initiating raw data export: ' + error ) }
        }

        tokenRequest(params, callbacks)
    }
}


function exportTripsDataStarted(payload) {
    return {
        type: 'DATAMANAGEMENT-TRIPS_DATA_IS_EXPORTING'
    }
}

export function exportTripsData(urlParams) {
    return function(dispatch) {
        const params = {
            url: baseApiUrl + 'data/export/trips/events' + encodeUrlData(urlParams),
            method: 'GET'
        }

        const callbacks = {
            begin: function() { dispatch(exportTripsDataStarted(urlParams)) },
            success: function(json) {
                // console.log('request submitted:', json)
            },
            error: function(error) { console.log('Error initiating trips data export: ' + error ) }
        }

        tokenRequest(params, callbacks)
    }
}

function updateSubwayStopsDataStatus(status) {
    return {
        type: 'DATAMANAGEMENT-SUBWAY_DATA_EXISTS',
        status
    }
}

export function fetchSubwayStopsDataStatus() {
    return function(dispatch) {
        const params = {
            url: baseApiUrl + 'itinerum/tripbreaker/subway',
            method: 'GET'
        }

        const callbacks = {
            begin: function() {},
            success: function(json) {
                dispatch(updateSubwayStopsDataStatus(json.results.stations))
            },
            error: function(error) { console.log('Error getting subway data status: ' + error ) }
        }

        tokenRequest(params, callbacks)
    }
}

export function uploadSubwayStopsData(data) {
    return function(dispatch) {
        const params = {
            url: baseApiUrl + 'itinerum/tripbreaker/subway',
            method: 'POST',
            body: data
        }

        const csvCallbacks = {
            begin: function() {},
            success: function(json) { dispatch(updateSubwayStopsDataStatus(json.results.stations)) },
            error: function(error) { console.log('Error parsing .csv file: ' + error) }
        }

        tokenFileRequest(params, csvCallbacks)
    }
}

export function deleteSubwayStopsData(data) {
    return function(dispatch) {
        const params = {
            url: baseApiUrl + 'itinerum/tripbreaker/subway',
            method: 'DELETE',
            body: undefined
        }

        const csvCallbacks = {
            begin: function() {},
            success: function(json) {
                dispatch(updateSubwayStopsDataStatus(json.results.stations)) 
            },
            error: function(error) { console.log('Error deleting subway stations: ' + error) }
        }

        tokenRequest(params, csvCallbacks)
    }
}

