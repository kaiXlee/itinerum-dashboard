/*
 * components/DownloadSurveyDataCard.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Moment from 'moment'

import CalendarInput from 'components/CalendarInput'
import DownloadSurveyDataTable from './DownloadSurveyDataTable'
import { styles } from './downloadSurveyDataCard.scss'


export default class DownloadSurveyDataCard extends React.Component {
    downloadZipUri = () => {
        if (this.props.exportRawDataIsSelected &&
            !this.props.exportsAvailable.raw.exporting) {
                return this.props.exportsAvailable.raw.uri
        } else if (!this.props.exportsAvailable.trips.exporting) {
            return this.props.exportsAvailable.trips.uri
        }
    }

    handleExport = () => {
        const exportDatetimeMissing = !this.props.downloadStartDatetime ||
                                      !this.props.downloadEndDatetime
        if (exportDatetimeMissing) return

        if (this.props.exportRawDataIsSelected) {
            this.props.exportRawData({
                start: this.props.downloadStartDatetime.startOf('day').toISOString(),
                end: this.props.downloadEndDatetime.endOf('day').toISOString(),
                timezone: this.props.userTimezone,
                channel: this.props.sseChannelName
            })            
        } else {
            this.props.exportTripsData({
                start: this.props.downloadStartDatetime.startOf('day').toISOString(),
                end: this.props.downloadEndDatetime.endOf('day').toISOString(),
                timezone: this.props.userTimezone,
                channel: this.props.sseChannelName
            })            
        }
    }

    toDate = (datetime) => {
        if (Moment.isMoment(datetime)) return datetime.toDate()
        return datetime
    }

    render() {
        const downloadUri = this.downloadZipUri(),
              calendarOptions = {
                  allowInput: true,
                  minDate: this.props.surveyStartDatetime,
                  maxDate: this.props.surveyEndDatetime
              }

        return(
            <section className={classNames(styles, 'card', 'thick')}>
                <div className="title">
                    <h3><FormattedMessage id="dataManagement.download.title" /></h3>
                </div>

                <div className="row calendar-group">
                    <div className="col-sm-4">
                        <h5><FormattedMessage id="dataManagement.download.startTime" /></h5>
                        <CalendarInput options={calendarOptions}
                                       value={this.props.downloadStartDatetime}
                                       onChange={(d) => this.props.editDownloadStartDatetime(d)} />
                    </div>
                    <div className="col-sm-4">
                        <h5><FormattedMessage id="dataManagement.download.endTime" /></h5>
                        <CalendarInput options={calendarOptions}
                                       value={this.props.downloadEndDatetime}
                                       onChange={(d) => this.props.editDownloadEndDatetime(d)} />
                    </div>
                </div>

                <DownloadSurveyDataTable setExportType={this.props.setExportType}
                                         surveyExportEndDatetime={this.props.exportsAvailable.raw.exportEndDatetime} 
                                         surveyExportStartDatetime={this.props.exportsAvailable.raw.exportStartDatetime}
                                         surveyIsExporting={this.props.exportsAvailable.raw.exporting}
                                         tripsExportEndDatetime={this.props.exportsAvailable.trips.exportEndDatetime}
                                         tripsExportStartDatetime={this.props.exportsAvailable.trips.exportStartDatetime}
                                         tripsIsExporting={this.props.exportsAvailable.trips.exporting} />

                <div className="row export-button-group">
                    <button className="button medium" onClick={this.handleExport}>
                        <i className="material-icons button-icon">unarchive</i>
                        <span className="button-text">
                            <FormattedMessage id="dataManagement.download.exportBtn" />
                        </span>
                    </button>

                    <a className="button medium"
                       disabled={downloadUri === undefined}
                       href={downloadUri}>
                       <i className="button-icon material-icons">file_download</i>
                       <span className="button-text">
                            <FormattedMessage id="dataManagement.download.downloadBtn" />
                        </span>
                    </a>
                </div>
            </section>
        )
    }
}


DownloadSurveyDataCard.propTypes = {
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
    setExportType: PropTypes.func.isRequired,
    sseChannelName: PropTypes.string.isRequired,
    surveyEndDatetime: PropTypes.instanceOf(Moment),
    surveyStartTime: PropTypes.instanceOf(Moment),
    userTimezone: PropTypes.string.isRequired
}
