/*
 * src/app/data-management/index.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import Moment from 'moment'

import * as actionCreators from './dataManagementActions'
import DownloadSurveyDataCard from './DownloadSurveyDataCard'
import UploadSubwayDataCard from './UploadSubwayDataCard'
import { baseStyles } from 'app/appStyles/baseStyles.scss'


@connect(
    state => state.dataManagement,
    dispatch => bindActionCreators(actionCreators, dispatch)
)
export default class DataManagementView extends React.Component {
    static propTypes = {
        connectServerSentEvents: PropTypes.func.isRequired,
        databaseSubwayData: PropTypes.object,
        deleteSubwayStopsData: PropTypes.func.isRequired,
        downloadEndDatetime: PropTypes.instanceOf(Moment),
        downloadStartDatetime: PropTypes.instanceOf(Moment),
        editDownloadEndDatetime: PropTypes.func.isRequired,
        editDownloadStartDatetime: PropTypes.func.isRequired,
        exportsAvailable: PropTypes.shape({
            raw: PropTypes.object.isRequired,
            trips: PropTypes.object.isRequired
        }),
        exportRawData: PropTypes.func.isRequired,
        exportRawDataIsSelected: PropTypes.bool.isRequired,
        exportTripsData: PropTypes.func.isRequired,
        fetchSubwayStopsDataStatus: PropTypes.func.isRequired,
        fetchSurveyStatus: PropTypes.func.isRequired,
        setExportType: PropTypes.func.isRequired,
        sseChannelName: PropTypes.string.isRequired,
        surveyEndDate: PropTypes.instanceOf(Moment),
        surveyStartDate: PropTypes.instanceOf(Moment),
        uploadSubwayStopsData: PropTypes.func.isRequired,
        userTimezone: PropTypes.string.isRequired        
    }

    componentDidMount() {
        this.props.fetchSurveyStatus()
        this.props.fetchSubwayStopsDataStatus()
        this.props.connectServerSentEvents(this.props.sseChannelName)
    }

    render() {
        return(
            <section className={classNames(baseStyles)}>
                <div className="content-wrapper">
                    <DownloadSurveyDataCard downloadEndDatetime={this.props.downloadEndDatetime}
                                            downloadStartDatetime={this.props.downloadStartDatetime}
                                            editDownloadEndDatetime={this.props.editDownloadEndDatetime}
                                            editDownloadStartDatetime={this.props.editDownloadStartDatetime}
                                            exportsAvailable={this.props.exportsAvailable}
                                            exportRawData={this.props.exportRawData}
                                            exportRawDataIsSelected={this.props.exportRawDataIsSelected}
                                            exportTripsData={this.props.exportTripsData}
                                            setExportType={this.props.setExportType}
                                            sseChannelName={this.props.sseChannelName}
                                            surveyEndDatetime={this.props.surveyEndDatetime}
                                            surveyStartDatetime={this.props.surveyStartDatetime}
                                            userTimezone={this.props.userTimezone} />
                    <UploadSubwayDataCard databaseSubwayStopsData={this.props.databaseSubwayStopsData}
                                          deleteSubwayStopsData={this.props.deleteSubwayStopsData}
                                          uploadSubwayStopsData={this.props.uploadSubwayStopsData} />
                </div>
            </section>
        )
    }
}
