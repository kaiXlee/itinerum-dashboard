/*
 * src/app/survey/SurveyWizard/Fields/TextBox.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import Template from './Template'
import { styles } from '../styles'


export class TextBox extends React.Component {
    constructor(props) {
        super(props)
        this.editField = this.editField.bind(this)
    }


    toggleView() {
        this.props.toggleView(this.props.surveyId)
    }


    editField(e) {
        const surveyId = this.props.surveyId
        const fieldName = e.target.name
        const fieldIndex = null
        const value = e.target.value
        this.props.editQuestion(surveyId, fieldName, fieldIndex, value)
    }


    renderEdit() {
        let { text } = this.props.data.form

        return(
            <div className="form-field textbox">
                <div className="row textbox-input">
                    <div className="form-group">
                        <textarea className="form-control" name="text" rows="5" value={text} onChange={this.editField} />
                    </div>
                </div>
            </div>                
        )
    }


    renderPreview() {
        const { text } = this.props.data.form

        return(
            <div className="form-field textbox">
                <div className="row textbox-input">
                    <p>{text}</p>
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