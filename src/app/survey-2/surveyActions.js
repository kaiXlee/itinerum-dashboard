/*
 * src/actions/surveyActions.js
 */
import clone from 'clone'
import { baseApiUrl } from 'utils/config'
import { tokenRequest } from 'utils/requests'
import { QuestionTypes } from './SurveyWizardComponent/itemTypes'

const baseUrl = baseApiUrl


export function changeSurveyLanguage(language) {
    return {
        type: 'SURVEY-CHANGE_SURVEY_LANGUAGE',
        language
    }
}

export function updateAboutText(text) {
    return {
        type: 'SURVEY-UPDATE_ABOUT_TEXT',
        text
    }
}

export function updateTermsOfService(text) {
    return {
        type: 'SURVEY-UPDATE_TOS_TEXT',
        text
    }
}

export function addQuestionToSurveyStack(question) {
    return {
        type: 'SURVEY-ADD_QUESTION',
        question
    }
}

export function moveQuestionInSurveyStack(payload) {
    return {
        type: 'SURVEY-MOVE_QUESTION',
        payload
    }
}

export function deleteQuestionInSurveyStack(index) {
    return {
        type: 'SURVEY-DELETE_QUESTION',
        index
    }
}

export function toggleQuestionViewInSurveyStack(payload) {
    return {
        type: 'SURVEY-TOGGLE_QUESTION_VIEW',
        ...payload
    }
}

export function editQuestionInSurveyStack(payload) {
    return {
        type: 'SURVEY-EDIT_QUESTION',
        ...payload
    }
}

export function addFieldToQuestion(payload) {
    return {
        type: 'SURVEY-ADD_FIELD_TO_QUESTION',
        ...payload
    }
}

export function deleteFieldFromQuestion(payload) {
    return {
        type: 'SURVEY-DELETE_FIELD_FROM_QUESTION',
        ...payload
    }
}

function fetchSurveySuccess(payload) {
    return {
        type: 'SURVEY-LOAD_SUCCESS',
        payload
    }
}

function fetchSurveyFailed(error) {
    return {
        type: 'SURVEY-LOAD_FAILED',
        error: 'Failed to load survey from database'
    }
}

export function fetchSurveySchema() {
    return function(dispatch) {
        const params = { url: baseUrl + 'surveywizard/edit', method: 'GET' }
        const jsonCallbacks = {
            begin: function() {},
            success: function(json) {
                const data = json.results

                // remove special placeholder id
                let questions = data.survey
                questions = questions.filter(q => {
                    if (q.id !== 99) return q
                })

                // create stack state from survey json
                data.surveyStack = questions.map((question, index) => {
                    let questionPrototype = clone(QuestionTypes.filter(q => q.id === question.id)[0])
                    questionPrototype.surveyId = index

                    let fieldData = {prompt: question.prompt, id: question.id, colName: question.colName}
                    questionPrototype.data.form = Object.assign(fieldData, question.fields)
                    return questionPrototype
                })

                // cast survey started to javascript boolean
                data.started = (data.started === 1 || data.started === true)

                // cast null input values to empty strings
                data.aboutText = !data.aboutText ? '' : data.aboutText
                data.termsOfService = !data.termsOfService ? '' : data.termsOfService

                dispatch(fetchSurveySuccess(data))
            },
            error: function(error) { dispatch(fetchSurveyFailed(error)) }
        }
        tokenRequest(params, jsonCallbacks)
    }
}

function saveSurveySuccess(payload, showSuccess) {
    return {
        type: 'SURVEY-SAVE_SUCCESS',
        payload: payload.results,
        showSuccess
    }
}

function saveSurveyFailed(error) {
    return {
        type: 'SURVEY-SAVE_FAILED',
        error: error
    }
}


export function saveSurveySchema(schema, showSuccess = true) {
    return function(dispatch) {
        const params = { 
            url: baseUrl + 'surveywizard/edit', 
            method: 'POST',
            body: JSON.stringify(schema)
        }

        const jsonCallbacks = {
            begin: function() {},
            success: function(json) { dispatch(saveSurveySuccess(json, showSuccess)) },
            error: function(error) { dispatch(saveSurveyFailed(error)) }
        }

        tokenRequest(params, jsonCallbacks)
    }
}

export function dismissSuccessModal() {
    return {
        type: 'SURVEY-DISMISS_SUCCESS_MODAL'
    }
}
