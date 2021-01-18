/*
 * src/app/prompts/index.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, Prompt } from 'react-router-dom'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { modal } from 'lib/react-redux-modal'

import Stack from './PromptsWizardComponent/Stack'
import Selection from './PromptsWizardComponent/Selection'
import WarningModal from './PromptsWizardComponent/warningModal'
import { PromptTypes } from './PromptsWizardComponent/itemTypes'

import * as actionCreators from './promptsActions'
import { styles } from './styles.scss'


@connect(
    state => state.prompts,
    dispatch => bindActionCreators(actionCreators, dispatch)
)
@DragDropContext(HTML5Backend)
class PromptsWizardView extends React.Component {
    static propTypes = {
        pageEdited: PropTypes.bool.isRequired,
        surveyStarted: PropTypes.bool.isRequired
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    }


    componentWillMount() {
        this.props.fetchPrompts()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.saveStatus === true) {
            this.showWarningModal(this.props.intl.formatMessage({id: 'promptsWizard.warnings.successTitle'}),
                                  this.props.intl.formatMessage({id: 'promptsWizard.warnings.success'}))
            this.props.dismissSuccessModal()
        }        
    }

    routerWillLeave = (nextLocation) => {
        return new Promise((resolve, reject) => {
            if (!this.props.pageEdited) {
                // No unsaved changes -- leave
                resolve(true)
            } else {
                // Unsaved changes -- ask for confirmation
                this.showSaveModal({
                    callback: result => resolve(result)
                })
            }
        })
    }    

    addPrompt = (prompt) => {
        this.props.addPrompt(prompt)
    }

    findPrompt = (id) => {
        const { stack } = this.props
        const prompt = stack.filter(q => q.promptsId === id)[0]
        return {
            prompt,
            index: stack.indexOf(prompt)
        }
    }

    promptsToJson = (nextProps) => {
        let stack
        if (nextProps) {
            stack = nextProps.stack
        } else {
            stack = this.props.stack
        }

        // reduce stack object to JSON schema of survey
        const json = stack.map((promptQuestion, index) => {
            const { id, prompt, colName, answerRequired, ...fields } = promptQuestion.data.form
            const clonedPromptQuestion = Object.assign({}, null, {
                prompt, colName, fields, answerRequired
            })
            clonedPromptQuestion.id = promptQuestion.id

            if (clonedPromptQuestion.answerRequired === undefined) {
                clonedPromptQuestion.answerRequired = true
            }

            return clonedPromptQuestion
        })
        return json
    }

    toggleView = (promptsId) => {
        const { prompt, index } = this.findPrompt(promptsId)
        this.props.togglePromptView({ prompt, index })
    }

    movePrompt = (id, toIndex) => {
        const { prompt, index } = this.findPrompt(id)
        this.props.movePrompt({prompt, index, toIndex})
    }

    deletePrompt = (promptsId) => {
        const { prompt, index } = this.findPrompt(promptsId)
        this.props.deletePrompt(index)
    }

    editPrompt = (promptsId, fieldName, fieldIndex, value) => {
        const { prompt, index } = this.findPrompt(promptsId)
        this.props.editPrompt({prompt, index, fieldName, fieldIndex, value})
    }

    addPromptField = (promptsId, fieldName) => {
        const { prompt, index } = this.findPrompt(promptsId)
        this.props.addFieldToPrompt({ prompt, index, fieldName })
    }

    deletePromptField = (promptsId, fieldName) => {
        const { prompt, index } = this.findPrompt(promptsId)
        this.props.deleteFieldFromPrompt({ prompt, index, fieldName })
    }

    editColName = (promptsId, text) => {
        const { prompt, index } = this.findPrompt(promptsId)
        this.props.editPrompt({prompt, index, fieldName: 'colName', fieldIndex: null, value: text})
    }

    savePrompts = ({showSuccess}) => {
        const json = this.promptsToJson()
        if (json) {
            this.props.savePrompts(json, showSuccess)
        }
        return json
    }

    resetPrompts = (e) => {
        console.warn('THIS WILL DELETE YOUR ENTIRE SURVEY')
        this.props.resetPrompts()
    }

    showWarningModal = (warningTitle, warningText) => {
        const titleJSX = (
            <div className="title">
                {warningTitle}
            </div>
        )

        modal.add(WarningModal, {
            title: titleJSX,
            size: 'medium',
            closeOnOutsideClick: true,
            warningText
        })
    }

    showSaveModal = (callback) => {
        const titleJSX = (
            <div className="title">
                <FormattedMessage id='surveyWizard.leaveConfirmation.modal.title' />
            </div>
        )

        modal.add(SaveOnLeaveModal, {
            title: titleJSX,
            size: 'medium',
            closeOnOutsideClick: true,
            savePrompts: this.savePrompts,
            navigate: callback
        })
    }    

    render() {
        const { stack } = this.props
        const { formatMessage } = this.props.intl

        // construct props object to pass to every new question prompt
        // dragged to the prompts stack
        const promptProps = {
            toggleView: this.toggleView,
            findPrompt: this.findPrompt,
            movePrompt: this.movePrompt,
            deletePrompt: this.deletePrompt,
            editPrompt: this.editPrompt,
            addPromptField: this.addPromptField,
            deletePromptField: this.deletePromptField,
            editColName: this.editColName
        }

        // check whether any questions are currently being edited
        let saveStatus
        const promptOpenForEditing = stack.some(prompt => {
            return prompt.data.edit
        })

        // create the response message to display when a user has clicked
        // the 'save prompts' button
        if (promptOpenForEditing) {
            saveStatus = <FormattedMessage id='promptsWizard.savePromptsText.open' />
        } else if (this.props.saveStatus === (true || false)) {
            saveStatus = this.props.saveMessage
        }
        if (this.props.surveyStarted) {
            saveStatus = <FormattedMessage id='promptsWizard.savePromptsText.active' />
        }

        let modalMessage = ''
        if (promptOpenForEditing) {
            modalMessage = this.props.intl.formatMessage({id: 'promptsWizard.warnings.editingQuestion'})
        } else if (this.props.pageEdited) {
            modalMessage = this.props.intl.formatMessage({id: 'surveyWizard.leaveConfirmation.modal.text'})
        }        

        return (
            <section className={classNames(styles)}>
                <Prompt when={this.props.pageEdited} message={modalMessage} />

                <div className="content-wrapper">
                    <div className="row prompts-help">
                        <div className="col-xs-10">
                            <p><FormattedMessage id='promptsWizard.pageHelpText' /></p>
                        </div>
                        <div className="col-xs-2 prompts-parameters">
                            <Link className="pull-right" to={{pathname: "settings", hash: "#survey"}}>
                                <i className="mdi mdi-settings" />
                                <span className="link-text">
                                    <FormattedMessage id="promptsWizard.settings.promptAttributes"  />
                                </span>                    
                            </Link>
                        </div>                        
                    </div>


                    <div className="selections">
                        <div className="col-xs-12">
                            {PromptTypes.map((prompt, index) => {
                                return <Selection key={index}
                                                  prompt={prompt}
                                                  draggingEnabled={!this.props.surveyStarted} />
                            })}
                        </div>
                    </div>                    
                    <div className="row prompts-page">
                        <div className="col-xs-12">
                            <Stack stack={stack}
                                promptTypes={PromptTypes}
                                addPrompt={prompt => this.addPrompt(prompt)}
                                promptProps={promptProps} />


                            <div className="save-survey text-center">
                                <button type="button" className="btn btn-primary"
                                    onClick={this.savePrompts}
                                    disabled={this.props.surveyStarted}>
                                    <i className="mdi mdi-content-save" />
                                    &nbsp;<b><FormattedMessage id='promptsWizard.savePromptsBtn' /></b>
                                </button>
                            </div>

                            <div className="row prompts-save-status text-center">
                                {saveStatus}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default injectIntl(PromptsWizardView)

