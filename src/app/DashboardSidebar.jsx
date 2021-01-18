/*
 * src/components/DashboardSidebar.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'

import * as actionCreators from 'app/profile/surveyProfileActions'
import { styles } from './dashboardSidebar.scss'


export class SidebarLinks extends React.Component {
    render() {
        const userLevel = this.props.userLevel

        return(
            <ul className="submenu">
                {this.props.pages.map(function(page, i) {

                    if (userLevel <= page.userLevel) {
                        return (
                            <li key={i}>
                                <NavLink activeClassName="active" to={page.url}>
                                    <i className={"mdi " + page.icon}></i>
                                    <span className="link-text">
                                        <FormattedMessage id={page.textId} />
                                    </span>
                                </NavLink>
                            </li>
                        )
                    }
                    return null
                })}
            </ul>
        )
    }
}

export class SettingsLink extends React.Component {
    render() {
        const userLevel = this.props.userLevel

        if (userLevel <= this.props.settingsPage.userLevel) {
            return(
                <ul>
                    <li className="always-show">
                        <NavLink activeClassName="active" to="/settings">
                            <i className={"mdi " + this.props.settingsPage.icon} />
                            <span className="link-text">
                                <FormattedMessage id={this.props.settingsPage.textId} />
                            </span>
                        </NavLink>
                    </li>
                </ul>
            )
        }
        return null
    }
}



@connect(
    state => state.surveyProfile,
    dispatch => bindActionCreators(actionCreators, dispatch)
)
export default class DashboardSidebar extends React.Component {
    truncate(string, length) {
        // truncates username if too long to display on sidebar
        if (string.length > length) {
            return string.slice(0, length-3) + '...'
        }
        return string
    }

    componentWillMount = () => {
        this.props.fetchSurveyAvatar()
    }

    render() {
        return (
            <div className={classNames(styles, "fix-scroll")}>
                <div className="current-user">
                    <Link to="/surveyprofile" className="name"> 
                        <img src={this.props.avatarUri} className="avatar" />
                        <span>
                            { this.truncate(this.props.surveyName, 18) }
                            <i className="mdi mdi-chevron-down" />
                        </span>
                    </Link>
                </div>

                <div className="menu-section">
                    <SidebarLinks pages={this.props.sidebar.menu}
                        userLevel={this.props.userLevel} />
                </div>


                <div className="bottom-menu">
                    <div className="settings-section">
                        <SettingsLink settingsPage={this.props.sidebar.settings}
                                      userLevel={this.props.userLevel} />
                    </div>

                    <ul className="submenu">
                        <li>
                            <Link to="/">
                                <i className="mdi mdi-help-circle-outline" />
                            </Link>
                        </li>
                        <li className="always-show">
                            <i onClick={this.props.logout} className="mdi mdi-exit-to-app" /> 
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}
