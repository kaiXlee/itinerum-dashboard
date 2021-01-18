/*
 * components/CalendarInput.jsx
 *
 * Wraps flatpickr library with Itinerum UI
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Flatpickr from 'react-flatpickr'
import Moment from 'moment-timezone'

import 'flatpickr/dist/flatpickr.min.css'
import { styles } from './calendarInput.scss'


export default class CalendarInput extends React.Component {
    shouldComponentUpdate = (nextProps) => {
        const formattedThisProps = this.formatProps(this.props),
              formattedNextProps = this.formatProps(nextProps)

        const valueIsMissing = (!formattedThisProps.options.minDate ||
                                !formattedThisProps.options.maxDate ||
                                !formattedNextProps.options.minDate ||
                                !formattedNextProps.options.maxDate)

        const nextValueExists = (!!formattedNextProps.options.minDate ||
                                 !!formattedNextProps.options.maxDate)

        if (valueIsMissing && nextValueExists) return true
        if (valueIsMissing) return false

        const changedMinDate = formattedThisProps.options.minDate.getTime() !== formattedNextProps.options.minDate.getTime(),
              changedMaxDate = formattedThisProps.options.maxDate.getTime() !== formattedNextProps.options.maxDate.getTime(),
              changedEnableTime = formattedThisProps.options.enableTime !== formattedNextProps.options.enableTime,
              changedValue = formattedThisProps.value.getTime() !== formattedNextProps.value.getTime(),
              changedEnabled = formattedThisProps.disabled !== formattedNextProps.disabled
        
        const shouldUpdate = changedMinDate || changedMaxDate || changedEnableTime || changedValue || changedEnabled
        return shouldUpdate
    }

    formatProps = (props) => {
        let { defaultValue, disabled, options, value, ...rest } = props

        if (options.minDate && Moment.isMoment(options.minDate)) options.minDate = options.minDate.toDate()
        if (options.maxDate && Moment.isMoment(options.maxDate)) options.maxDate = options.maxDate.toDate()
        if (defaultValue && Moment.isMoment(defaultValue)) defaultValue = defaultValue.toDate()
        if (value && Moment.isMoment(value)) {
            value = value.toDate()
            value = value < options.minDate ? options.minDate : value
            value = value > options.maxDate ? options.maxDate : value
        }

        return { defaultValue, disabled, options, value }
    }

    handleOnChange = (e) => {
        if (e.length > 0) {
            const datetime = Moment(e[0])
            this.props.onChange(datetime)
        }
    }

    render() {
        const { defaultValue, disabled, options, value } = this.formatProps(this.props)

        return(
            <section className={classNames(styles, 'calendar')}>
                <div className="datepicker-icons">
                    <Flatpickr className="i-input icon-field"
                               onChange={this.handleOnChange}
                               value={defaultValue || value}
                               options={options}
                               disabled={disabled} />
                    <i className="material-icons i-input-icon calendar-icon">date_range</i>
                </div>
            </section>
        )
    }
}


CalendarInput.propTypes = {
    disabled: PropTypes.bool,
    options: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
}
