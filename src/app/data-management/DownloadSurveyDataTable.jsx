/*
 * components/DownloadSurveyDataTable.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Moment from 'moment'
import { Table } from 'reactable'

import { styles } from './downloadSurveyDataTable.scss'


export default class DownloadSurveyDataTable extends React.Component {
    tableRows = () => {
        const { surveyExportStartDatetime, surveyExportEndDatetime,
                surveyIsExporting, tripsExportStartDatetime, 
                tripsExportEndDatetime, tripsIsExporting, ...rest } = this.props

        const surveyDataSelectJSX = <input type="radio"
                                           name="export"
                                           onClick={(e) => this.props.setExportType(e.target.value)}
                                           value="survey"
                                           defaultChecked />,
              tripbreakerSelectJSX = <input type="radio" 
                                            name="export"
                                            onClick={(e) => this.props.setExportType(e.target.value)}
                                            value="trips" />

        let surveyExportPeriod, surveyExportStatus
        if (surveyExportStartDatetime && surveyExportEndDatetime) {
            surveyExportPeriod = surveyExportStartDatetime.format('YYYY-MM-DD') + ' – '
                               + surveyExportEndDatetime.format('YYYY-MM-DD') 
            surveyExportStatus = surveyIsExporting ? <FormattedMessage id="dataManagement.download.exportRunning" />
                                                   : <FormattedMessage id="dataManagement.download.exportComplete" />
        }

        let tripsExportPeriod, tripsExportStatus
        if (tripsExportStartDatetime && tripsExportEndDatetime) {
            tripsExportPeriod = tripsExportStartDatetime.format('YYYY-MM-DD') + ' – '
                              + tripsExportEndDatetime.format('YYYY-MM-DD')
            tripsExportStatus = tripsIsExporting ? <FormattedMessage id="dataManagement.download.exportRunning" />
                                                 : <FormattedMessage id="dataManagement.download.exportComplete" />                              
        }

        return [
            {
                exportSelect: surveyDataSelectJSX,
                exportType: <b><FormattedMessage id="dataManagement.download.surveyData" /></b>,
                exportPeriod: surveyExportPeriod,
                exportStatus: surveyExportStatus
            }, { 
                exportSelect: tripbreakerSelectJSX,
                exportType: <b><FormattedMessage id="dataManagement.download.trips" /></b>,
                exportPeriod: tripsExportPeriod,
                exportStatus: tripsExportStatus
            }
        ]        
    }

    render() {
        const rows = this.tableRows()
        return(
            <section className={classNames(styles)}>
                <div className="row">
                    <div className="col-xs-12">
                        <Table className="table export-table"
                               columns={[
                                   { key: 'exportSelect', label: '' },
                                   { key: 'exportType', label: 'Type' },
                                   { key: 'exportPeriod', label: <FormattedMessage id="dataManagement.download.lastExportPeriod" /> },
                                   { key: 'exportStatus', label: <FormattedMessage id="dataManagement.download.lastExportStatus" /> }
                               ]}
                               data={rows} />
                    </div>
                </div>
            </section>
        )
    }
}


DownloadSurveyDataTable.propTypes = {
    setExportType: PropTypes.func.isRequired,
    surveyExportEndDatetime: PropTypes.instanceOf(Moment),
    surveyExportStartDatetime: PropTypes.instanceOf(Moment),
    surveyIsExporting: PropTypes.bool,
    tripsExportEndDatetime: PropTypes.instanceOf(Moment),
    tripsExportStartDatetime: PropTypes.instanceOf(Moment),
    tripsIsExporting: PropTypes.bool
}
