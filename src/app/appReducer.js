/*
 * src/reducers/appReducer.js
 */
import update from 'react/lib/update'

const initialState = {
    currentPage: 'home',
    surveyName: localStorage.getItem('dmdashboard-survey') || 'Please re-login',
    sidebar: {
        menu: [
            {icon: 'mdi-key-variant', textId: 'app.sidebar.pages.permissions', url: '/permissions', userLevel: 0},
            {icon: 'mdi-star-circle', textId: 'app.sidebar.pages.surveyWizard', url: '/surveywizard', userLevel: 0},
            {icon: 'mdi-flag-variant', textId: 'app.sidebar.pages.prompts', url: '/promptswizard', userLevel: 0},
            {icon: 'mdi-chart-areaspline', textId: 'app.sidebar.pages.metrics', url: '/metrics', userLevel: 1},
            {icon: 'mdi-face', textId: 'app.sidebar.pages.participants', url: '/participants', userLevel: 1},
            {icon: 'mdi-crosshairs-gps', textId: 'app.sidebar.pages.gpsPoints', url: '/gpsmap', userLevel: 2},
            {icon: 'mdi-cloud-download', textId: 'app.sidebar.pages.dataManagement', url: '/datamanagement', userLevel: 1}
        ],
        settings: {icon: 'mdi-settings', textId: 'app.sidebar.pages.settings', url: '/settings', userLevel: 1}
    },
    userLevel: 5
}

export function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'LOGIN-USER_LOGIN_SUCCESS':
            return update(state, {
                $merge: {
                    surveyName: action.payload.surveyName
                }
            })

        case 'LOGIN-SET_USER_LEVEL':
            return update(state, {
                $merge: {
                    userLevel: action.payload
                }
            })

        default:
            return state
    }
}
