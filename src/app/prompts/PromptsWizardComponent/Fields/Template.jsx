/*
 * src/app/prompts/PromptsWizardComponent/Fields/Template.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import { styles } from '../styles'


class Template extends React.Component {
    toggleView = () => {
        this.props.toggleView(this.props.promptsId)
    }

    editColName = (e) => {
        const text = e.target.value
        this.props.editColName(this.props.promptsId, text)
    }

    enterToggle = (e) => {
        // only handle enter key events
        if (e.keyCode !== 13) return
        this.toggleView()
    }

    deletePrompt = () => {
        this.props.deletePrompt(this.props.promptsId)
    }

    renderEdit() {
        let promptValue
        if (this.props.prompt) {
            promptValue = this.props.intl.formatMessage({
                id: this.props.prompt, 
                defaultMessage: this.props.prompt
            })
        }

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
                    <form className="form-horizontal colname" role="form">
                        <div className="form-group">
                            <label className="control-label">
                                <FormattedMessage id='promptsWizard.components.fieldLabel' />
                            </label>
                            <input type="text" value={this.props.data.form.colName} onChange={this.editColName} />
                        </div>
                    </form>

                    <div className="pull-right">
                        <button className="edit" onClick={this.toggleView}>
                            <FormattedMessage id='promptsWizard.components.setBtn' />
                        </button>
                    </div>

                    <div className="pull-right">
                        <button className="delete" onClick={this.deletePrompt}>
                            <FormattedMessage id='promptsWizard.components.deleteBtn' />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    renderPreview() {
        let promptQuestionJSX = this.props.prompt ? <FormattedMessage id={this.props.prompt} /> 
                                                  : undefined

        return(
            <div className="container-fluid">
                <div className="row title">
                    <p>{ promptQuestionJSX }</p>
                </div>

                {this.props.children}

                <div className="row controls">
                    <div className="pull-right">
                        <button className="edit" onClick={this.toggleView}>
                            <FormattedMessage id='promptsWizard.components.editBtn' />
                        </button>
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