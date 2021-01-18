/*
 * app/gps-map/GpsMapDatetimeNavigator.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Moment from 'moment-timezone'
import { modal } from 'lib/react-redux-modal'

import DatetimeDaySelect from 'components/DatetimeDaySelect'
import DatetimeSlider from 'components/DatetimeSlider'
import GpsMapSettingsModal from './GpsMapSettingsModal'
import { styles } from './gpsMapDatetimeNavigator.scss'


export default class GpsMapDatetimeNavigator extends React.Component {
    constructor() {
        super()
        this.state = {
            sliderIsSelected: true
        }
    }

    selectByDay = () => {
        this.setState({ sliderIsSelected: false })
    }

    selectSlider = () => {
        this.setState({ sliderIsSelected: true })
    }

    showSettingsModal = () => {
        modal.add(GpsMapSettingsModal, {
            title: 'Map Settings',
            size: 'large',
            closeOnOutsideClick: true,
            ...this.props.modalProps
        })
    }

    render() {      
        return(
            <section className={classNames(styles)}>
                <div className="row header-row">
                    <div className="col-xs-3 col-sm-2 col-lg-1">
                        <div className="navigator-controls">
                            <div className={classNames('datetime-nav-select', this.state.sliderIsSelected ? 'active' : undefined)}>
                                <a className={classNames('nav-link', this.state.sliderIsSelected ? 'active' : undefined)}
                                   onClick={this.selectSlider}>
                                    Timeline
                                </a>
                            </div>
                            <div className={classNames('datetime-nav-select', !this.state.sliderIsSelected ? 'active' : undefined)}>
                                <a className={classNames('nav-link', !this.state.sliderIsSelected ? 'active' : undefined)}
                                   onClick={this.selectByDay}>
                                    Daily
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-9 col-sm-10 col-md-8">
                        { this.state.sliderIsSelected ? <DatetimeSlider end={this.props.end}
                                                                        max={this.props.max}
                                                                        min={this.props.min}
                                                                        start={this.props.start}
                                                                        onChange={this.props.onChange} />
                                                      : <DatetimeDaySelect end={this.props.end}
                                                                           max={this.props.max}
                                                                           min={this.props.min}
                                                                           start={this.props.start}
                                                                           onChange={this.props.onChange} /> }
                    </div>

                    <div className="hidden-xs hidden-sm hidden-md col-lg-3">
                        <div className="control-buttons">
                            <div className="control-button-group">
                                <button className={classNames('circle-icon-button', this.props.showDetectedTrips ? 'active' : undefined)}
                                        onClick={this.props.toggleDisplayTrips}>
                                    { this.props.showDetectedTrips ? <i className="button-icon material-icons">gps_fixed</i>
                                                                   : <i className="button-icon material-icons">timeline</i> }
                                </button>

                                <span className="button-text">
                                    { this.props.showDetectedTrips ? <FormattedMessage id="gpsPoints.settings.showPoints" />
                                                                   : <FormattedMessage id="gpsPoints.settings.detectTrips" /> }
                                </span>
                            </div>

                            <div className="control-button-group">
                                <button className={classNames('circle-icon-button')}
                                        onClick={this.showSettingsModal}>
                                    <i className="button-icon material-icons">settings</i>
                                </button>

                                <span className="button-text">
                                    <FormattedMessage id="gpsPoints.settings.parameters" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}


GpsMapDatetimeNavigator.propTypes = {
    end: PropTypes.instanceOf(Moment).isRequired,
    max: PropTypes.instanceOf(Moment).isRequired,
    min: PropTypes.instanceOf(Moment).isRequired,
    modalProps: PropTypes.shape({
        editTripbreakerInterval: PropTypes.func.isRequired,
        editTripbreakerSubwayBuffer: PropTypes.func.isRequired,
        isEdited: PropTypes.bool.isRequired,
        isSaving: PropTypes.bool.isRequired,
        saveSettings: PropTypes.func.isRequired,
        tripbreakerIntervalSeconds: PropTypes.number.isRequired,
        tripbreakerSubwayBufferMeters: PropTypes.number.isRequired
    }),
    onChange: PropTypes.func.isRequired,
    showDetectedTrips: PropTypes.bool.isRequired,
    start: PropTypes.instanceOf(Moment).isRequired,
    toggleDisplayTrips: PropTypes.func.isRequired
}
