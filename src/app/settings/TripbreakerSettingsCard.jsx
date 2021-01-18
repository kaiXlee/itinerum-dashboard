/*
 * components/TripbreakerSettingsCard.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import SaveButton from 'components/SaveButton'
import { styles } from './tripbreakerSettingsCard.scss'


export default class TripbreakerSettingsCard extends React.Component {
    render() {
        return(
            <section className={classNames(styles)}>
                <div className="card">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="title">
                                <h4><FormattedMessage id="settings.tripbreaker.title" /></h4>
                            </div>
                            <div className="help-text">
                                <p></p>
                            </div>
                        </div>
                    </div>

                    <div className="row equal">
                        <div className="col-xs-4 col-sm-6">
                            <label><FormattedMessage id="settings.tripbreaker.gpsAccuracyLabel" /></label>
                        </div>
                        <div className="col-xs-8 col-sm-4 col-md-3 col-lg-3">
                            <input className="i-input icon-field"
                                   type="number"
                                   onChange={(e) => this.props.editGpsAccuracyThreshold(parseInt(e.target.value))}
                                   min={0}
                                   value={this.props.gpsAccuracyThresholdMeters} />
                            <i className="material-icons i-input-icon">network_check</i>
                        </div>
                    </div>

                    <div className="row equal">
                        <div className="col-xs-4 col-sm-6">
                            <label><FormattedMessage id="settings.tripbreaker.breakPeriodLabel" /></label>
                        </div>
                        <div className="col-xs-8 col-sm-4 col-md-3 col-lg-3">
                            <input className="i-input icon-field"
                                   type="number"
                                   onChange={(e) => this.props.editTripbreakerInterval(parseInt(e.target.value))}
                                   min={0}
                                   value={this.props.tripbreakerIntervalSeconds} />
                            <i className="material-icons i-input-icon">timer</i>
                        </div>
                    </div>

                    <div className="row equal">
                        <div className="col-xs-4 col-sm-6">
                            <label><FormattedMessage id="settings.tripbreaker.coldStartLabel" /></label>
                        </div>
                        <div className="col-xs-8 col-sm-4 col-md-3 col-lg-3">
                            <input className="i-input icon-field"
                                   type="number"
                                   onChange={(e) => this.props.editTripbreakerColdStartDistance(parseInt(e.target.value))}
                                   min={0}
                                   value={this.props.tripbreakerColdStartDistanceMeters} />
                            <i className="material-icons i-input-icon">straighten</i>
                        </div>
                    </div>

                    <div className="row equal">
                        <div className="col-xs-4 col-sm-6">
                            <label><FormattedMessage id="settings.tripbreaker.subwayBufferLabel" /></label>
                        </div>
                        <div className="col-xs-8 col-sm-4 col-md-3 col-lg-3">
                            <input className="i-input icon-field"
                                   type="number"
                                   onChange={(e) => this.props.editTripbreakerSubwayBuffer(parseInt(e.target.value))}
                                   min={0}
                                   value={this.props.tripbreakerSubwayBufferMeters} />
                            <i className="material-icons i-input-icon">straighten</i>
                        </div>
                    </div>
                    {/* Save button */}
                    <div className="row">
                        <div className="col-xs-12 col-sm-10 col-md-9">
                            <SaveButton classNames="pull-right"
                                        isEdited={this.props.isEdited}
                                        isSaving={this.props.isSaving}
                                        save={this.props.saveSettings} />
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}


TripbreakerSettingsCard.propTypes = {
    editGpsAccuracyThreshold: PropTypes.func.isRequired,
    editTripbreakerColdStartDistance: PropTypes.func.isRequired,
    editTripbreakerInterval: PropTypes.func.isRequired,
    editTripbreakerSubwayBuffer: PropTypes.func.isRequired,
    gpsAccuracyThresholdMeters: PropTypes.number.isRequired,
    isEdited: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    tripbreakerColdStartDistanceMeters: PropTypes.number.isRequired,
    tripbreakerIntervalSeconds: PropTypes.number.isRequired,
    tripbreakerSubwayBufferMeters: PropTypes.number.isRequired
}
