/*
 * src/containers/Login/SendResetEmailForm.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import * as actionCreators from './loginActions'
import LoginViewContainer from './index'
import LoginInput from 'components/LoginInput'
import { styles } from './formStyles.scss'


class SendResetEmailStatus extends React.Component {
    static propTypes = {
        statusHeaderId: PropTypes.string.isRequired,
        statusId: PropTypes.string
    }

    render() {
        return(
            <section>
                <div className="reset-status">
                    <h3><FormattedMessage id={this.props.statusHeaderId} /></h3>

                    <p className="text">
                        { this.props.statusId ? <FormattedMessage id={this.props.statusId} /> : undefined }
                    </p>
                </div>
            </section>
        )
    }
}



@connect(
    state => state.login,
    dispatch => bindActionCreators(actionCreators, dispatch)
)
class SendResetEmailForm extends React.Component {
    static propTypes = {
        intl: intlShape.isRequired,
        resetPassword: PropTypes.shape({
            statusHeaderId: PropTypes.string.isRequired,
            statusId: PropTypes.string
        })
    }

    constructor() {
        super()
        this.state = {
            email: '',
            showStatus: false
        }
    }

    handleEmailInput = (key, value) => {
        this.setState({ email: value })
   }

    handleResetRequest = (e) => {
    	e.preventDefault()
        this.props.resetUserPassword(this.state.email)
        this.setState({showStatus: true})
    }

    render() {
        return(
            <section className={classNames(styles)}>
                <LoginViewContainer>
                    <div className="signup-box">
                        <h4 className="title text-center">
                            <FormattedMessage id="login.resetPassword.subtitle" />
                        </h4>

                        { this.state.showStatus ? (
                            <div className="reset-password-block">
                                <SendResetEmailStatus statusHeaderId={this.props.resetPassword.statusHeaderId}
                                                      statusId={this.props.resetPassword.statusId} />
                            </div>
                        ) : (
                        	<form onSubmit={this.handleResetRequest}>
                                <div className="reset-password-block">
                                    <LoginInput fieldType={"text"}
                                                id={"email"}
                                                onChange={this.handleEmailInput}
                                                placeholderId={"login.loginPage.emailLabel"}
                                                value={this.state.email} />

                                    <button className="button primary-button inverse"
                                            onClick={this.handleResetRequest}>
                                        <FormattedMessage id="login.resetPassword.submit" />
                                    </button>
                                </div>
                            </form>
                        ) }
                    </div>
                </LoginViewContainer>
            </section>
        )
    }
}

export default injectIntl(SendResetEmailForm)
