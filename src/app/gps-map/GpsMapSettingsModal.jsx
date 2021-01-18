/*
 * src/app/gps-map/GpsMapSettingsModal.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import SaveButton from 'components/SaveButton'
import { baseStyles } from 'app/appStyles/baseStyles.scss'
import { styles } from './gpsMapSettingsModal.scss'


@connect(state => state.settings)
export default class GpsMapSettingsModal extends React.Component {
	handleSaveSettings = () => {
		const settings = {
            contactEmail: this.props.contactEmail,
            surveyMaxDays: this.props.surveyMaxDays,
            surveyMaxPrompts: this.props.surveyMaxPrompts,
            gpsAccuracyThresholdMeters: this.props.gpsAccuracyThresholdMeters,
            tripbreakerColdStartDistanceMeters: this.props.tripbreakerColdStartDistanceMeters,
            tripbreakerIntervalSeconds: this.props.tripbreakerIntervalSeconds,
            tripbreakerSubwayBufferMeters: this.props.tripbreakerSubwayBufferMeters
		}
		this.props.saveSettings(settings)
	}

	render() {
		return(
			<section className={classNames(baseStyles, styles)}>
				<div className="modal-body">
                    {/* GPS Accuracy -- seperate since this affect both map views */}
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

                    {/* Tripbreaker settings */}
					<div className="section-title">
						<h4><FormattedMessage id="settings.tripbreaker.title" /></h4>
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
				</div>

				{/* Save/Cancel buttons */}
				<div className="modal-footer">
                    <div className="row">
                        <div className="col-xs-12 col-sm-10 col-md-9">
                            <SaveButton classNames="pull-right"
                                        isEdited={this.props.isEdited}
                                        isSaving={this.props.isSaving}
                                        save={this.handleSaveSettings} />
                        </div>
                    </div>
				</div>
			</section>
		)
	}
}

GpsMapSettingsModal.propTypes = {
    contactEmail: PropTypes.string.isRequired,
    editGpsAccuracyThreshold: PropTypes.func.isRequired,
    editTripbreakerColdStartDistance: PropTypes.func.isRequired,
    editTripbreakerInterval: PropTypes.func.isRequired,
    editTripbreakerSubwayBuffer: PropTypes.func.isRequired,
    isEdited: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    gpsAccuracyThresholdMeters: PropTypes.number.isRequired,
    saveSettings: PropTypes.func.isRequired,
    surveyMaxDays: PropTypes.number.isRequired,
    surveyMaxPrompts: PropTypes.number.isRequired,
    tripbreakerColdStartDistanceMeters: PropTypes.number.isRequired,
    tripbreakerIntervalSeconds: PropTypes.number.isRequired,
    tripbreakerSubwayBufferMeters: PropTypes.number.isRequired
}
