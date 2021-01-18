/*
 * src/app/help-panel/Tutorial.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'

import { styles } from './tutorialStyles.scss'


export default class TutorialComponent extends React.Component {
    render() {
        return(
            <section className={classNames(styles)}>
                <div className="content-wrapper">
                    <div className="row">
                        {/* bootstrap grid as margin */}
                        <div className="col-xs-2" />

                        <div className="col-xs-12 col-md-10 col-lg-8">
                            {/* create new grids for laying out tutorial */}
                            <div className="row">
                                <div className="col-xs-12 text-center tutorial-title">
                                    <h2><b><FormattedMessage id='tutorial.title' /></b></h2>
                                </div>
                            </div>

                            {/* Permissions guide */}
                            <div className="row tutorial-row">
                                <div className="col-xs-12 col-sm-6">
                                    <b><FormattedMessage id='tutorial.cards.permissions.title' /></b>
                                    <p><FormattedMessage id='tutorial.cards.permissions.text' /></p>
                                </div>
                                <div className="col-xs-12 col-sm-6 help-icon">
                                    <i className="mdi mdi-key-variant" />
                                </div>
                            </div>

                            {/* Survey wizard guide */}
                            <div className="row tutorial-row">
                                <div className="col-xs-12 col-sm-6 help-icon">
                                    <i className="mdi mdi-star-circle" />
                                </div>
                                <div className="col-xs-12 col-sm-6">
                                    <b><FormattedMessage id='tutorial.cards.surveyWizard.title' /></b>
                                    <p><FormattedMessage id='tutorial.cards.surveyWizard.text' /></p>
                                </div>
                            </div>

                            {/* Survey Stats guide */}
                            <div className="row tutorial-row">
                                <div className="col-xs-12 col-sm-6">
                                    <b><FormattedMessage id='tutorial.cards.metrics.title' /></b>
                                    <p><FormattedMessage id='tutorial.cards.metrics.text' /></p>
                                </div>
                                <div className="col-xs-12 col-sm-6 help-icon">
                                    <i className="mdi mdi-chart-areaspline" />
                                </div>
                            </div>

                            {/* Participants guide */}
                            <div className="row tutorial-row">
                                <div className="col-xs-12 col-sm-6 help-icon">
                                    <i className="mdi mdi-face" />
                                </div>
                                <div className="col-xs-12 col-sm-6">
                                    <b><FormattedMessage id='tutorial.cards.participants.title' /></b>
                                    <p><FormattedMessage id='tutorial.cards.participants.text' /></p>
                                </div>
                            </div>

                            {/* GPS Points guide */}
                            <div className="row tutorial-row">
                                <div className="col-xs-12 col-sm-6">
                                    <b><FormattedMessage id='tutorial.cards.gpsPoints.title' /></b>
                                    <p><FormattedMessage id='tutorial.cards.gpsPoints.text' /></p>
                                </div>
                                <div className="col-xs-12 col-sm-6 help-icon">
                                    <i className="mdi mdi-crosshairs-gps" />
                                </div>
                            </div>

                            {/* Data Management guide */}
                            <div className="row tutorial-row">
                                <div className="col-xs-12 col-sm-6 help-icon">
                                    <i className="mdi mdi-cloud-download" />
                                </div>
                                <div className="col-xs-12 col-sm-6">
                                    <b><FormattedMessage id='tutorial.cards.dataManagement.title' /></b>
                                    <p><FormattedMessage id='tutorial.cards.dataManagement.text' /></p>
                                </div>                                
                            </div>

                        </div>

                        {/* bootstrap grid as margin */}
                        <div className="col-xs-2" />
                    </div>
                </div>
            </section>
        )
    }
}
