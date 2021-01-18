/*
 * components/MetricsRecentActivityChartCard.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Line } from 'react-chartjs-2'
import Moment from 'moment-timezone'

import { styles } from './metricsRecentActivityChartCard.scss'


const itinerumPrimaryBlue = '#007AF2';
const chartOptions = {
    maintainAspectRatio: false,
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                stepSize: 1
            }
        }],
        xAxes: [{
            gridLines: {
                display: false
            }
        }]
    },
    legend: {
        display: false
    }
}


export default class MetricsRecentActivityChartCard extends React.Component {
    activeUsersChartData = () => {
        const labels = [],
              data = []

        this.props.chartData.forEach(d => {
            const [timestamp, count] = d,
                  formattedTimestamp = Moment(timestamp).format('H:mm')
            labels.push(formattedTimestamp)
            data.push(count)
        })
        return {
            labels,
            datasets: [{
                data,
                backgroundColor: itinerumPrimaryBlue
            }]
        }
    }

    render() {
        const chartData = this.activeUsersChartData()

        return(
            <section className={classNames(styles, 'card', 'thick')}>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="title">
                            <b><FormattedMessage id="metrics.charts.hourlyActiveUsers.title" /></b>
                            <h4><b><FormattedMessage id="metrics.charts.hourlyActiveUsers.category" /></b></h4>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="chart-container">
                            <div className="chart active-users">
                                <Line data={chartData}
                                      height={280}
                                      options={chartOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}


MetricsRecentActivityChartCard.propTypes = {
    chartData: PropTypes.array.isRequired
}
