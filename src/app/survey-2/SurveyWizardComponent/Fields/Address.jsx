/*
 * src/app/survey-2/SurveyWizard/Fields/Address.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import Template from './Template'
import { styles } from '../styles'
import MapImg from './img/map.jpg'

export class Address extends React.Component {
    constructor(props) {
        super(props)
        this.editField = this.editField.bind(this)
    }

    editField(e) {
        const surveyId = this.props.surveyId
        const fieldName = e.target.name
        const fieldIndex = null
        const value = e.target.value
        this.props.editQuestion(surveyId, fieldName, fieldIndex, value)
    }

    renderEdit() {
        return(
            <div className="form-field address">
                <img src={MapImg} />
                <p className="caption">
                    <FormattedMessage id='surveyWizard.components.address.helpText' />
                </p>
            </div>
        )
    }

    renderPreview() {
        return(
            <div className="form-field address">
                <i className="mdi mdi-map-marker" />
                <p className="caption">
                    <FormattedMessage id='surveyWizard.components.address.helpText' />
                </p>
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
