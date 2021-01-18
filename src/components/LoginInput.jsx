/*
 * components/LoginInput.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import { styles } from './loginInput.scss'


class LoginInput extends React.Component {
    handleOnChange = (e) => {
        this.props.onChange(this.props.id, e.target.value)
    }
    
    render() {
        const textEnteredClass = this.props.inputValue &&
                                 this.props.inputValue.length > 0 ? 
                                 'text-entered' : ''
        const placeholder = this.props.placeholderId ? this.props.intl.formatMessage({id: this.props.placeholderId})
                                                     : undefined

        return(
            <section className={classNames(styles)}>
                <input className={classNames("login-field", this.props.validationClass, textEnteredClass)}
                       id={this.props.id}
                       name={this.props.id}
                       type={this.props.fieldType}
                       maxLength={256}
                       placeholder={placeholder}
                       value={this.props.value}
                       onChange={this.handleOnChange} />
            </section>
        )
    }
}


LoginInput.propTypes = {
    id: PropTypes.string.isRequired,
    fieldType: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholderId: PropTypes.string.isRequired,
    validationClass: PropTypes.string,
    value: PropTypes.string.isRequired
}


export default injectIntl(LoginInput)
