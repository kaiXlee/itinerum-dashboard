/*
 * src/containers/SurveyWizard/index.js
 */
import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { Prompt } from 'react-router'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { modal } from 'lib/react-redux-modal'

import Stack from './SurveyWizardComponent/Stack'
import Selection from './SurveyWizardComponent/Selection'
import WarningModal from './SurveyWizardComponent/warningModal'
import EditAboutTextModal from 'components/EditAboutTextModal'
import EditTermsOfServiceModal from 'components/EditTermsOfServiceModal'

import * as actionCreators from './surveyActions'
import { baseStyles } from 'app/appStyles/baseStyles.scss'
import { styles } from './styles.scss'


function getDuplicateColumns(array) {
    // find and return all duplicates within an array of survey questions
    const unique = array.map((prompt) => {
        return { count: 1, colName: prompt.colName }
    }).reduce((a, b) => {
        a[b.colName] = (a[b.colName] || 0) + b.count
        return a
    }, {})
    const duplicates = Object.keys(unique).filter((a) => unique[a] > 1)
    return duplicates
}


@connect(
    state => state.survey,
    dispatch => bindActionCreators(actionCreators, dispatch)
)
@DragDropContext(HTML5Backend)
class SurveyWizardView extends React.Component {
    static propTypes = {
        updateAboutText: PropTypes.func.isRequired,
        updateTermsOfService: PropTypes.func.isRequired,
        surveyStarted: PropTypes.bool.isRequired,
        pageEdited: PropTypes.bool.isRequired,
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    }

    componentWillMount() {
        this.props.fetchSurveySchema()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.saveStatus === true) {
            this.showWarningModal(this.props.intl.formatMessage({id: 'surveyWizard.warnings.successTitle'}),
                                  this.props.intl.formatMessage({id: 'surveyWizard.warnings.success'}))
            this.props.dismissSuccessModal()
        }
    }

    componentWillUnmount() {
        this.props.dismissSuccessModal()
    }

    // add new question as last item in survey
    addSelectionToSurvey(question) {
        this.props.addQuestionToSurveyStack(question)
    }

    findQuestion = (id) => {
        const { stack } = this.props,
              question = stack.filter(q => q.surveyId === id)[0]
        return {
            question,
            index: stack.indexOf(question)
        }
    }

    surveyToJson = (nextProps) => {
        let stack
        if (nextProps) {
            stack = nextProps.stack
        } else {
            stack = this.props.stack
        }

        // reduce stack object to JSON schema of survey
        const json = stack.map((question, index) => {
            const { id, prompt, colName, answerRequired, ...fields } = question.data.form
            const clonedQuestion = Object.assign({}, null, {
                prompt, colName, fields, answerRequired
            })
            clonedQuestion.id = question.id

            if (clonedQuestion.answerRequired === undefined) {
                clonedQuestion.answerRequired = true
            }

            return clonedQuestion
        })
        return json
    }

    toggleView = (surveyId) => {
        const { question, index } = this.findQuestion(surveyId)
        this.props.toggleQuestionViewInSurveyStack({ question, index })
    }

    moveQuestion = (id, toIndex) => {
        const { question, index } = this.findQuestion(id)
        this.props.moveQuestionInSurveyStack({question, index, toIndex})
    }

    deleteQuestion = (surveyId) => {
        const { question, index } = this.findQuestion(surveyId)
        this.props.deleteQuestionInSurveyStack(index)
    }

    editQuestion = (surveyId, fieldName, fieldIndex, value) => {
        const { question, index } = this.findQuestion(surveyId)
        this.props.editQuestionInSurveyStack({question, index, fieldName, fieldIndex, value})
    }

    addQuestionField = (surveyId, fieldName) => {
        const { question, index } = this.findQuestion(surveyId)
        this.props.addFieldToQuestion({ question, index, fieldName })
    }

    deleteQuestionField = (surveyId, fieldName) => {
        const { question, index } = this.findQuestion(surveyId)
        this.props.deleteFieldFromQuestion({ question, index, fieldName })
    }

    editColName = (surveyId, text) => {
        const { question, index } = this.findQuestion(surveyId)
        this.props.editQuestionInSurveyStack({question, index, fieldName: 'colName', fieldIndex: null, value: text})
    }

    questionIsOpenForEditing = () => {
        const { stack } = this.props
        return stack.some(question => {
            return question.data.edit
        })
    }

    getSurveySchema = () => {
        if (this.questionIsOpenForEditing()) {
            // saveStatus = <FormattedMessage id='surveyWizard.saveSurveyText.open' />
            this.showWarningModal(this.props.intl.formatMessage({id: 'surveyWizard.warnings.editingQuestionTitle'}),
                                  this.props.intl.formatMessage({id: 'surveyWizard.warnings.editingQuestion'}))
            return
        }

        const schema = {
            language: this.props.surveyLanguage,
            aboutText: this.props.aboutText,
            termsOfService: this.props.termsOfService,
            questions: this.surveyToJson()
        }

        if (!schema.aboutText || schema.aboutText.length < 1) {
            this.showWarningModal(this.props.intl.formatMessage({id: 'surveyWizard.warnings.missingAboutTextTitle'}),
                                  this.props.intl.formatMessage({id: 'surveyWizard.warnings.missingAboutText'}))
            return
        }


        if (!schema.termsOfService || schema.termsOfService.length < 1) {
            this.showWarningModal(this.props.intl.formatMessage({id: 'surveyWizard.warnings.missingTermsOfServiceTitle'}),
                                  this.props.intl.formatMessage({id: 'surveyWizard.warnings.missingTermsOfService'}))
            return
        }        

        // assert all questions have a unique column identifier
        const blank = schema.questions.some(p => (p.colName == null || p.colName === '') && (p.id < 90))
        if (blank) {
            this.showWarningModal(this.props.intl.formatMessage({id: 'surveyWizard.warnings.columnTitle'}),
                                  this.props.intl.formatMessage({id: 'surveyWizard.warnings.column'}))
            return
        }

        const duplicates = getDuplicateColumns(schema.questions)
        if (duplicates.length > 0) {
            let error = this.props.intl.formatMessage({id: 'surveyWizard.warnings.duplicateColumn'}) + duplicates
            this.showWarningModal(this.props.intl.formatMessage({id: 'surveyWizard.warnings.duplicateColumnTitle'}) + error)
            return
        }

        return schema
    }

    saveSurveySchema = ({showSuccess}) => {
        const schema = this.getSurveySchema()
        if (schema) {
            this.props.saveSurveySchema(schema, showSuccess)
        }
        return schema
    }

    showEditAboutTextModal = () => {
        const titleJSX = (
            <div className="title">
                <FormattedMessage id='settings.survey.aboutText.modal.title' />
            </div>
        )

        modal.add(EditAboutTextModal, {
            title: titleJSX,
            size: 'large',
            closeOnOutsideClick: true,
            aboutText: this.props.aboutText,
            editAboutText: this.props.updateAboutText
        })
    }

    showEditTermsOfServiceModal = () => {
        const titleJSX = (
            <div className="title">
                <FormattedMessage id='settings.survey.termsOfService.modal.title' />
            </div>
        )

        modal.add(EditTermsOfServiceModal, {
            title: titleJSX,
            size: 'large',
            closeOnOutsideClick: true,
            termsOfService: this.props.termsOfService,
            editTermsOfService: this.props.updateTermsOfService,
        })
    }

    showWarningModal = (warningTitle, warningText) => {
        const titleJSX = (
            <div className="title">
                {warningTitle}
            </div>
        )

        modal.add(WarningModal, {
            title: titleJSX,
            size: 'large',
            closeOnOutsideClick: true,
            warningText
        })
    }


    render() {
        const { questionTypes, stack } = this.props

        // construct props object to pass to every new question prompt
        // dragged to the survey stack
        const questionProps = {
            toggleView: this.toggleView,
            findQuestion: this.findQuestion,
            moveQuestion: this.moveQuestion,
            deleteQuestion: this.deleteQuestion,
            editQuestion: this.editQuestion,
            addQuestionField: this.addQuestionField,
            deleteQuestionField: this.deleteQuestionField,
            editColName: this.editColName
        }


        // check whether any questions are currently being edited
        const questionOpenForEditing = stack.some(question => question.data.edit)

        // create the response message to display when a user has clicked
        // the 'save prompts' button
        let surveyStatus
        if (questionOpenForEditing) {
            surveyStatus = <FormattedMessage id='surveyWizard.saveSurveyText.open' />
        } else if (this.props.saveStatus === (true || false)) {
            surveyStatus = this.props.saveMessage
        }
        if (this.props.surveyStarted) {
            surveyStatus = <FormattedMessage id='surveyWizard.saveSurveyText.active' />
        }

        let modalMessage = ''
        if (this.questionIsOpenForEditing()) {
            modalMessage = this.props.intl.formatMessage({id: 'surveyWizard.warnings.editingQuestion'})
        } else if (this.props.pageEdited) {
            modalMessage = this.props.intl.formatMessage({id: 'surveyWizard.leaveConfirmation.modal.text'})
        }

        return (
            <section className={classNames(baseStyles, styles)}>
                <Prompt when={this.props.pageEdited} message={modalMessage} />

                <div className="content-wrapper">
                    <div className="row survey-help">
                        <div className="col-xs-12">
                            <p><FormattedMessage id='surveyWizard.pageHelpText' /></p>
                        </div>
                    </div>
                    <div className="row survey-page">
                        <div className="selections">
                            <div className="col-xs-12">
                                {/* only display optional components as selection buttons (< 90) */}
                                {questionTypes.map((question, index) => {
                                    if (question.id < 90) {
                                        return <Selection key={index} 
                                                          question={question}
                                                          draggingEnabled={!this.props.surveyStarted} />
                                    }
                                })}
                            </div>
                        </div>

                        <div className="col-xs-12">
                            <Stack survey={stack}
                                   questionTypes={questionTypes}
                                   addSelectionToSurvey={question => this.addSelectionToSurvey(question)}
                                   questionProps={questionProps}
                                   showEditAboutTextModal={this.showEditAboutTextModal}
                                   showEditTermsOfServiceModal={this.showEditTermsOfServiceModal}
                                   surveyLanguage={this.props.surveyLanguage}
                                   changeSurveyLanguage={this.props.changeSurveyLanguage} />

                            <div className="save-survey text-center">
                                <button type="button" className="btn btn-primary"
                                    onClick={this.saveSurveySchema}
                                    disabled={this.props.surveyStarted}>
                                    <i className="mdi mdi-content-save" />
                                    &nbsp;<b><FormattedMessage id='surveyWizard.saveSurveyBtn' /></b>
                                </button>
                            </div>

                            <div className="row survey-save-status">
                                <div className="col-xs-6 col-xs-offset-3">
                                    {surveyStatus}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default injectIntl(SurveyWizardView)
