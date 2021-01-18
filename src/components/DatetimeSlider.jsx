/*
 * components/DatetimeSlider.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Moment from 'moment-timezone'
import Slider, { Handle, Range} from 'rc-slider'
import Tooltip from 'rc-tooltip'

import { range } from 'utils/data.js'
import CalendarInput from './CalendarInput'
import 'rc-slider/assets/index.css'
import { styles } from './datetimeSlider.scss'


export default class DatetimeSlider extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            intervalsPerDay: 96,
            sliderStartPosition: 0,
            sliderEndPosition: 0
        }
    }

    componentWillMount() {
        const positions = this.sliderPositions(this.props)
        this.updateSliderPositions(positions)
    }

    componentWillReceiveProps(nextProps) {
        const positions = this.sliderPositions(nextProps)
        this.updateSliderPositions(positions)
    }

    calendarStartOptions = () => {
        return {
            allowInput: true,
            enableTime: true,
            minDate: this.props.min,
            maxDate: this.props.end
        }
    }

    calendarEndOptions = () => {
        return {
            allowInput: true,
            enableTime: true,
            minDate: this.props.start,
            maxDate: this.props.max
        }
    }

    getDatetimeFromPosition = (position) => {
        const ratio = position / this.totalTicks(),
              timedeltaMilliseconds = this.props.max - this.props.min,
              timedeltaMinutes = Math.round((ratio * timedeltaMilliseconds) / 1000 / 60)
        return this.props.min.clone().add(timedeltaMinutes, 'minute')

    }

    handleSliderOnChange = (positions) => {
        const [startPosition, endPosition] = positions
        if (startPosition == 0 && endPosition == 0) return positions

        const start = this.getDatetimeFromPosition(startPosition),
              end = this.getDatetimeFromPosition(endPosition)
        this.props.onChange({start, end})
    }

    handleCalendarOnChange = (datetimes) => {
        let start, end
        if (datetimes.start) {
            start = Moment(datetimes.start)
        } else {
            start = this.props.start
        }

        if (datetimes.end) {
            end = Moment(datetimes.end)
        } else {
            end = this.props.end
        }

        this.props.onChange({start, end})
    }

    // evenly space slider labels based on window width
    responsiveLabelInterval = (days) => {
        const maxDayLabels = Math.floor(window.innerWidth / 300)
        let labelResolution = 0,
            numDayLabels = days,
            divisor = 1
        while (labelResolution < 1) {
            if ((maxDayLabels / numDayLabels) >= 1) {
                labelResolution = divisor
                break
            }
            divisor += 1
            numDayLabels = Math.ceil(numDayLabels / divisor)
        }

        // if window is small, only display min and max
        if (window.innerWidth <= 600) {
            divisor = 9999
        }
        return divisor
    }

    sliderLabels = () => {
        // show a start/end label if active period < 1 day
        let days = Math.round(this.timedeltaDays())
        if (!days) days = 1

        // create a tick label for each included day
        let labelInterval = this.responsiveLabelInterval(days)
        labelInterval = days / labelInterval > 8 ? Math.round(days / 8) : labelInterval

        let labels = {},
            lastLabelIdx = 0,
            totalTicks = this.totalTicks()

        labels[0] = <FormattedMessage id="gpsPoints.slider.start" />
        range(days).forEach(i => {
            if (i > 0 && i % labelInterval === 0) {
                const tick = i * this.state.intervalsPerDay
                labels[tick] = `day ${i + 1}`
                lastLabelIdx = i
            }
        })
        labels[totalTicks] = <FormattedMessage id="gpsPoints.slider.end" />
        return labels
    }

    sliderPositions = (props) => {
        const timedeltaMilliseconds = props.max - props.min,
              startRatio = (props.start - props.min) / timedeltaMilliseconds,
              endRatio = (props.end - props.min) / timedeltaMilliseconds

        const timedeltaDays = timedeltaMilliseconds / (1000 * 60 * 60 * 24),
                      days = Math.ceil(timedeltaDays)

        let totalTicks = days ? parseInt(days * this.state.intervalsPerDay) : 0,
            startPosition = Math.round(startRatio * totalTicks),
            endPosition = Math.round(endRatio * totalTicks)
        return [startPosition, endPosition]
    }

    timedeltaDays = () => {
        const timedeltaMilliseconds = this.props.max - this.props.min
        return timedeltaMilliseconds / (1000 * 60 * 60 * 24)

    }

    totalTicks = () => {
        const days = Math.ceil(this.timedeltaDays())
        return days ? parseInt(days * this.state.intervalsPerDay) : 0
    }

    updateSliderPositions = (positions) => {
        let [startPosition, endPosition] = positions

        this.setState({
            sliderStartPosition: startPosition,
            sliderEndPosition: endPosition
        })
    }

    render() {
        const positions = [this.state.sliderStartPosition, this.state.sliderEndPosition]

        return(
            <section className={classNames(styles)}>
                <div className="row">
                    <div className="col-xs-3 datepicker">
                        <CalendarInput options={this.calendarStartOptions()}
                                       onChange={(d) => this.handleCalendarOnChange({start: d})}
                                       value={this.props.start} />
                    </div>
                    <div className="col-xs-6 slider-container">
                        <Range allowCross={false}
                               marks={this.sliderLabels()}
                               max={this.totalTicks()}
                               onAfterChange={this.handleSliderOnChange}
                               onChange={this.updateSliderPositions}
                               value={positions} />
                    </div>
                    <div className="col-xs-3 datepicker">
                        <CalendarInput options={this.calendarEndOptions()}
                                       onChange={(d) => this.handleCalendarOnChange({end: d})}
                                       value={this.props.end} />
                    </div>
                </div>
            </section>
        )
    }
}


DatetimeSlider.propTypes = {
    end: PropTypes.instanceOf(Moment).isRequired,
    max: PropTypes.instanceOf(Moment).isRequired,
    min: PropTypes.instanceOf(Moment).isRequired,
    start: PropTypes.instanceOf(Moment).isRequired,
    onChange: PropTypes.func.isRequired
}
