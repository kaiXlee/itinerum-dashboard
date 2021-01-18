/*
 * components/MetricsTimeControlHeader.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Moment from 'moment-timezone'

import { styles } from './metricsTimeControlHeader.scss'


export default class MetricsTimeControlHeader extends React.Component {
    handleUpdatePeriodsNum = (e) => {
        const periodsNum = parseInt(e.target.value)

        let params = {
            startDatetime: Moment().subtract(periodsNum, this.props.periodType),
            endDatetime: Moment(),
            periodsNum
        }
        this.props.updatePeriodsNum(params)
    }

    handleUpdatePeriodType = (e) => {
        const periodType = e.target.value
        let params = {
            startDatetime: Moment().subtract(this.props.periodsNum, periodType),
            endDatetime: Moment(),
            periodType
        }
        this.props.updatePeriodType(params)        
    }

    periodTypeSelectJSX = () => {
        return(
            <select className="i-select period-type-select"
                    value={this.props.periodType}
                    onChange={this.handleUpdatePeriodType}>
                <FormattedMessage id="metrics.header.periodBreaks.helpLabel" key="help-text">
                    {(message) => <option disabled={true}>{message}</option>}
                </FormattedMessage>
                <FormattedMessage id="metrics.header.periodBreaks.daily" key="days">
                    {(message) => <option value="days">{message}</option>}
                </FormattedMessage>
                <FormattedMessage id="metrics.header.periodBreaks.weekly" key="weeks">
                    {(message) => <option value="weeks">{message}</option>}
                </FormattedMessage>
                <FormattedMessage id="metrics.header.periodBreaks.monthly" key="months">
                    {(message) => <option value="months">{message}</option>}
                </FormattedMessage>                    
            </select>
        )
    }

    periodNumInputJSX = () => {
        return(
            <div className="period-num-container">
                <label htmlFor="n-periods">
                    <FormattedMessage id='metrics.header.periodsLabel' />:
                    <input className="i-input period-num-input"
                           type="number"
                           min={1}
                           value={this.props.periodsNum}
                           onChange={this.handleUpdatePeriodsNum} />
                </label>
            </div>
        )
    }

    render() {
        return(
            <section className={classNames(styles)}>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="control pull-right">
                            { this.periodNumInputJSX() }
                            { this.periodTypeSelectJSX() }
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}


MetricsTimeControlHeader.propTypes = {
    periodType: PropTypes.string.isRequired,
    periodsNum: PropTypes.number.isRequired,
    updatePeriodsNum: PropTypes.func.isRequired,
    updatePeriodType: PropTypes.func.isRequired,
}
