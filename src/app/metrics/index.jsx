/* 
 * src/containers/Panels/Metrics/index.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Moment from  'moment-timezone'

import * as actionCreators from './metricsActions'
import { baseStyles } from 'app/appStyles/baseStyles.scss'
import MetricsTimeControlHeader from 'components/MetricsTimeControlHeader'
import MetricsInstallationsChartCard from './MetricsInstallationsChartCard'
import MetricsRecentActivityChartCard from './MetricsRecentActivityChartCard'
import MetricsQuickStatsCard from './MetricsQuickStatsCard'


@connect(
    state => state.metrics,
    dispatch => bindActionCreators(actionCreators, dispatch)
)
export default class MetricsView extends React.Component {
    static propTypes = {
        activeUsersData: PropTypes.array.isRequired,
        endDatetime: PropTypes.instanceOf(Moment).isRequired,
        fetchSurveyMetrics: PropTypes.func.isRequired,
        periodType: PropTypes.string.isRequired,
        periodsNum: PropTypes.number.isRequired,
        signupsData: PropTypes.shape({
            labels: PropTypes.array.isRequired,
            datasets: PropTypes.array.isRequired
        }),
        startDatetime: PropTypes.instanceOf(Moment).isRequired,
        surveyStats: PropTypes.array.isRequired,
        updatePeriodsNum: PropTypes.func.isRequired,
        updatePeriodType: PropTypes.func.isRequired
    }

    componentDidMount() {
        // set default params based on current time and perform ajax request
        let params = {
            start: this.props.startDatetime.toISOString(),
            end: this.props.endDatetime.toISOString(),
            countsTable: true,
            period: this.props.periodType,
        }
        this.props.fetchSurveyMetrics(params)        
    }

    componentWillReceiveProps(nextProps) {
        const startHasChanged = this.props.startDatetime != nextProps.startDatetime,
              endHasChanged = this.props.endDatetime != nextProps.endDatetime

        if (startHasChanged || endHasChanged) {
            this.props.fetchSurveyMetrics({
                start: nextProps.startDatetime.toISOString(),
                end: nextProps.endDatetime.toISOString(),
                period: nextProps.periodType,
                n: nextProps.periodsNum,
                countsTable: false
            })
        }
    }    

    render() {
        return (
            <section className={classNames(baseStyles)}>
                <MetricsTimeControlHeader fetchSurveyMetrics={this.props.fetchSurveyMetrics}
                                          periodType={this.props.periodType}
                                          periodsNum={this.props.periodsNum}
                                          updatePeriodsNum={this.props.updatePeriodsNum}
                                          updatePeriodType={this.props.updatePeriodType} />
                <div className="content-wrapper">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-xs-12 col-md-6">
                                <MetricsInstallationsChartCard chartData={this.props.signupsData} />
                            </div>

                            <div className="col-xs-12 col-md-6">
                                <MetricsQuickStatsCard surveyStats={this.props.surveyStats} />
                            </div>                            
                        </div>

                        <div className="row spacer">
                            <div className="col-xs-12">
                                <MetricsRecentActivityChartCard chartData={this.props.activeUsersData} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}
