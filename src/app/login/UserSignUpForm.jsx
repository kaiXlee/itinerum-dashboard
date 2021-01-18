/*
 * src/containers/Login/UserSignUpForm.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

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
export default class UserSignUpForm extends React.Component {
    static propTypes = {
        clearStatusId: PropTypes.func.isRequired,
        currentLocale: PropTypes.string.isRequired,
        newSurvey: PropTypes.shape({
            serverValidations: PropTypes.object.isRequired
        }),
        setStatusId: PropTypes.func.isRequired,
        statusId: PropTypes.string
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    }

    constructor() {
        super()
        this.state = {
            surveyName: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            researcherCode: ''
        }
    }

    componentWillMount() {
        this.props.clearStatusId()
    }

    handleCreateUser = (e) => {
        e.preventDefault()

        const isClick = e.type === 'click',
              isEnterSubmit = (e.type === 'keyup' && e.keyCode === 13)

        let userData = {
            surveyName: this.state.surveyName,
            email: this.state.email,
            password: this.state.password,
            userType: 'participant'
        }

        if (this.isResearcherSignup()) {
            userData.userType = 'researcher'
            userData.registrationToken = this.state.researcherCode
        }

        const allValidations = [
            this.validateSurveyName(),
            this.validateEmail(),
            this.validatePasswords()
        ]
        if (this.isResearcherSignup()) allValidations.push(this.validateResearcherSignupCode())

        if ((isClick || isEnterSubmit)) {
            if (allValidations.every(v => v === true)) {
                this.props.registerUser(userData)
                this.context.router.history.push('/login')
            } else {
                this.props.setStatusId('Please make sure are fields are valid.')
            }
        }
    }

    handleInput = (fieldType, value) => {
        // create & set current state while sending input value
        // to API for server-side validation
        const fieldInput = { [fieldType]: value }
        this.setState(fieldInput)

        const fieldsToValidate = ['surveyName'],
              validateInputOnServer = fieldsToValidate.indexOf(fieldType) > -1
        if (validateInputOnServer) this.props.validationCheck(fieldInput)

        if (this.props.statusId) this.props.clearStatusId()
    }

    isResearcherSignup = () => {
        return this.props.location.pathname === '/signup/researcher'
    }

    validateSurveyName = () => {
        return !this.props.newSurvey.serverValidations.surveyName
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

    validateResearcherSignupCode = () => {
        return (this.isResearcherSignup() && this.state.researcherCode.length !== 0)
    }

    render() {
        let formTitleJSX,
            researcherCodeJSX,
            researcherSignupLinkJSX
        if (this.isResearcherSignup()) {
            formTitleJSX = <FormattedMessage id="login.researcherSignup.subtitle" />
            researcherCodeJSX = (
                <ValidatedLoginInput isValid={undefined}
                                     labelFormatId={'login.researcherSignup.signupCodeLabel'}
                                     labelWidthClass={this.props.currentLocale}
                                     onChange={(e) => this.handleInput('researcherCode', e.target.value)}
                                     validationError={'Researcher sign-up code is not valid.'}
                                     value={this.state.researcherCode} />
            )
        } else {
            formTitleJSX = <FormattedMessage id="login.userSignup.subtitle" />
            researcherSignupLinkJSX = (
                <Link className="text-link" to="/signup/researcher">
                    <FormattedMessage id='login.userSignup.researcherSignupBtn' />
                </Link>
            )
        }

        const statusJSX = this.props.statusId ? (<span>
                                                       <i className="material-icons">error_outline</i>
                                                       <p className="status-text">{ this.props.statusId }</p>
                                                   </span>)
                                                : undefined

        return(
            <section className={classNames(styles)}>
                <LoginViewContainer>
                    <div className="signup-box">
                        <h4 className="title text-center">{formTitleJSX}</h4>
                        <form role="form" onKeyUp={this.handleCreateUser}>
                            <div className="form-group">
                                <ValidatedLoginInput isValid={this.validateSurveyName()}
                                                     labelFormatId={'login.userSignup.surveyNameLabel'}
                                                     labelWidthClass={this.props.currentLocale}
                                                     onChange={(e) => this.handleInput('surveyName', e.target.value)}
                                                     validationError={'Survey does not exist, please try a different name.'}
                                                     value={this.state.surveyName} />

                                <ValidatedLoginInput isValid={this.validateEmail()}
                                                     labelFormatId={'login.userSignup.emailLabel'}
                                                     labelWidthClass={this.props.currentLocale}
                                                     onChange={(e) => this.handleInput('email', e.target.value)}
                                                     validationError={'Email already exists, please use a unique email for each survey account.'}
                                                     value={this.state.email} />

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

                                {researcherCodeJSX}
                            </div>

                            <div className="row">
                                <div className="col-xs-12">
                                    {researcherSignupLinkJSX}
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xs-12 status">
                                    { this.props.statusId ? (<p className="status-text pull-right">
                                                                 <i className="material-icons">error</i>
                                                                 <FormattedMessage id={this.props.statusId} />
                                                             </p>)
                                                          : undefined}
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xs-12 text-center">
                                    <button className="primary-button white" onClick={this.handleCreateUser}>
                                        <b><FormattedMessage id='login.userSignup.signupBtn' /></b>
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