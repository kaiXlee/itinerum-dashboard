/*
 * components/EditAboutTextModal.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { baseStyles } from 'app/appStyles/baseStyles.scss'
import { modalStyles } from './modals.scss'


export default class EditAboutTextModal extends React.Component {
    render() {
        return(
            <section className={classNames(baseStyles, modalStyles)}>
                <div className="modal-body">
                    <FormattedMessage id="settings.survey.aboutText.modal.helpText" />

                    <div className="about-textarea">
                        <textarea rows="16" cols="100"
                                  defaultValue={this.props.aboutText}
                                  onChange={(e) => {this.props.editAboutText(e.target.value)}} />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="button medium"
                            data-dismiss="modal"
                            onClick={this.props.removeModal}>
                        <FormattedMessage id="settings.survey.aboutText.modal.closeBtn" />
                    </button>
                </div>
            </section>
        )
    }
}


EditAboutTextModal.propTypes = {
    aboutText: PropTypes.string.isRequired,
    editAboutText: PropTypes.func.isRequired,
    removeModal: PropTypes.func.isRequired
}
