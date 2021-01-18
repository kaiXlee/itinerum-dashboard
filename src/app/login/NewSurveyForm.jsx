/*
 * src/containers/Login/index.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { modal } from 'lib/react-redux-modal'

import * as actionCreators from './loginActions'
import { en, fr } from 'language/TOS'
import LoginViewContainer from './index'
import ValidatedLoginInput from 'components/ValidatedLoginInput'
import NewSurveyTOSModal from './NewSurveyTOSModal'
import { styles } from './formStyles.scss'


const TOS = { en, fr }


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
export default class NewSurveyForm extends React.Component {
    static propTypes = {
        registerSurvey: PropTypes.func,
        validationCheck: PropTypes.func,
        newSurvey: PropTypes.shape({
            serverValidations: PropTypes.object.isRequired
        })    
    }

    constructor() {
        super()
        this.state = {
            surveyName: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            signupCode: ''
        }
    }

    handleInput = (fieldType, value) => {
        // create & set current state while sending input value
        // to API for server-side validation
        const fieldInput = { [fieldType]: value }
        this.setState(fieldInput)
        this.props.validationCheck(fieldInput)
    }

    handleRegisterNewSurvey = (e) => {
        // validate sign-up form
        const isClick = e.type === 'click',
              isEnterSubmit = (e.type === 'keyup' && e.keyCode === 13)

        if (isClick || isEnterSubmit) {
            const allValidations = [
                this.validateSurveyName(),
                this.validateEmail(),
                this.validatePasswords(),
                this.validateSignupCode()
            ]

            // submit new survey sign-up request
            if (allValidations.every(v => v === true)) {
                this.showDashboardTermsOfServiceModal()
            }
        }
    }

    // show dashboard Terms of Service text for user to agree before final
    // submit request to create new survey account
    showDashboardTermsOfServiceModal = () => {
        const titleJSX = (
            <div className="title">
                <FormattedMessage id='login.newSurvey.tos.modal.title' />
            </div>
        )
        const termsOfServiceBodyJSX = (
            <div className="tos-text">
                <p style={{"whiteSpace": "pre-wrap"}}>{ TOS[this.props.currentLocale] }</p>
            </div>
        )

        modal.add(NewSurveyTOSModal, {
            title: titleJSX,
            size: 'large',
            closeOnOutsideClick: true,
            termsOfService: termsOfServiceBodyJSX,
            registerSurvey: this.submitRegisterSurvey
        })        
    }

    submitRegisterSurvey = () => {
        const { passwordConfirmation, ...newSurvey } = this.state
        this.props.registerSurvey(newSurvey)
    }    

    validateSurveyName = () => {
        return this.props.newSurvey.serverValidations.surveyName
    }

    validateEmail = () => {
        const email = this.state.email
        if (email.length > 0) {
            const emailContainsLocation = email.indexOf('@') > -1,
                  locationContainsDomain = (email.lastIndexOf('.') > email.indexOf('@')) && 
                                           (email.length - email.lastIndexOf('.') > 1)

            if (emailContainsLocation) {
                return emailContainsLocation && locationContainsDomain
            }
        }
    }

    validatePasswords = () => {
        const { password, passwordConfirmation, ...rest } = this.state
        if (password.length > 0 && passwordConfirmation.length > 0) {
            return password === passwordConfirmation
        }
    }

    validateSignupCode = () => {
        const signupCodeIsValid = this.props.newSurvey.serverValidations.signupCode

        // special-case test to only validate when >= 12 characters (length of token-2) typed to not annoy user
        if (this.state.signupCode.length >= 12) { return signupCodeIsValid }
    }    

    render() {
        return(
            <section className={classNames(styles)}>
                <LoginViewContainer>
                    <div className="signup-box">
                        <h4 className="title text-center"><FormattedMessage id='login.newSurvey.subtitle' /></h4>
                        <form role="form" onKeyUp={this.handleRegisterNewSurvey}>
                            <div className="form-group">
                                <ValidatedLoginInput isValid={this.props.newSurvey.serverValidations.surveyName}
                                                     labelFormatId={'login.newSurvey.surveyNameLabel'}
                                                     labelWidthClass={this.props.currentLocale}
                                                     onChange={(e) => this.handleInput('surveyName', e.target.value)}
                                                     validationError={'Survey already exists, please try a different name.'}
                                                     value={this.state.surveyName} />

                                <ValidatedLoginInput isValid={this.validateEmail()}
                                                     labelFormatId={'login.newSurvey.adminEmailLabel'}
                                                     labelWidthClass={this.props.currentLocale}
                                                     onChange={(e) => this.handleInput('email', e.target.value)}
                                                     validationError={'Email already exists, please use a unique email for each survey account.'}
                                                     value={this.state.email} />

                                <ValidatedLoginInput fieldType={'password'}
                                                     isValid={this.validatePasswords()}
                                                     labelFormatId={'login.newSurvey.passwordLabel'}
                                                     labelWidthClass={this.props.currentLocale}
                                                     onChange={(e) => this.handleInput('password', e.target.value)}
                                                     validationError={'Passwords do not match, please check spelling and try again.'}
                                                     value={this.state.password} />

                                <ValidatedLoginInput fieldType={'password'}
                                                     isValid={this.validatePasswords()}
                                                     labelFormatId={'login.newSurvey.confirmPasswordLabel'}
                                                     labelWidthClass={this.props.currentLocale}
                                                     onChange={(e) => this.handleInput('passwordConfirmation', e.target.value)}
                                                     validationError={'Passwords do not match, please check spelling and try again.'}
                                                     value={this.state.passwordConfirmation} />

                                <ValidatedLoginInput isValid={this.validateSignupCode()}
                                                     labelFormatId={'login.researcherSignup.signupCodeLabel'}
                                                     labelWidthClass={this.props.currentLocale}
                                                     onChange={(e) => this.handleInput('signupCode', e.target.value)}
                                                     validationError={'Signup code is invalid, please check the characters and try again.'}
                                                     value={this.state.signupCode} />                              

                                <div className="col-xs-12 text-center">
                                    <button className="primary-button white"
                                            id="register-btn"
                                            type="button"
                                            onClick={this.handleRegisterNewSurvey}>
                                        <FormattedMessage id='login.newSurvey.signupBtn' />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </LoginViewContainer>
            </section>
        )
    }
}
