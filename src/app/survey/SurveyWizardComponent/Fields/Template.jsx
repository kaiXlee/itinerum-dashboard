/*
 * src/app/survey/SurveyWizard/Fields/Template.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import { styles } from '../styles'


class Template extends React.Component {
    constructor(props) {
        super(props)
        this.toggleView = this.toggleView.bind(this)
        this.deleteQuestion = this.deleteQuestion.bind(this)
        this.enterToggle = this.enterToggle.bind(this)
        this.editColName = this.editColName.bind(this)
    }

    toggleView() {
        this.props.toggleView(this.props.surveyId)
    }

    editColName(e) {
        const text = e.target.value
        this.props.editColName(this.props.surveyId, text)
    }

    enterToggle(e) {
        // only handle enter key events
        if (e.keyCode !== 13) return
        this.toggleView()
    }

    deleteQuestion() {
        this.props.deleteQuestion(this.props.surveyId)
    }

    renderEdit() {
        let promptValue
        if (this.props.prompt) {
            promptValue = this.props.intl.formatMessage({
                id: this.props.prompt, 
                defaultMessage: this.props.prompt
            })
        }

        // test whether stack question is mandatory for allowing editing column name or deleting
        const editColNameElement = (
            <form className="form-horizontal colname" role="form">
                <div className="form-group">
                    <label className="control-label"><FormattedMessage id='surveyWizard.components.fieldLabel' /></label>
                    <input type="text" value={this.props.data.form.colName} onChange={this.editColName} />
                </div>
            </form>
        )
        const deleteElement = (
            <div className="pull-right">
                <button className="delete" onClick={this.deleteQuestion}>
                    <FormattedMessage id='surveyWizard.components.deleteBtn' />
                </button>
            </div>
        )
        const editColNameField = (this.props.mandatory !== true) ? editColNameElement : null
        const deleteFieldButton = (this.props.mandatory !== true) ? deleteElement : null

        return(
            <div className="container-fluid" onKeyUp={this.enterToggle}>
                <div className="row title editable">
                    <span>
                        <input name="prompt" value={promptValue} onChange={this.props.editField} />
                        <i className="mdi mdi-pencil" />
                    </span>
                </div>

                {this.props.children}

                <div className="row controls">
                    { editColNameField }
                    <div className="pull-right">
                        <button className="edit" onClick={this.toggleView}><FormattedMessage id='surveyWizard.components.saveBtn' /></button>
                    </div>
                    { deleteFieldButton }
                </div>
            </div>
        )
    }

    renderPreview() {
        let promptValue
        if (this.props.prompt) {
            promptValue = this.props.intl.formatMessage({
                id: this.props.prompt, 
                defaultMessage: this.props.prompt
            })
        }


        return(
            <div className="container-fluid">
                <div className="row title">
                    <p>{promptValue}</p>
                </div>

                {this.props.children}

                <div className="row controls">
                    <div className="pull-right">
                        <button className="edit" onClick={this.toggleView}><FormattedMessage id='surveyWizard.components.editBtn' /></button>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const field = this.props.edit ? this.renderEdit() : this.renderPreview()
        return field
    }
}

export default injectIntl(Template)
