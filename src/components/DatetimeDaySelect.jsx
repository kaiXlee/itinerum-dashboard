/*
 * components/DatetimeDaySelect.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Moment from 'moment-timezone'

import CalendarInput from './CalendarInput'
import { styles } from './datetimeDaySelect.scss'


export default class DatetimeDaySelect extends React.Component {
    calendarOptions = () => {
        return {
            allowInput: true,
            minDate: this.props.min,
            maxDate: this.props.max
        }
    }

    handleCalendarOnChange = (selectedDate) => {
        const nextDate = {
        	start: Moment(selectedDate).startOf('day'),
        	end: Moment(selectedDate).endOf('day')
        }
        this.props.onChange(nextDate)
    }

    nextIsEnabled = () => {
    	return Moment(this.props.start).add(1, 'days').startOf('day') <= this.props.max
    }

    previousIsEnabled = () => {
    	return Moment(this.props.start).subtract(1, 'days').endOf('day') >= this.props.min
    }

    handleNextDay = () => {
    	if (this.nextIsEnabled()) {
	        const nextDate = {
	        	start: Moment(this.props.start).add(1, 'days').startOf('day'),
	        	end: Moment(this.props.start).add(1, 'days').endOf('day')
	        }
	        this.props.onChange(nextDate)
	    }
    }

    handlePreviousDay = () => {
    	if (this.previousIsEnabled()) {
	        const nextDate = {
	        	start: Moment(this.props.start).subtract(1, 'days').startOf('day'),
	        	end: Moment(this.props.start).subtract(1, 'days').endOf('day')
	        }
	        this.props.onChange(nextDate)
	    }
    }

    render() {
    	const previousActiveClass = this.previousIsEnabled() ? 'active' : undefined
    	const nextActiveClass = this.nextIsEnabled() ? 'active' : undefined

        return(
            <section className={classNames(styles)}>
	            <div className="row">
	            	<div className="col-xs-1 col-md-offset-2">
	            		<a onClick={this.handlePreviousDay}>
		            		<i className={classNames('material-icons' ,'nav-arrow', previousActiveClass)}>keyboard_backspace</i>
		            	</a>
	            	</div>

	            	<div className="col-xs-8 col-md-6">
		                <CalendarInput options={this.calendarOptions()}
		                               onChange={this.handleCalendarOnChange}
		                               value={this.props.start} />
		            </div>

		            <div>
		            	<a onClick={this.handleNextDay}>
			            	<i className={classNames('material-icons' ,'nav-arrow', 'mirror', nextActiveClass)}>keyboard_backspace</i>
			            </a>
		            </div>
	            </div>
            </section>
        )
    }
}

DatetimeDaySelect.propTypes = {
    end: PropTypes.instanceOf(Moment).isRequired,
    max: PropTypes.instanceOf(Moment).isRequired,
    min: PropTypes.instanceOf(Moment).isRequired,
    start: PropTypes.instanceOf(Moment).isRequired,
    onChange: PropTypes.func.isRequired
}