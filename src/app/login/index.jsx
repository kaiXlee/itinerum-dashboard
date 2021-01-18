/*
 * src/containers/Login/index.jsx
 */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { routerActions } from 'react-router-redux'

import * as actionCreators from './loginActions'
import LanguageSelect from 'components/LoginLanguageSelect'
import { baseStyles } from 'app/appStyles/baseStyles.scss'
import { styles } from './styles.scss'

import ItinerumLogoSvg from './img/Itinerum-Logo-White.svg'


const mapStateToProps = (state) => {
    return {
        currentLocale: state.intl.locale,
        isAuthenticating: state.login.isAuthenticating,
        isAuthenticated: state.login.isAuthenticated,
        newSurvey: state.login.newSurvey,
        redirect: state.routing.locationBeforeTransitions || '/'
    }
}


@connect(
    mapStateToProps,
    dispatch => bindActionCreators({
        replace: routerActions.replace,
        ...actionCreators
    }, dispatch)
)
export default class LoginView extends React.Component {
    static propTypes = {
        changeCurrentLanguage: PropTypes.func.isRequired,
        currentLocale: PropTypes.string.isRequired
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    }

    isSignInPage = () => {
        return this.context.router.route.location.pathname === '/login'
    }

    render() {
        const animationClass = this.isSignInPage() ? 'animate' : undefined

        return (
            <section className={classNames(baseStyles, styles)}>
                <div className="flex-container flex">
                    {/* Language select header */}
                    <div className="language-select-block flex">
                        <LanguageSelect currentLocale={this.props.currentLocale}
                                        changeLanguage={this.props.changeCurrentLanguage} />
                    </div>

                    {/* Splash logo */}
                    <div className="login-block flex">
                        <Link to="/login">
                            <div className="logo-block">
                                <div className={classNames("dot _1", animationClass)} />
                                <div className={classNames("dot _2", animationClass)} />
                                <div className={classNames("dot _3", animationClass)} />
                                <div className={classNames("dot _4", animationClass)} />
                                <div className={classNames("dot _5", animationClass)} />
                                <div className={classNames("dot _6", animationClass)} />
                                <div className={classNames("path _1", animationClass)} />
                                <div className={classNames("path _2", animationClass)} />
                                <img className={classNames("itinerum-logo", animationClass)}
                                     src={ItinerumLogoSvg} />
                            </div>
                        </Link>

                        {/* Forms */}
                        { this.props.children }
                    </div>               
                </div>
            </section>
        )
    }
}