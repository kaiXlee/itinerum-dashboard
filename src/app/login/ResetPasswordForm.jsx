/*
 * src/containers/Login/ResetPasswordForm.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import qs from 'qs'

import * as actionCreators from './loginActions'
import LoginViewContainer from './index'
import ValidatedLoginInput from 'components/ValidatedLoginInput'
import { styles } from './formStyles.scss'


const mapStateToProps = (state) => {
    return {
        currentLocale: state.intl.locale,
        ...state.login
    }
}

@connect(
    state => mapStateToProps,
    dispatch => bindActionCreators(actionCreators, dispatch)
)
class ResetPasswordForm extends React.Component {
    static propTypes = {
        statusId: PropTypes.string,
        updateUserPassword: PropTypes.func.isRequired
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    }

    constructor() {
        super()
        this.state = {
            password: '',
            passwordConfirmation: ''
        }
    }

    componentWillMount() {
        this.props.clearStatusId()
    }

    handleInput = (fieldType, value) => {
        // create & set current state while sending input value
        // to API for server-side validation
        const fieldInput = { [fieldType]: value }
        this.setState(fieldInput)

        if (this.props.statusId) this.props.clearStatusId()
    }

    handleSubmitNewPassword = (e) => {
        e.preventDefault()

        if (this.validatePasswords()) {
            const params = qs.parse(this.props.location.search.slice(1))
            this.props.updateUserPassword(params.email, this.state.password, params.token)
            this.context.router.history.push('/login')
        } else {
            this.props.setStatusId('Please make sure are fields are valid.')
        }
    }

    validatePasswords = () => {
        const { password, passwordConfirmation, ...rest } = this.state
        if (password.length > 0 && passwordConfirmation.length > 0) {
            return password === passwordConfirmation
        }
    }

    render() {
        return(
            <section className={classNames(styles)}>
                <LoginViewContainer>
                    <div className="signup-box">
                        <h4 className="title text-center">
                            <FormattedMessage id="login.resetPassword.subtitle" />
                        </h4>

                        <form role="form" onSubmit={this.handleSubmitNewPassword}>
                            <ValidatedLoginInput fieldType={'password'}
                                                 isValid={this.validatePasswords()}
                                                 labelFormatId={'login.userSignup.passwordLabel'}
                                                 labelWidthClass={this.props.currentLocale}
                                                 onChange={(e) => this.handleInput('password', e.target.value)}
                                                 validationError={'Passwords do not match, please check spelling and try again.'}
                                                 value={this.state.password} />
                            <ValidatedLoginInput fieldType={'password'}
                                                 isValid={this.validatePasswords()}
                                                 labelFormatId={'login.userSignup.confirmPasswordLabel'}
                                                 labelWidthClass={this.props.currentLocale}
                                                 onChange={(e) => this.handleInput('passwordConfirmation', e.target.value)}
                                                 validationError={'Passwords do not match, please check spelling and try again.'}
                                                 value={this.state.passwordConfirmation} />

                            <div className="row">
                                <div className="col-xs-12 status">
                                    { this.props.statusId ? (<p className="status-text pull-right">
                                                                 <i className="material-icons">error</i>
                                                                 <FormattedMessage id={this.props.statusId} />
                                                             </p>)
                                                          : undefined}
                                </div>
                            </div>

                            <div className="text-center">
                                <button className="primary-button white">
                                    <b><FormattedMessage id='login.resetPassword.submit' /></b>
                                </button>
                            </div>
                        </form>
                    </div>
                </LoginViewContainer>
            </section>
        )
    }
}

export default withRouter(ResetPasswordForm)