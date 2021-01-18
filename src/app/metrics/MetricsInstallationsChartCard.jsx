/*
 * components/MetricsInstallationsChartCard.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Bar, defaults } from 'react-chartjs-2'

import { styles } from './metricsInstallationsChartCard.scss'


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


export default class MetricsInstallationsChartCard extends React.Component {
    noDataOverlayJSX = () => {
        return (
            <div className="overlay-text">
                <h1>No Data</h1>
            </div>            
        )
    }

    render() {
        const chartData = this.props.chartData
        chartData.datasets.forEach(d => {
            d.backgroundColor = itinerumPrimaryBlue
        })


        return(
            <section className={classNames(styles, 'card', 'thick')}>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="title">
                            <b><FormattedMessage id="metrics.charts.mobileInstallation.title" /></b>
                            <h4><b><FormattedMessage id="metrics.charts.mobileInstallation.category" /></b></h4>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="chart-container overlay">
                            { this.props.chartData.labels.length === 0 ? this.noDataOverlayJSX() : null }
                            <div className="chart signups">         
                                <Bar data={chartData}
                                     height={255}
                                     options={chartOptions} />
                            </div>                            
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}


MetricsInstallationsChartCard.propTypes = {
    chartData: PropTypes.shape({
        datasets: PropTypes.array.isRequired,
        labels: PropTypes.array.isRequired
    })    
}
