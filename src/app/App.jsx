/* 
 * src/containers/App/index.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'

import { userIsResearcher, userIsAdmin } from 'auth'
import DashboardSidebar from './DashboardSidebar'
import { DataManagement, DashboardUsers, GpsMap,
         HelpPanel, Metrics, Participants, PromptsWizard,
         Settings, SurveyProfile, SurveyBuilder, SurveyWizard } from './index'
import { logout } from './login/loginActions'

// global application styles
import './appStyles/appStyles.scss'
import './appStyles/reduxModals.scss'


@connect(
    state => state.app,
    dispatch => bindActionCreators({logout}, dispatch)
)
export default class App extends React.Component {
    static propTypes = {
        children: PropTypes.any,
        strings: PropTypes.object,
        surveyName: PropTypes.string.isRequired
    }

    render() {
        return (
            <section>
                <DashboardSidebar className="sidebar" { ...this.props } />

                {/* main frame content to right of sidebar */}
                <div className="wrapper">
                    <Switch>
                        <Route exact path="/" component={HelpPanel} />
                        <Route path='/permissions' component={userIsAdmin(DashboardUsers)} />
                        <Route path='/surveywizard' component={userIsAdmin(SurveyWizard)} />
                        <Route path='/survey-2' component={userIsAdmin(SurveyBuilder)} />
                        <Route path='/promptswizard' component={userIsAdmin(PromptsWizard)} />
                        <Route path='/metrics' component={userIsResearcher(Metrics)} />
                        <Route path='/participants' component={userIsResearcher(Participants)} />
                        <Route path='/gpsmap' component={GpsMap} />
                        <Route path='/datamanagement' component={userIsResearcher(DataManagement)} />
                        <Route path='/surveyprofile' component={userIsAdmin(SurveyProfile)} />
                        <Route path='/settings' component={userIsAdmin(Settings)} />
                        <Route path='*' component={HelpPanel} />
                    </Switch>
                </div>
            </section>
        )
    }
}


