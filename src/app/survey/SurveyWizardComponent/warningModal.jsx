/*
 * src/app/survey/SurveyWizardComponent/warningModal.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import ReactDOM from 'react-dom'
import { FormattedMessage } from 'react-intl'

import { styles } from './modalStyles.scss'


export default class WarningModal extends React.Component {
    static propTypes = {
        warningText: PropTypes.string.isRequired
    }

    handleClose = (e) => {
        this.props.removeModal()
    }

    render() {
        return(
            <div className={classNames(styles)}>
                <div className="modal-body">
                    <div className="warning-text">
                        {this.props.warningText}
                    </div>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.handleClose}>
                        <FormattedMessage id='surveyWizard.settings.warning.modal.closeBtn' />
                    </button>                
                </div>
            </div>
        )
    }
}
