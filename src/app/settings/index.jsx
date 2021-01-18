/*
 * src/containers/Panels/Settings/index.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import Moment from  'moment'

import * as actionCreators from './settingsActions'
import SurveySettingsCard from './SurveySettingsCard'
import TripbreakerSettingsCard from './TripbreakerSettingsCard'
import ResetSurveySettingsCard from './ResetSurveySettingsCard'
import { baseStyles } from 'app/appStyles/baseStyles.scss'

@connect(
    state => state.settings,
    dispatch => bindActionCreators(actionCreators, dispatch)
)
export default class SettingsView extends React.Component {
    static propTypes = {
        aboutText: PropTypes.string,
        contactEmail: PropTypes.string.isRequired,
        editAboutText: PropTypes.func.isRequired,
        editContactEmail: PropTypes.func.isRequired,
        editGpsAccuracyThreshold: PropTypes.func.isRequired,
        editSurveyMaxDays: PropTypes.func.isRequired,
        editSurveyMaxPrompts: PropTypes.func.isRequired,
        editTermsOfService: PropTypes.func.isRequired,
        editTripbreakerColdStartDistance: PropTypes.func.isRequired,
        editTripbreakerInterval: PropTypes.func.isRequired,
        editTripbreakerSubwayBuffer: PropTypes.func.isRequired,
        fetchSettings: PropTypes.func.isRequired,
        gpsAccuracyThresholdMeters: PropTypes.number.isRequired,
        isEdited: PropTypes.bool.isRequired,
        isSaving: PropTypes.bool.isRequired,
        saveSettings: PropTypes.func.isRequired,
        resetSurveyData: PropTypes.func.isRequired,
        surveyMaxDays: PropTypes.number.isRequired,
        surveyMaxPrompts: PropTypes.number.isRequired,
        surveyStartDatetime: PropTypes.instanceOf(Moment),
        termsOfService: PropTypes.string,
        tripbreakerColdStartDistanceMeters: PropTypes.number.isRequired,
        tripbreakerIntervalSeconds: PropTypes.number.isRequired,
        tripbreakerSubwayBufferMeters: PropTypes.number.isRequired
    }

    componentDidMount() {
        this.props.fetchSettings()
    }

    handleSaveSettings = () => {
        const settings = {
            aboutText: this.props.aboutText,
            contactEmail: this.props.contactEmail,
            gpsAccuracyThresholdMeters: this.props.gpsAccuracyThresholdMeters,
            surveyMaxDays: this.props.surveyMaxDays,
            surveyMaxPrompts: this.props.surveyMaxPrompts,
            termsOfService: this.props.termsOfService,
            tripbreakerColdStartDistanceMeters: this.props.tripbreakerColdStartDistanceMeters,
            tripbreakerIntervalSeconds: this.props.tripbreakerIntervalSeconds,
            tripbreakerSubwayBufferMeters: this.props.tripbreakerSubwayBufferMeters
        }
        this.props.saveSettings(settings)
    }

    render() {
        return(
            <div className={classNames(baseStyles)}>
                <div className="content-wrapper">
                    <a name="survey" />
                    <SurveySettingsCard aboutText={this.props.aboutText}
                                        contactEmail={this.props.contactEmail}
                                        editAboutText={this.props.editAboutText}
                                        editContactEmail={this.props.editContactEmail}
                                        editSurveyMaxDays={this.props.editSurveyMaxDays}
                                        editSurveyMaxPrompts={this.props.editSurveyMaxPrompts}
                                        editTermsOfService={this.props.editTermsOfService}
                                        isEdited={this.props.isEdited}
                                        isSaving={this.props.isSaving}
                                        saveSettings={this.handleSaveSettings}
                                        surveyMaxDays={this.props.surveyMaxDays}
                                        surveyMaxPrompts={this.props.surveyMaxPrompts}
                                        termsOfService={this.props.termsOfService} />

                    <a name="tripbreaker" />
                    <TripbreakerSettingsCard editGpsAccuracyThreshold={this.props.editGpsAccuracyThreshold}
                                             editTripbreakerColdStartDistance={this.props.editTripbreakerColdStartDistance}
                                             editTripbreakerInterval={this.props.editTripbreakerInterval}
                                             editTripbreakerSubwayBuffer={this.props.editTripbreakerSubwayBuffer}
                                             gpsAccuracyThresholdMeters={this.props.gpsAccuracyThresholdMeters}
                                             isEdited={this.props.isEdited}
                                             isSaving={this.props.isSaving}
                                             saveSettings={this.handleSaveSettings}
                                             tripbreakerColdStartDistanceMeters={this.props.tripbreakerColdStartDistanceMeters}
                                             tripbreakerIntervalSeconds={this.props.tripbreakerIntervalSeconds}
                                             tripbreakerSubwayBufferMeters={this.props.tripbreakerSubwayBufferMeters} />

                    <ResetSurveySettingsCard resetSurveyData={this.props.resetSurveyData}
                                             surveyStartDatetime={this.props.surveyStartDatetime} />
                </div>
            </div>
        )
    }
}