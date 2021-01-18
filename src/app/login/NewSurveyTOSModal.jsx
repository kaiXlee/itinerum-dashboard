/*
 * src/app/login/NewSurveyTOSModal.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'


export default class NewSurveyTOSModal extends React.Component {
    handleRefuse = (e) => {
        this.props.removeModal()
    }

    handleRegisterSurvey = () => {
        this.props.registerSurvey()
        this.props.removeModal()
    }

    render() {
        return(
            <section>
                <div className="modal-body">
                    {this.props.termsOfService}
                </div>

                {/* Accept Terms of Service */}
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary"
                                          data-dismiss="modal"
                                          onClick={this.handleRegisterSurvey}>
                        <FormattedMessage id="login.newSurvey.tos.modal.acceptBtn" />
                    </button>
                </div>
            </section>
        )
    }
}

NewSurveyTOSModal.propTypes = {
    title: PropTypes.node.isRequired,
    termsOfService: PropTypes.node.isRequired,
    registerSurvey: PropTypes.func.isRequired,
    removeModal: PropTypes.func.isRequired
}
