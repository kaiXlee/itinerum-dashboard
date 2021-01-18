/* 
 * src/components/AvatarFileSelect.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'

import FileSelect from 'components/FileSelect'

import { baseStyles } from 'app/appStyles/baseStyles.scss'
import { styles } from './avatarFileSelect.scss'


export default class AvatarFileSelect extends React.Component {
    warningTextJSX = () => {
        if (this.props.errorMessage) {
            return(
                <div className="spacer error-text">
                    <p>
                        <FormattedMessage id={this.props.errorMessage} />
                        {' ' + this.props.maxFilesize + '.'}
                    </p>
                </div>
            )
        } else {
            return(
                <div className="spacer img-size-text">
                    <p><FormattedMessage id="profile.uploadAvatar.imageSizeText" /></p>
                </div>
            )
        }
    }

    render() {
        return(
            <section className={classNames(styles)}>
                <div className="row">
                    <div className="col-xs-3">
                        <div className="profile-img">
                            <img src={this.props.imgUri} />
                        </div>
                    </div>

                    <div className="col-xs-9">
                        <p><FormattedMessage id='profile.uploadAvatar.helpText' /></p>
                        <FileSelect formattedLabelId={'profile.uploadAvatar.label'}
                                    fileSelectAction={this.props.uploadAvatarImg} />
                        { this.warningTextJSX() }
                    </div>
                </div>
            </section>
        )
    }
}

AvatarFileSelect.propTypes = {
    imgUri: PropTypes.string.isRequired,
    maxFilesize: PropTypes.string.isRequired,
    errorMessage: PropTypes.string.isRequired,
    uploadAvatarImg: PropTypes.func.isRequired
}
