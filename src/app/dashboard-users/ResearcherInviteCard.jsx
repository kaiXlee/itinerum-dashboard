/*
 * components/ResearcherInviteCard.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { styles } from './researcherInviteCard.scss'


export default class ResearcherInviteCard extends React.Component {
    componentWillMount() {
        this.props.fetchInviteCode()
    }

    refreshIconJSX = () => {
        return this.props.inviteCodeIsUpdating ? <i className="loading-spinner refresh" />
                                               : <i className="material-icons">autorenew</i>
    }

    render() {
        return(
            <section className={classNames(styles)}>
                <div className="row">
                    <div className="col-xs-12">
                        <h4><FormattedMessage id="permissions.header.inviteTitle"/></h4>
                        <p><FormattedMessage id="permissions.header.inviteHelpText"/></p>
                    </div>
                </div>

                <div className="row text-center">
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="col-xs-4 code-label"
                                   htmlFor="registration-code-input">
                                <FormattedMessage id='permissions.header.inviteCodeLabel' />
                            </label>

                            <div className="col-xs-8 input-group">
                                <input className="form-control i-input text-field text-center"
                                       id="registration-code-input"
                                       type="text"
                                       placeholder="Code"
                                       value={this.props.inviteCode}
                                       readOnly />

                                <div className="input-group-addon after">
                                    <button className="button small refresh" onClick={this.props.refreshInviteCode}>
                                        <span className="button-text">
                                            { this.refreshIconJSX() }
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}


ResearcherInviteCard.propTypes = {
    inviteCodeIsUpdating: PropTypes.bool.isRequired,
    fetchInviteCode: PropTypes.func.isRequired,
    inviteCode: PropTypes.string.isRequired,
    refreshInviteCode: PropTypes.func.isRequired
}
