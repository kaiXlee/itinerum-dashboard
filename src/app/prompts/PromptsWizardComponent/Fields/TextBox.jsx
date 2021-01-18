/*
 * src/app/prompts/PromptsWizardComponent/Fields/TextBox.js
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
        const promptsId = this.props.promptsId
        const value = e.target.value

        // determine whether field option is part of array
        // and if so, keep track of its respective index
        let fieldName = e.target.name
        let fieldIndex = null
        if (fieldName.indexOf('-') !== -1) {
            const dashIndex = fieldName.indexOf('-')
            fieldIndex = parseInt(fieldName.slice(dashIndex + 1))
            fieldName = fieldName.slice(0, dashIndex)
        }
        this.props.editPrompt(promptsId, fieldName, fieldIndex, value)
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