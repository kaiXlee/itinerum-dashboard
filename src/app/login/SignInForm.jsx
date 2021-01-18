/*
 * src/containers/Login/SignInForm.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import * as actionCreators from 'app/login/loginActions'
import LoginViewContainer from './index'
import LoginInput from 'components/LoginInput'


@connect(
    state => state.login,
    dispatch => bindActionCreators(actionCreators, dispatch)
)
export default class SignInForm extends React.Component {
    static propTypes = {
        isAuthenticating: PropTypes.bool.isRequired,
        login: PropTypes.func.isRequired,
        statusId: PropTypes.string
    }

    constructor() {
        super()
        this.state = {
            email: '',
            password: ''
        }
    }

    handleLogin = (e) => {
        e.preventDefault()
        this.props.login(this.state)
    }

    updateInputValue = (key, value) => {
        this.setState({[key]: value})
    }

    validatedEmailClass = () => {
        const email = this.state.email
        if (email.length > 0) {
            const emailContainsLocation = email.indexOf('@') > -1,
                  locationContainsDomain = (email.lastIndexOf('.') > email.indexOf('@')) && 
                                           (email.length - email.lastIndexOf('.') > 1)

            if (emailContainsLocation) {
                const emailIsValid = emailContainsLocation && locationContainsDomain
                if (!emailIsValid) {
                    return 'error'
                } else {
                    return 'success'
                }
            }
        }
    }    

    render() {
        const statusJSX = this.props.statusId ? (<span>
                                                     <i className="material-icons">error_outline</i>
                                                     <p className="status-text"><FormattedMessage id={this.props.statusId } /></p>
                                                 </span>)
                                              : undefined

        return(
            <LoginViewContainer>
                <div className="login-form-block">
                    <form id="login-form" name="login-form" className="form" onSubmit={this.handleLogin}>
                        <div className="login-inputs-block flex">
                            <LoginInput id={"email"}
                                        fieldType={"text"}
                                        placeholderId={"login.loginPage.emailLabel"}
                                        onChange={this.updateInputValue}
                                        validationClass={this.validatedEmailClass()}
                                        value={this.state.email} />
                            <LoginInput id={"password"}
                                        fieldType={"password"}
                                        placeholderId={"login.loginPage.passwordLabel"}
                                        onChange={this.updateInputValue}
                                        value={this.state.password} />
                            <div className="forgot-password-block">
                                <Link className="text-link forgot" to="/reset">
                                    <FormattedMessage id="login.loginPage.forgotPasswordLink" />
                                </Link>
                            </div>
                        </div>

                        <div className="status signin-status">{statusJSX}</div>

                        <div className="button-wrapper">
                            <button className="primary-button white flex" onClick={this.handleLogin}>
                                { this.props.isAuthenticating ? <i className="loading-spinner button-icon saving" /> : undefined }
                                <FormattedMessage id="login.loginPage.loginBtn" />
                            </button>
                        </div>

                        <div className="button-wrapper">
                            <Link to="/signup/user">
                                <button className="primary-button flex">
                                    <FormattedMessage id="login.loginPage.createAccountBtn" />
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
            </LoginViewContainer>
        )
    }
}
