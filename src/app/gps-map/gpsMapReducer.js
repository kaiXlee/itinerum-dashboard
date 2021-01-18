/*
 * src/app/gps-map/gpsMapReducer.js
 */
import update from 'react/lib/update'
import Moment from 'moment-timezone'


const initialState = {
    allUuids: [],
    loadingData: false,
    mapper: {
        cancelledPrompts: {},
        center: [45.5, -73.566],
        gpsPoints: {},
        promptResponses: {},
        selectedDetectedTripIndex: undefined, 
        showDetectedTrips: false,
        subwayStations: {},
        subwayStationsBuffer: 0,
        tileLayerUrl: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
        tripLines: {}
    },
    period: {
        collectionStart: Moment().startOf('day'),
        collectionEnd: Moment().endOf('day'),
        start: Moment().startOf('day'),
        end: Moment().startOf('day')
    }
}


export function gpsMapReducer(state = initialState, action) {
    switch (action.type) {
        case 'GPSPOINTS-CLEAR_MAP_DATA':
            return update(state, {
                mapper: {
                    $merge: {
                        gpsPoints: {},
                        promptResponses: {},
                        cancelledPrompts: {},
                        tripLines: {},
                        showDetectedTrips: false,
                    }
                }
            })

        case 'GPSPOINTS-UUID_DATA':
            return Object.assign({}, state, {
                allUuids: action.payload
            })

        case 'GPSPOINTS-SET_SELECTED_PERIOD':
            return update(state, {
                period: {
                    $merge: { ...action.payload }
                }
            })

        case 'GPSPOINTS-TOGGLE_MAP_VIEW':
            return update(state, {
                mapper: {
                    showDetectedTrips: { $set: !state.mapper.showDetectedTrips }
                }
            })

        case 'GPSPOINTS-USER_POINTS_LOADING':
            return update(state, {
                loadingData: { $set: true }
            })

        case 'GPSPOINTS-USER_POINTS_NODATA':
            return update(state, {
                mapper: {
                    $merge: {
                        gpsPoints: {},
                        promptResponses: {},
                        cancelledPrompts: {},
                        tripLines: {}
                    }
                },
                loadingData: { $set: false }

            })

        case 'GPSPOINTS-USER_POINTS_DATA':
            return update(state, {
                mapper: {
                    $merge: {
                        gpsPoints: action.data.points,
                        promptResponses: action.data.promptResponses,
                        cancelledPrompts: action.data.cancelledPrompts,
                        tripLines: {}
                    }
                },
                period: {
                    $merge: {
                        collectionStart: action.collectionStart,
                        collectionEnd: action.collectionEnd,
                        start: action.start,
                        end: action.end
                    }
                },
                loadingData: { $set: false }
            })

        case 'GPSPOINTS-USER_TRIPS_LOADING':
            return update(state, {
                loadingData: { $set: true }
            })            

        case 'GPSPOINTS-USER_TRIPS_DATA':
            return update(state, {
                mapper: {
                    $merge: {
                        tripLines: action.data.results.trips
                    }
                },
                period: {
                    $merge: {
                        start: action.start,
                        end: action.end
                    }
                },
                loadingData: { $set: false }
            })

        case 'GPSPOINTS-SELECTED_USER_TRIP_INDEX':
            return update(state, {
                mapper: {
                    $merge: {
                        selectedDetectedTripIndex: action.tripIndex
                    }
                }
            })

        case 'GPSPOINTS-SUBWAY_STATIONS_DATA':
            return update(state, {
                mapper: {
                    $merge: {
                        subwayStations: action.data.results.stations,
                        subwayStationsBuffer: action.data.results.bufferSize
                    }
                }                      
            })

        case 'LOGIN-USER_LOGOUT':
            return update(state, {
                mapper: { $set: initialState.mapper }
            })

        case 'SETTINGS-EDIT_TRIPBREAKER_SUBWAY_BUFFER':
            return update(state, {
                mapper: {
                    $merge: {
                        subwayStationsBuffer: action.tripbreakerSubwayBufferMeters,
                    }
                }
            })

        default:
            return state

    }
}
