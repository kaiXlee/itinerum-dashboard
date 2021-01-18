/*
 * components/ValidatedLoginInput.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { styles } from './validatedLoginInput.scss'


export default class ValidatedLoginInput extends React.Component {
    render() {
        let validationClass, validationErrorIconJSX
        if (this.props.value && this.props.isValid !== undefined) {
            validationClass = this.props.isValid ? 'has-success' : 'has-error',
            validationErrorIconJSX = this.props.isValid ? <i className="material-icons">check_circle</i>
                                                        : <div className="i-tooltip">
                                                              <i className="material-icons i-tooltip">error</i>
                                                              <span className="i-tooltip-text">{this.props.validationError}</span>
                                                          </div>
        }

        const textEnteredClass = this.props.value && this.props.value.length > 0 ? 'text-entered' : ''

        return(
            <section className={classNames(styles)}>
                <div className={classNames("input-group", this.props.className)}>
                    <span className={classNames("input-group-addon", "field-label", this.props.labelWidthClass)} id="basic-addon1">
                        <FormattedMessage id={this.props.labelFormatId} />
                    </span>

                    <div className="input-field-block">
                        <input className={classNames("form-control", "input-field", textEnteredClass)}
                               type={this.props.fieldType}
                               onChange={this.props.onChange}
                               value={this.props.value} />

                        <label className={classNames("validation-icon", validationClass)}>
                            { validationErrorIconJSX }
                        </label>
                    </div>
                </div>
            </section>
        )
    }
}


ValidatedLoginInput.propTypes = {
    className: PropTypes.string,
    fieldType: PropTypes.string,
    isValid: PropTypes.bool,
    labelFormatId: PropTypes.string.isRequired,
    labelWidthClass: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    validationError: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
}
