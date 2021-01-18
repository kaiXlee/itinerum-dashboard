/*
 * src/containers/Panels/Settings/settingsReducer.js
 */
import update from 'react/lib/update'


const initialState = {
    surveyStartDatetime: undefined,
    aboutText: '',
    termsOfService: '',
    contactEmail: '',
    gpsAccuracyThresholdMeters: 0,
    isEdited: false,
    isSaving: false,
    surveyMaxDays: 0,
    surveyMaxPrompts: 0,
    tripbreakerColdStartDistanceMeters: 0,
    tripbreakerIntervalSeconds: 0,
    tripbreakerSubwayBufferMeters: 0
}


export function settingsReducer(state = initialState, action) {
    switch(action.type) {
        case 'SETTINGS-EDIT_ABOUT_TEXT':
            return update(state, {
                $merge: {
                    aboutText: action.aboutText,
                    isEdited: true
                }
            })

        case 'SETTINGS-EDIT_CONTACT_EMAIL':
            return update(state, {
                $merge: {
                    contactEmail: action.email,
                    isEdited: true
                }
            })

        case 'SETTINGS-EDIT_SURVEY_MAX_DAYS':
            return update(state, {
                $merge: {
                    surveyMaxDays: action.surveyMaxDays,
                    isEdited: true
                }                
            })

        case 'SETTINGS-EDIT_SURVEY_MAX_PROMPTS':
            return update(state, {
                $merge: {
                    surveyMaxPrompts: action.surveyMaxPrompts,
                    isEdited: true
                }
            })

        case 'SETTINGS-EDIT_TERMS_OF_SERVICE':
            return update(state, {
                $merge: {
                    termsOfService: action.termsOfService,
                    isEdited: true
                }
            })            

        case 'SETTINGS-EDIT_GPS_ACCURACY_THRESHOLD':
            return update(state, {
                $merge: {
                    gpsAccuracyThresholdMeters: action.gpsAccuracyThresholdMeters
                }
            })

        case 'SETTINGS-EDIT_TRIPBREAKER_COLD_START_DISTANCE':
            return update(state, {
                $merge: {
                    tripbreakerColdStartDistanceMeters: action.tripbreakerColdStartDistanceMeters
                }
            })

        case 'SETTINGS-EDIT_TRIPBREAKER_INTERVAL':
            return update(state, {
                $merge: {
                    tripbreakerIntervalSeconds: action.tripbreakerIntervalSeconds,
                    isEdited: true
                }
            })

        case 'SETTINGS-EDIT_TRIPBREAKER_SUBWAY_BUFFER':
            return update(state, {
                $merge: {
                    tripbreakerSubwayBufferMeters: action.tripbreakerSubwayBufferMeters,
                    isEdited: true
                }
            })

        case 'SETTINGS-FETCHED_PARAMETERS':
            return update(state, {
                $merge: { ...action.payload }
            })

        case 'SETTINGS-PAGE_IS_SAVING':
            return update(state, {
                $merge: {
                    isSaving: true
                }
            })

        case 'SETTINGS-SAVE_SUCCESSFUL':
            return update(state, {
                $merge: {
                    isEdited: false,
                    isSaving: false,
                    aboutText: action.payload.aboutText,
                    termsOfService: action.payload.termsOfService,
                    contactEmail: action.payload.contactEmail,
                    gpsAccuracyThresholdMeters: parseInt(action.payload.gpsAccuracyMeters),
                    surveyStartDatetime: action.payload.surveyStartDatetime,
                    surveyMaxDays: parseInt(action.payload.surveyMaxDays),
                    surveyMaxPrompts: parseInt(action.payload.surveyMaxPrompts),
                    tripbreakerColdStartDistanceMeters: parseInt(action.payload.tripbreakerColdStartMeters),
                    tripbreakerIntervalSeconds: parseInt(action.payload.tripbreakerIntervalSeconds),
                    tripbreakerSubwayBufferMeters: parseInt(action.payload.tripbreakerSubwayBufferMeters)
                }                
            })

        case 'SETTINGS-SAVE_FAILED': {
            return update(state, {
                $merge: {
                    isSaving: false
                }                
            })
        }

        case 'SETTINGS-SURVEY_RESET_SUCCESS':
            return update(state, {
                surveyStartDatetime: { $set: undefined }
            })

        default:
            return state
    }
}