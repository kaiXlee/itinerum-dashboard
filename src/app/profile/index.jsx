/* 
 * src/containers/SurveyProfile/index.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import AvatarFileSelect from './AvatarFileSelect'

import * as actionCreators from './surveyProfileActions'
import { baseStyles } from 'app/appStyles/baseStyles.scss'


@connect(
    state => state.surveyProfile,
    dispatch => bindActionCreators(actionCreators, dispatch)
)
export default class SurveyProfileView extends React.Component {
    static propTypes = {
        avatarUri: PropTypes.string.isRequired,
        avatarErrorMessage: PropTypes.string.isRequired,
        avatarMaxFilesize: PropTypes.string.isRequired,
        uploadSurveyAvatar: PropTypes.func.isRequired
    }

    componentWillMount = () => {
        this.fetchAvatarUrl()
    }

    fetchAvatarUrl = () => {
        this.props.fetchSurveyAvatar()
    }

    render() {
        return(
            <div className={classNames(baseStyles)}>
                <div className="content-wrapper">
                    <div className="card thick">
                        <div className="title">
                            <h2><FormattedMessage id='profile.title' /></h2>
                        </div>

                        <AvatarFileSelect imgUri={this.props.avatarUri}
                                          maxFilesize={this.props.avatarMaxFilesize}
                                          errorMessage={this.props.avatarErrorMessage}
                                          uploadAvatarImg={this.props.uploadSurveyAvatar} />
                    </div>
                </div>
            </div>
        )
    }
}
