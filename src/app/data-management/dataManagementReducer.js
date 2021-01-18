/*
 * src/app/data-management/dataManagementReducer.js
 */
import update from 'react/lib/update'
import Moment from 'moment-timezone'
import uuid from 'uuid'


const initialState = {
    sseChannelName: uuid.v4(),
    databaseSubwayStopsData: {
        features: []
    },
    downloadStartDatetime: Moment(),
    downloadEndDatetime: Moment(),
    exportRawDataIsSelected: true,
    exportsAvailable: {
        raw: {},
        trips: {}
    },
    surveyStartDatetime: undefined,
    surveyEndDatetime: undefined,
    userTimezone: Moment.tz.guess()
}

export function dataManagementReducer(state = initialState, action) {
    switch (action.type) {
        case 'DATAMANAGEMENT-EDIT_DOWNLOAD_START_DATETIME':
            return update(state, {
                downloadStartDatetime: { $set: action.downloadStartDatetime }
            })

        case 'DATAMANAGEMENT-EDIT_DOWNLOAD_END_DATETIME':
            return update(state, {
                downloadEndDatetime: { $set: action.downloadEndDatetime }
            })            

        case 'DATAMANAGEMENT-RAW_DATA_IS_EXPORTING':
            return update(state, {
                $merge: {
                    exportsAvailable: {
                        ...state.exportsAvailable,
                        raw: {
                            ...state.exportsAvailable.raw,
                            exportTime: Moment(),
                            exporting: true
                        }
                    }
                }
            })

        case 'DATAMANAGEMENT-TRIPS_DATA_IS_EXPORTING':
            return update(state, {
                $merge: {
                    exportsAvailable: {
                        ...state.exportsAvailable,
                        trips: {
                            ...state.exportsAvailable.trips,
                            exportTime: Moment(),
                            exporting: true
                        }
                    }
                }
            })            

        case 'DATAMANAGEMENT-EXPORT_IS_AVAILABLE':
            return update(state, {
                $merge: {
                    exportsAvailable: action.payload
                }
            })

        case 'DATAMANAGEMENT-SUBWAY_DATA_EXISTS':
            return update(state, {
                $merge: {
                    databaseSubwayStopsData: action.status
                }
            })

        case 'DATAMANAGEMENT-SURVEY_STATUS_UPDATE':
            const rawExport = action.rawExport ? action.rawExport : {},
                  tripsExport = action.tripsExport ? action.tripsExport : {}

            return update(state, {
                $merge: {
                    surveyStartDatetime: action.surveyStartDatetime,
                    surveyEndDatetime: action.surveyEndDatetime || Moment(),
                    downloadStartDatetime: action.surveyStartDatetime || Moment(),
                    downloadEndDatetime: action.surveyEndDatetime || Moment(),
                    exportsAvailable: {
                        raw: rawExport,
                        trips: tripsExport
                    }
                }
            })

        case 'DATAMANAGEMENT-SELECTED_EXPORT_TYPE':
            return update(state, {
                exportRawDataIsSelected: { $set: action.exportRawDataIsSelected }
            })

        default:
            return state
    }
}