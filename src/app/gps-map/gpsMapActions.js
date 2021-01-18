/*
 * src/app/gps-map/gpsMapActions.js
 */
import { baseApiUrl } from 'utils/config'
import { tokenRequest, tokenMsgPackRequest } from 'utils/requests'
import Moment from 'moment-timezone'

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

export function setSelectedUser(uuid) {
    return {
        type: 'PARTICIPANTS-SELECTED_UUID',
        payload: uuid
    }
}

export function updateSelectedPeriod(payload) {
    return function(dispatch) {
        return dispatch({
            type: 'GPSPOINTS-SET_SELECTED_PERIOD',
            payload
        })
    }
}


function fetchUuidsSuccess(payload) {
    return {
        type: 'GPSPOINTS-UUID_DATA',
        payload: payload.results
    }
}

export function fetchUuids() {
    return function(dispatch) {
        const params = {
            url: baseUrl + 'users/',
            method: 'GET'
        }
        const jsonCallbacks = {
            begin: function() {},
            success: function(json) { dispatch(fetchUuidsSuccess(json)) },
            error: function(error) { console.log('User IDs JSON parsing failed: ' + error) }
        }
        tokenRequest(params, jsonCallbacks)
    }
}


export function setAutoPeriod(setByUser) {
    return {
        type: 'GPSPOINTS-TOGGLE_AUTO_PERIOD',
        setByUser
    }
}

export function switchMapView() {
    return {
        type: 'GPSPOINTS-TOGGLE_MAP_VIEW'
    }
}

function userPointsLoading() {
    return {
        type: 'GPSPOINTS-USER_POINTS_LOADING'
    }
}

function userPointsNoData(url) {
    return {
        type: 'GPSPOINTS-USER_POINTS_NODATA',
        url
    }
}

function userPointsSuccess(url, payload) {
    return {
        type: 'GPSPOINTS-USER_POINTS_DATA',
        data: payload.data,
        uuid: payload.uuid,
        numFeatures: payload.data.points.features[0].properties.numPoints,
        collectionStart: payload.data.collectionStart,
        collectionEnd: payload.data.collectionEnd,
        start: payload.data.start,
        end: payload.data.end,
        url
    }
}

export function fetchUserPoints(uuid, urlParams) {
    return function(dispatch) {
        let datetimeParams
        if (urlParams) {
            datetimeParams = {
                startTime: urlParams.start.toISOString(),
                endTime: urlParams.end.toISOString()
            }
        }
        const encodedParams = encodeUrlData(datetimeParams)

        const params = {
            url: baseUrl + 'users/' + uuid + '/points' + encodedParams,
            method: 'GET'
        }

        const jsonCallbacks = {
            begin: function() { dispatch(userPointsLoading()) },
            success: function(data) {
                if (data.points && data.points.features.length > 0) {
                    data.collectionStart = Moment(data.collectionStart).startOf('day')
                    data.collectionEnd = Moment(data.collectionEnd).endOf('day')
                    data.start = Moment(data.searchStart)
                    data.end = Moment(data.searchEnd)

                    const payload = { uuid, data }
                    dispatch(userPointsSuccess(params.url, payload))
                    dispatch(setSelectedUser(uuid))
                } else {
                    dispatch(userPointsNoData(params.url))
                }                
            },
            error: function(error) { console.log('User points JSON parsing failed: ' + error) }
        }
        tokenMsgPackRequest(params, jsonCallbacks)
    }
}

function userPointsLoading() {
    return {
        type: 'GPSPOINTS-USER_TRIPS_LOADING'
    }
}


function userTripsSuccess(payload) {
    return {
        type: 'GPSPOINTS-USER_TRIPS_DATA',
        data: payload,
        start: payload.start,
        end: payload.end,
    }
}

export function fetchUserTrips(uuid, urlParams) {
    /* Calls the tripbreaker on the survey for specified user and timeframe
       and returns trips as geojson */
    return function(dispatch) {
        let datetimeParams
        if (urlParams) {
            datetimeParams = {
                startTime: urlParams.start.toISOString(),
                endTime: urlParams.end.toISOString()
            }
        }
        const encodedParams = encodeUrlData(datetimeParams)
        const params = {
            url: baseUrl + 'users/' + uuid + '/trips' + encodedParams,
            method: 'GET'
        }

        const jsonCallbacks = {
            begin: function() { dispatch(userPointsLoading()) },
            success: function(data) {
                data.start = Moment(data.results.searchStart)
                data.end = Moment(data.results.searchEnd)
                dispatch(userTripsSuccess(data))
            },
            error: function(error) { console.log('User trips JSON parsing failed: ' + error) }
        }
        tokenRequest(params, jsonCallbacks)
    }    
}

export function setSelectedDetectedTripIndex(tripIndex) {
    return {
        type: 'GPSPOINTS-SELECTED_USER_TRIP_INDEX',
        tripIndex
    }
}


export function clearMap() {
    return {
        type: 'GPSPOINTS-CLEAR_MAP_DATA'
    }
}

function subwayStationsSuccess(json) {
    return {
        type: 'GPSPOINTS-SUBWAY_STATIONS_DATA',
        data: json
    }
}

function subwayStationsFailed(error) {
    console.log('Subway stations JSON parsing failed: ' + error)
    return {
        type: 'GPSPOINTS-SUBWAY_STATIONS_NODATA'
    }
}

export function fetchSubwayStations() {
    /* Retrieves subway stations as GeoJSON for display on map */
    return function(dispatch) {
        const params = {
            url: baseUrl + 'tripbreaker/subway',
            method: 'GET'
        }

        const jsonCallbacks = {
            begin: function() {},
            success: function(json) { dispatch(subwayStationsSuccess(json)) },
            error: function(error) { dispatch(subwayStationsFailed(error)) }
        }
        tokenRequest(params, jsonCallbacks)
    }

}


