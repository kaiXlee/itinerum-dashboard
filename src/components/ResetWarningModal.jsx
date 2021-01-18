/*
 * components/ResetWarningModal.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { baseStyles } from 'app/appStyles/baseStyles.scss'
import { modalStyles } from './modals.scss'


export default class ResetWarningModal extends React.Component {
    enterKeySubmit = (e) => {
        const enterKeyCode = 13
        if (e.keyCode === enterKeyCode) {
            this.resetConfirmationTest()
        }
    }

    resetConfirmationTest = () => {
        const userInput = this.refs.deleteConfirmation.value.toLowerCase()
        if (userInput === 'delete me') {
            this.props.resetSurveyData()
            this.refs.deleteConfirmation.value = '';
            this.props.removeModal()

        } else {
            console.warn("input doesn't match, cancelling survey reset")
        }
    }

    render() {
        return(
            <section className={classNames(baseStyles, modalStyles)}>
                <div className="modal-body">
                    <p>Resetting your survey will drop any existing users and responses. Please enter
                    <span className="delete-text"> delete me</span> in the field below if you are sure you would like to start over: </p>
                    <div className="form-group">
                        <input type="text" className="form-control" ref="deleteConfirmation" onKeyUp={this.enterKeySubmit} />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="button medium"data-dismiss="modal" onClick={this.props.removeModal}>Cancel</button>
                    <button className="button medium danger" onClick={this.resetConfirmationTest}>Delete My Survey</button>
                </div>

            </section>
        )
    }
}


ResetWarningModal.propTypes = {
    removeModal: PropTypes.func.isRequired,
    resetSurveyData: PropTypes.func.isRequired
}
