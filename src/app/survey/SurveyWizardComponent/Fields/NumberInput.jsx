/*
 * src/app/survey/SurveyWizard/Fields/NumberInput.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import Template from './Template'
import { styles } from '../styles'

export class NumberInput extends React.Component {
    constructor(props) {
        super(props)
        this.editField = this.editField.bind(this)
    }


    toggleView() {
        this.props.toggleView(this.props.surveyId)
    }


    editField(e) {
        // submit edited information to dashboard reducer
        const surveyId = this.props.surveyId
        const fieldName = e.target.name
        const fieldIndex = null
        const value = e.target.value
        this.props.editQuestion(surveyId, fieldName, fieldIndex, value)
    }


    renderEdit() {
        // view when form field is being edited
        const { email } = this.props.data.form

        return(
            <div className="form-field email">
                <div className="row email-input">
                    <input disabled />
                </div>
            </div>                
        )
    }


    renderPreview() {
        // view when form field input is disabled

        return(
            <div className="form-field email">
                <div className="row email-input">
                    <input disabled />
                </div>
            </div>
        )        
    }


    render() {
        const view = this.props.data.edit ? this.renderEdit() : this.renderPreview()

        return(
            <Template prompt={this.props.data.form.prompt}
                edit={this.props.data.edit}
                editField={this.editField}
                { ...this.props }>
                {view}
            </Template>
        )
    }
}