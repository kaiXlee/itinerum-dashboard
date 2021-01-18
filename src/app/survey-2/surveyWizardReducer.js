/*
 * src/reducers/surveyWizardReducer.js
 */
import clone from 'clone'
import update from 'react/lib/update'
import { QuestionTypes } from './SurveyWizardComponent/itemTypes'


const initialState = {
    surveyLanguage: 'en',
    aboutText: '',
    termsOfServiceText: '',
    // survey prototype selection field types
    questionTypes: QuestionTypes,
    // survey stack with example questions pre-coded
    stack: [],
    surveyIndex: 0,
    surveyStarted: true,
    saveStatus: undefined,
    saveMessage: '',
    pageEdited: false
 }

 export function surveyWizardReducer(state = initialState, action) {
    let nextQuestion, editedQuestion, nextIndex, questions, stack

    switch (action.type) {
        case 'SURVEY-CHANGE_SURVEY_LANGUAGE':
            return update(state, {
                $merge: {
                    surveyLanguage: action.language,
                    pageEdited: true
                }
            })

        case 'SURVEY-UPDATE_ABOUT_TEXT':
            return update(state, {
                $merge: {
                    aboutText: action.text,
                    pageEdited: true
                }
            })

        case 'SURVEY-UPDATE_TOS_TEXT':
            return update(state, {
                $merge: {
                    termsOfService: action.text,
                    pageEdited: true
                }
            })


        case 'SURVEY-ADD_QUESTION':
            nextIndex = state.surveyIndex + 1
            nextQuestion = clone(action.question)
            nextQuestion.surveyId = nextIndex

            return update(state, {
                stack: { $push: [nextQuestion] },
                surveyIndex: { $set: nextIndex },
                pageEdited: { $set: true }
            })

        case 'SURVEY-MOVE_QUESTION':
            let { question, index, toIndex } = action.payload

            return update(state, {
                stack: {
                    $splice: [
                        [index, 1],
                        [toIndex, 0, question]
                    ]
                },
                pageEdited: { $set: true }
            })

        case 'SURVEY-DELETE_QUESTION':
            return update(state, {
                stack: {
                    $splice: [[action.index, 1]]
                },
                pageEdited: { $set: true }
            })

        case 'SURVEY-TOGGLE_QUESTION_VIEW':
            nextQuestion = Object.assign({}, action.question)
            nextQuestion.data.edit = !nextQuestion.data.edit

            return update(state, {
                stack: {
                    $splice: [[action.index, 1, nextQuestion]]
                }
            })

        case 'SURVEY-EDIT_QUESTION':
            editedQuestion = Object.assign({}, action.question)
            // handle updating of a single field or multiple choice fields
            // in update the question state
            if (action.fieldIndex === null) {
                editedQuestion.data.form[action.fieldName] = action.value
            } else {
                editedQuestion.data.form[action.fieldName][action.fieldIndex] = action.value
            }

            return update(state, {
                stack: {
                    $splice: [[action.index, 1, editedQuestion]]
                },
                pageEdited: { $set: true }
            })

        case 'SURVEY-ADD_FIELD_TO_QUESTION':
            editedQuestion = Object.assign({}, action.question)
            editedQuestion.data.form[action.fieldName].push('')
            return update(state, {
                stack: {
                    $splice: [[action.index, 1, editedQuestion]]
                }
            })

        case 'SURVEY-DELETE_FIELD_FROM_QUESTION':
            editedQuestion = Object.assign({}, action.question)
            editedQuestion.data.form[action.fieldName].pop()
            return update(state, {
                stack: {
                    $splice: [[action.index, 1, editedQuestion]]
                },
                pageEdited: { $set: true }
            })

        case 'SURVEY-SAVE_SUCCESS':
            return update(state, {
                $merge: {
                    saveStatus: action.showSuccess,
                    saveMessage: 'The current survey has been successfully saved.',
                    pageEdited: false
                }
            })

        case 'SURVEY-SAVE_FAILED':
            return update(state, {
                $merge: {
                    saveStatus: false,
                    saveMessage: action.error
                }
            })

        case 'SURVEY-LOAD_SUCCESS':
            return update(state, {
                $merge: {
                    surveyLanguage: action.payload.language,
                    aboutText: action.payload.aboutText,
                    termsOfService: action.payload.termsOfService,
                    stack: action.payload.surveyStack,
                    surveyIndex: action.payload.surveyStack.length - 1,
                    surveyStarted: action.payload.started,
                    saveStatus: undefined,
                    pageEdited: false,
                    saveMessage: ''
                }
            })

        case 'SURVEY-LOAD_FAILED':
            return state

        case 'SURVEY-DISMISS_SUCCESS_MODAL':
            return update(state, {
                $merge: {
                    saveStatus: undefined
                }
            })
        default:
            return state
    }
}
