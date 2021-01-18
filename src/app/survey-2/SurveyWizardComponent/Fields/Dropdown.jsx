/*
 * src/app/survey-2/SurveyWizard/Fields/Dropdown.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'

import Template from './Template'
import { styles } from '../styles'


export class Dropdown extends React.Component {
    constructor(props) {
        super(props)
        this.editField = this.editField.bind(this)
        this.addField = this.addField.bind(this)
        this.deleteField = this.deleteField.bind(this)
    }

    editField(e) {
        const surveyId = this.props.surveyId
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
        this.props.editQuestion(surveyId, fieldName, fieldIndex, value)
    }


    addField() {
        this.props.addQuestionField(this.props.surveyId, 'choices')
    }

    deleteField() {
        if (this.props.data.form.choices.length > 2) {
            this.props.deleteQuestionField(this.props.surveyId, 'choices')
        }
    }

    renderEdit() {
        const { choices } = this.props.data.form

        return (
            <div className="form-field dropdown">
                <div className="row-fluid text-center add-remove">
                    <div>
                        <button className="btn btn-success" onClick={this.addField}><i className="material-icons">+</i></button>
                        <button className="btn btn-danger" onClick={this.deleteField}><i className="material-icons">-</i></button>
                    </div>
                </div>            
                {choices.map((choice, index) => {
                    return(
                        <div className="row choice editing" key={index}>
                            <label>•</label>
                            <input type="text" name={"choices-"+index} value={choice} onChange={this.editField} />
                        </div>
                    )
                })}
            </div>
        )
    }

    renderPreview() {
        const { prompt, choices } = this.props.data.form

        return(
                <div className="form-field dropdown">
                    <div className="row dropdown-select">
                        <label className="select-label">
                        <select className="form-control choice">
                            {choices.map((choice, index) => {
                                return <option key={index} value={choice}>{choice}</option>
                            })}
                        </select>
                        </label>
                    </div>
                </div>
        )
    }

    render() {
        const view = this.props.data.edit ? this.renderEdit() : this.renderPreview()
        return(
            <Template prompt={this.props.data.form.prompt}
                mandatory={this.props.data.mandatory}
                edit={this.props.data.edit}
                editField={this.editField}
                { ...this.props }>
                {view}
            </Template>
        )
    }
}
