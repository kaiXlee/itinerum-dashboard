/*
 * components/SurveySettingsCard.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { modal } from 'lib/react-redux-modal'

import EditAboutTextModal from 'components/EditAboutTextModal'
import EditTermsOfServiceModal from 'components/EditTermsOfServiceModal'
import SaveButton from 'components/SaveButton'
import { styles } from './surveySettingsCard.scss'


export default class SurveySettingsCard extends React.Component {
    showEditAboutTextModal = () => {
        const titleJSX = (
            <div className="title">
                <FormattedMessage id="settings.survey.aboutText.modal.title" />
            </div>
        )

        modal.add(EditAboutTextModal, {
            title: titleJSX,
            size: 'large',
            closeOnOutsideClick: true,
            aboutText: this.props.aboutText,
            editAboutText: this.props.editAboutText
        })
    }

    showEditTermsOfServiceModal = () => {
        const titleJSX = (
            <div className="title">
                <FormattedMessage id="settings.survey.termsOfService.modal.title" />
            </div>
        )

        modal.add(EditTermsOfServiceModal, {
            title: titleJSX,
            size: 'large',
            closeOnOutsideClick: true,
            termsOfService: this.props.termsOfService,
            editTermsOfService: this.props.editTermsOfService
        })
    }

    render() {
        return(
            <section className={classNames(styles)}>
                <div className="card">
                    {/* Survey parameters */}
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="title">
                                <h3><FormattedMessage id='settings.survey.title' /></h3>
                            </div>
                            <div className="help-text">
                                <p><FormattedMessage id='settings.survey.administrator.helpText' /></p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="settings-button-group">
                                <button className="button"
                                        onClick={this.showEditAboutTextModal}>
                                    <i className="material-icons button-icon">edit</i>
                                    <span className="button-text">
                                        <FormattedMessage id='settings.survey.aboutTextEditBtn' />
                                    </span>
                                </button>

                                <button className="button"
                                        onClick={this.showEditTermsOfServiceModal}>
                                    <i className="material-icons button-icon">edit</i>
                                    <span className="button-text">
                                        <FormattedMessage id='settings.survey.termsOfServiceEditBtn' />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="row equal contact-email-row">
                        <div className="col-xs-4">
                            <label><FormattedMessage id='settings.survey.contactEmailLabel' /></label>
                        </div>
                        <div className="col-xs-8 col-sm-6 col-md-5">
                            <input className="i-input icon-field"
                                   type="text"
                                   onChange={(e) => this.props.editContactEmail(e.target.value)}
                                   value={this.props.contactEmail} />
                            <i className="material-icons i-input-icon">email</i>
                        </div>
                    </div>

                    {/* Save button */}
                    <div className="row">
                        <div className="col-xs-12 col-sm-10 col-md-9">
                            <SaveButton classNames="pull-right"
                                        isEdited={this.props.isEdited}
                                        isSaving={this.props.isSaving}
                                        save={this.props.saveSettings} />
                        </div>
                    </div>                    

                    {/* Prompts parameters */}
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="title">
                                <h4><FormattedMessage id='settings.survey.prompts.title' /></h4>
                            </div>

                            <div className="help-text">
                                <p><FormattedMessage id='settings.survey.prompts.attributesHelp' /></p>
                            </div>
                        </div>
                    </div>
                    <div className="row equal">
                        <div className="col-xs-4 col-sm-6">
                            <label><FormattedMessage id='settings.survey.prompts.maxDays' /></label>
                        </div>
                        <div className="col-xs-8 col-sm-4 col-md-3">
                            <input className="i-input icon-field"
                                   type="number"
                                   onChange={(e) => this.props.editSurveyMaxDays(e.target.value)}
                                   value={this.props.surveyMaxDays}
                                   min={0} />
                            <i className="material-icons i-input-icon">date_range</i>
                        </div>                        
                    </div>
                    <div className="row equal">
                        <div className="col-xs-4 col-sm-6">
                            <label><FormattedMessage id='settings.survey.prompts.maxPrompts' /></label>
                        </div>
                        <div className="col-xs-8 col-sm-4 col-md-3">
                            <input className="i-input icon-field"
                                   type="number"
                                   onChange={(e) => this.props.editSurveyMaxPrompts(e.target.value)}
                                   value={this.props.surveyMaxPrompts}
                                   min={0} />
                            <i className="material-icons i-input-icon">flag</i>
                        </div>                        
                    </div>
                    {/* Save button */}
                    <div className="row">
                        <div className="col-xs-12 col-sm-10 col-md-9">
                            <SaveButton classNames="pull-right"
                                        isEdited={this.props.isEdited}
                                        isSaving={this.props.isSaving}
                                        save={this.props.saveSettings} />
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}


SurveySettingsCard.propTypes = {
    aboutText: PropTypes.string,
    contactEmail: PropTypes.string.isRequired,
    editAboutText: PropTypes.func.isRequired,
    editContactEmail: PropTypes.func.isRequired,
    editSurveyMaxDays: PropTypes.func.isRequired,
    editSurveyMaxPrompts: PropTypes.func.isRequired,
    editTermsOfService: PropTypes.func.isRequired,
    isEdited: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    saveSettings: PropTypes.func.isRequired,
    surveyMaxDays: PropTypes.number.isRequired,
    surveyMaxPrompts: PropTypes.number.isRequired,
    termsOfService: PropTypes.string
}
