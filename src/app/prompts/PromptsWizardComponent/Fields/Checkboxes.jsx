/*
 * src/app/prompts/PromptsWizardComponent/Fields/Checkboxes.js
 */
import React from 'react'
import PropTypes from 'prop-types'

import Template from './Template'
import { styles } from '../styles'


export class Checkboxes extends React.Component {
    constructor(props) {
        super(props)
        this.editField = this.editField.bind(this)
        this.addField = this.addField.bind(this)
        this.deleteField = this.deleteField.bind(this)
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

    addField() {
        this.props.addPromptField(this.props.promptsId, 'choices')
    }

    deleteField() {
        if (this.props.data.form.choices.length > 2) {
            this.props.deletePromptField(this.props.promptsId, 'choices')
        }
    }

    renderEdit() {
        const { choices } = this.props.data.form

        return (
            <section>
                <div className="row-fluid text-center add-remove">
                    <div>
                    <button className="btn btn-success" onClick={this.addField}><i className="material-icons">+</i></button>
                    <button className="btn btn-danger" onClick={this.deleteField}><i className="material-icons">-</i></button>
                    </div>
                </div>            
                <div className="form-field">
                    {choices.map((choice, index) => {
                        return(
                            <div className="row choice editing" key={index}>
                                <label>•</label>
                                <input type="text" name={"choices-"+index} value={choice} onChange={this.editField} />
                            </div>
                        )
                    })}
                </div>
            </section>
        )
    }

    renderPreview() {
        const { prompt, choices } = this.props.data.form

        return(
            <div className="form-field">
                {choices.map((choice, index) => {
                    return(
                        <li className="checkbox choice" key={index}>
                            <label><input type="checkbox" />{choice}</label>
                        </li>
                    )
                })}
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
