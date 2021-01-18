/*
 * src/reducers/metricsReducer.js
 */
import update from 'react/lib/update'
import Moment from  'moment-timezone'

const initialState = {
    periodType: 'days',
    periodsNum: 7,
    startDatetime: Moment().subtract(7, 'days'),
    endDatetime: Moment(),
    surveyStats: [],
    signupsData: {
        labels: [],
        datasets: []
    },
    activeUsersData: []
}

export function metricsReducer(state = initialState, action) {
    switch (action.type) {
        case 'METRICS-FETCHED_DATA_SUCCESS':
            return update(state, {
                $merge: {
                    surveyStats: action.payload.overview ? action.payload.overview : state.surveyStats,
                    signupsData: action.payload.installationsBarGraph,
                    activeUsersData: action.payload.activeUsersLineGraph
                }
            })

        case 'METRICS-SET_DATETIME_PERIOD_TYPE':
            return update(state, {
                $merge: { ...action.payload }
            })

        case 'METRICS-SET_DATETIME_PERIOD_NUM':
            return update(state, {
                $merge: { ...action.payload }
            })

        default:
            return state
    }
}