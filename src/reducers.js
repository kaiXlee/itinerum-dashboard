/*
 * src/reducers/index.js
 */
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { intlReducer } from 'react-intl-redux'
import { appReducer } from 'app/appReducer'
import { loginReducer } from 'app/login/loginReducer'
import { surveyWizardReducer } from 'app/survey/surveyWizardReducer'
import { promptsReducer } from 'app/prompts/promptsReducer'
import { permissionsReducer } from 'app/dashboard-users/permissionsReducer'
import { metricsReducer } from 'app/metrics/metricsReducer'
import { participantsReducer } from 'app/mobile-participants/participantsReducer'
import { gpsMapReducer } from 'app/gps-map/gpsMapReducer'
import { dataManagementReducer } from 'app/data-management/dataManagementReducer'
import { downloaderReducer } from 'utils/downloaderReducer'
import { surveyProfileReducer } from 'app/profile/surveyProfileReducer'
import { settingsReducer } from 'app/settings/settingsReducer'
import { reducer as modalReducer } from 'lib/react-redux-modal'

const rootReducer = combineReducers({
    routing: routerReducer,
    intl: intlReducer,
    /* custom reducers */
    app: appReducer,
    login: loginReducer,
    survey: surveyWizardReducer,
    prompts: promptsReducer,
    permissions: permissionsReducer,
    metrics: metricsReducer,
    participants: participantsReducer,
    gpsMap: gpsMapReducer,
    dataManagement: dataManagementReducer,
    downloader: downloaderReducer,
    surveyProfile: surveyProfileReducer,
    settings: settingsReducer,
    modals: modalReducer
});

export default rootReducer;
