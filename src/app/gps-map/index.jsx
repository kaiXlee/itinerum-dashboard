/*
 * src/app/gps-map/index.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Moment from 'moment-timezone'

import * as gpsMapActionCreators from './gpsMapActions'
import * as settingsActionCreators from 'app/settings/settingsActions'
import GpsMap from './GpsMap'
import GpsMapDatetimeNavigator from './GpsMapDatetimeNavigator'
import { baseStyles } from 'app/appStyles/baseStyles.scss'


const mapStateToProps = (state) => {
    return {
        participants: state.participants,
        gpsMap: state.gpsMap,
        settings: state.settings
    }
}

@connect(
    state => mapStateToProps(state),
    dispatch => bindActionCreators({ ...gpsMapActionCreators, ...settingsActionCreators}, dispatch)
)
export default class GpsMapView extends React.Component {
    static propTypes = {
        clearMap: PropTypes.func.isRequired,
        editGpsAccuracyThreshold: PropTypes.func.isRequired,
        editTripbreakerColdStartDistance: PropTypes.func.isRequired,
        editTripbreakerInterval: PropTypes.func.isRequired,
        editTripbreakerSubwayBuffer: PropTypes.func.isRequired,
        fetchSettings: PropTypes.func.isRequired,
        fetchUserPoints: PropTypes.func.isRequired,
        fetchUserTrips: PropTypes.func.isRequired,
        fetchUuids: PropTypes.func.isRequired,
        gpsMap: PropTypes.shape({
            allUuids: PropTypes.array.isRequired,
            loadingData: PropTypes.bool.isRequired,
            mapper: PropTypes.shape({
                cancelledPrompts: PropTypes.object.isRequired,
                center: PropTypes.array.isRequired,
                gpsPoints: PropTypes.object.isRequired,
                promptResponses: PropTypes.object.isRequired,
                selectedDetectedTripIndex: PropTypes.number,
                showDetectedTrips: PropTypes.bool.isRequired,
                subwayStations: PropTypes.object.isRequired,
                subwayStationsBuffer: PropTypes.number.isRequired,
                tileLayerUrl: PropTypes.string.isRequired,
                tripLines: PropTypes.object.isRequired
            }),
            period: PropTypes.shape({
                collectionEnd: PropTypes.instanceOf(Moment).isRequired,
                collectionStart: PropTypes.instanceOf(Moment).isRequired,
                end: PropTypes.instanceOf(Moment).isRequired,
                start: PropTypes.instanceOf(Moment).isRequired,
            }),
        }),
        participants: PropTypes.shape({
            selectedUuid: PropTypes.string,
            mobileUsers: PropTypes.array.isRequired
        }),
        saveSettings: PropTypes.func.isRequired,
        setSelectedDetectedTripIndex: PropTypes.func.isRequired,
        setSelectedUser: PropTypes.func.isRequired,
        settings: PropTypes.shape({
            contactEmail: PropTypes.string.isRequired,
            isEdited: PropTypes.bool.isRequired,
            isSaving: PropTypes.bool.isRequired,
            gpsAccuracyThresholdMeters: PropTypes.number.isRequired,
            surveyMaxDays: PropTypes.number.isRequired,
            surveyMaxPrompts: PropTypes.number.isRequired,
            tripbreakerColdStartDistanceMeters: PropTypes.number.isRequired,
            tripbreakerIntervalSeconds: PropTypes.number.isRequired,
            tripbreakerSubwayBufferMeters: PropTypes.number.isRequired  
        }),
        switchMapView: PropTypes.func.isRequired,
        updateSelectedPeriod: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.props.fetchUuids()
        this.props.fetchSubwayStations()

        if (this.props.participants.selectedUuid) {
            this.props.fetchUserPoints(this.props.participants.selectedUuid)
        }

        this.props.fetchSettings()
    }

    handleFetchMapFeatures = (uuid, selectedPeriod) => {
        this.props.setSelectedDetectedTripIndex()

        if (this.props.gpsMap.mapper.showDetectedTrips) {
            if (!selectedPeriod) {
                selectedPeriod = {
                    end: this.props.gpsMap.period.end,
                    start: this.props.gpsMap.period.start
                }
            }
            return this.props.fetchUserTrips(uuid, selectedPeriod)
        }
        return this.props.fetchUserPoints(uuid, selectedPeriod)
    }

    handleSwitchMapView = () => {
        const showDetectedTrips = !this.props.gpsMap.mapper.showDetectedTrips,
              uuid = this.props.participants.selectedUuid,
              selectedPeriod = {
                  end: this.props.gpsMap.period.end,
                  start: this.props.gpsMap.period.start
              }

        if (!uuid) return
        
        if (showDetectedTrips) {
            this.props.fetchUserTrips(uuid, selectedPeriod)
        } else {
            this.props.fetchUserPoints(uuid, selectedPeriod)
        }
        this.props.switchMapView()
    }

    handleUpdateSelectedPeriod = (selectedPeriod) => {
        if (this.props.participants.selectedUuid) {
            this.handleFetchMapFeatures(this.props.participants.selectedUuid, selectedPeriod)
            this.props.updateSelectedPeriod(selectedPeriod)
        }
    }

    render() {
        const modalProps = {
            ...this.props.settings,
            editGpsAccuracyThreshold: this.props.editGpsAccuracyThreshold,
            editTripbreakerColdStartDistance: this.props.editTripbreakerColdStartDistance,
            editTripbreakerInterval: this.props.editTripbreakerInterval,
            editTripbreakerSubwayBuffer: this.props.editTripbreakerSubwayBuffer,
            saveSettings: this.props.saveSettings
        }

        return(
            <section className={classNames(baseStyles, 'container-fluid')}>
                <div className="row no-gutters">
                    <div className="col-xs-12">
                        <GpsMapDatetimeNavigator end={this.props.gpsMap.period.end}
                                                 min={this.props.gpsMap.period.collectionStart}
                                                 max={this.props.gpsMap.period.collectionEnd}
                                                 modalProps={modalProps}
                                                 onChange={this.handleUpdateSelectedPeriod}
                                                 showDetectedTrips={this.props.gpsMap.mapper.showDetectedTrips}
                                                 start={this.props.gpsMap.period.start}
                                                 toggleDisplayTrips={this.handleSwitchMapView} />
                    </div>
                </div>

                <div className="row no-gutters">
                    <div className="col-xs-12">
                        <GpsMap cancelledPrompts={this.props.gpsMap.mapper.cancelledPrompts}
                                clearMap={this.props.clearMap}
                                mapCenter={this.props.gpsMap.mapper.center}
                                mapTileLayerUrl={this.props.gpsMap.mapper.tileLayerUrl}
                                gpsPoints={this.props.gpsMap.mapper.gpsPoints}
                                loadingData={this.props.gpsMap.loadingData}
                                onChange={this.handleFetchMapFeatures}
                                options={this.props.gpsMap.allUuids.map(u => u.uuid )}
                                promptResponses={this.props.gpsMap.mapper.promptResponses}
                                selectedTripIndex={this.props.gpsMap.mapper.selectedDetectedTripIndex}
                                setSelectedTripIndex={this.props.setSelectedDetectedTripIndex}
                                setSelectedUser={this.props.setSelectedUser}
                                showDetectedTrips={this.props.gpsMap.mapper.showDetectedTrips}
                                subwayStations={this.props.gpsMap.mapper.subwayStations}
                                subwayStationsBuffer={this.props.gpsMap.mapper.subwayStationsBuffer}
                                tripLines={this.props.gpsMap.mapper.tripLines}
                                value={this.props.participants.selectedUuid} />
                    </div>
                </div>
            </section>
        )
    }
}