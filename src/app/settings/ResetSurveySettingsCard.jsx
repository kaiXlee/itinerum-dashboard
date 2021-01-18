/*
 * components/ResetSurveySettingsCard.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { modal } from 'lib/react-redux-modal'
import Moment from  'moment'

import ResetWarningModal from 'components/ResetWarningModal'
import { styles } from './resetSurveySettingsCard.scss'


export default class ResetSurveySettingsCard extends React.Component {
    showResetWarningModal = () => {
        const titleJSX = (
            <div className="reset-warning-title">
                <i className="material-icons">warning</i>&nbsp;Alert
            </div>
        )

        modal.add(ResetWarningModal, {
            title: titleJSX,
            size: 'medium',
            closeOnOutsideClick: true,
            resetSurveyData: this.props.resetSurveyData
        })

    }

    render() {
        const surveyStartDatetime = this.props.surveyStartDatetime,
              surveyStatusText = surveyStartDatetime
                               ? `Active survey started at ${surveyStartDatetime.format("dddd, MMMM Do YYYY, h:mm:ss a")}.`
                               : 'Survey is not currently active.',
              lightActiveClass = surveyStartDatetime ? 'active' : 'inactive'

        return(
            <section className={classNames(styles)}>
                <div className="card">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="title">
                                <h3><FormattedMessage id="settings.resetSurvey.title" /></h3>
                            </div>
                            <div className="help-text">
                                <p><FormattedMessage id='settings.resetSurvey.helpText' /></p>
                                <div className="survey-status">
                                    <div className={classNames("status-light", lightActiveClass)} />
                                    <p>{surveyStatusText}</p>
                                </div>                                
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12 col-md-10 delete-button-container">
                            <button className="button medium danger"
                                    onClick={this.showResetWarningModal}>
                                <i className="material-icons button-icon">delete</i>
                                <span className="button-text">
                                    <FormattedMessage id="settings.resetSurvey.resetBtn" />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}


ResetSurveySettingsCard.propTypes = {
    resetSurveyData: PropTypes.func.isRequired,
    surveyStartDatetime: PropTypes.instanceOf(Moment)
}
