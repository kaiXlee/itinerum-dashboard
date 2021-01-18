/*
 * src/app/gps-map/GpsMapTripsSummaryTable.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'
import Moment from 'moment-timezone'

import { styles } from './gpsMapTripsSummaryTable.scss'


export default class GpsMapTripsSummaryTable extends React.Component {
    constructor() {
        super()
        this.state = {
            page: 0,
            tripsPerPage: 20
        }
    }

    nextIsEnabled = () => {
        return this.state.page < (this.props.trips.features.length / this.state.tripsPerPage) - 1
    }

    prevIsEnabled = () => {
        return this.state.page != 0
    }

    handleNextPage = () => {
        if (this.nextIsEnabled()) {
            this.setState({page: this.state.page + 1})
        }
    }

    handlePrevPage = () => {
        if (this.prevIsEnabled()) {
            this.setState({page: this.state.page - 1})
        }
    }

    tableHeaderJSX = () => {
        let headerText
        if (this.props.trips.features && this.props.trips.features.length > 0) {
            headerText = ''
        } else {
            headerText = 'No trips detected.'
        }

        return(
            <thead>
                <tr className="header-row">
                    <th className="header-text">{ headerText }</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Distance (m)</th>
                </tr>
            </thead>
        )
    }

    tableTripRowsJSX = () => {
        const rows = [],
              minIdx = this.state.page * this.state.tripsPerPage,
              maxIdx = minIdx + this.state.tripsPerPage
        this.props.trips.features.forEach((feature, idx) => {
            if (minIdx <= idx && idx < maxIdx) {
                const rowIsActiveClass = idx === this.props.selectedTripIndex ? 'active' : undefined

                rows.push(
                    <tr className={classNames('trip-row', rowIsActiveClass)}
                        key={'trip-' + idx}
                        onClick={() => { this.props.setSelectedTripIndex(idx)}}>
                        <th>{ idx + 1 }</th>
                        <td>{Moment(feature.properties.start).local().format('HH:mm:ss')}</td>
                        <td>{Moment(feature.properties.end).local().format('HH:mm:ss')}</td>
                        <td>{feature.properties.cumulativeDistance.toFixed(2)}</td>
                    </tr>
                )
            }
        })

        return <tbody>{rows}</tbody>
    }

    tableTripPaginatorJSX = () => {
        if (this.props.trips.features && this.props.trips.features.length > this.state.tripsPerPage) {
            const backButtonActiveClass = this.prevIsEnabled() ? 'active' : undefined,
                  forwardButtonActiveClass = this.nextIsEnabled() ? 'active' : undefined

            return(
                <tfoot>
                    <tr>
                        <td />
                        <td className="text-center">
                            <a onClick={this.handlePrevPage}>
                                <i className={classNames('material-icons','nav-arrow', backButtonActiveClass)}>keyboard_backspace</i>
                            </a>
                        </td>
                        <td />
                        <td className="text-center">
                            <a onClick={this.handleNextPage}>
                                <i className={classNames('material-icons','nav-arrow', 'mirror', forwardButtonActiveClass)}>keyboard_backspace</i>
                            </a>
                        </td>
                    </tr>
                </tfoot>
            )
        }
    }

    render() {
        return(
            <section className={classNames(styles)}>
                <table className="summary-table">
                    { this.tableHeaderJSX() }
                    { this.props.trips.features ? this.tableTripRowsJSX() : undefined }
                    { this.tableTripPaginatorJSX() }
                </table>
            </section>
        )
    }
}

GpsMapTripsSummaryTable.propTypes = {
    trips: PropTypes.object.isRequired,
    selectedTripIndex: PropTypes.number,
    setSelectedTripIndex: PropTypes.func.isRequired
}