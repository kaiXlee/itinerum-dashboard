/*
 * src/reducers/promptReducer.js
 */

import clone from 'clone'
import update from 'react/lib/update'

const initialState = {
    stack: [],
    promptsIndex: 0,
    surveyStarted: true,
    saveStatus: undefined,
    saveMessage: '',
    pageEdited: false
 }

 export function promptsReducer(state = initialState, action) {
    let stack, editedPrompt

    switch (action.type) {
        case 'ADD_PROMPT':
            const stackIndex = state.promptsIndex + 1
            const newPrompt = clone(action.prompt)
            newPrompt.promptsId = stackIndex

            return update(state, {
                stack: { $push: [newPrompt] },
                promptsIndex: { $set: stackIndex },
                pageEdited: { $set: true }
            })

        case 'DELETE_PROMPT':
            return update(state, {
                stack: {
                    $splice: [[action.index, 1]]
                },
                pageEdited: { $set: true }
            })

        case 'TOGGLE_PROMPT_VIEW':
            let nextPrompt = Object.assign({}, action.prompt)
            nextPrompt.data.edit = !nextPrompt.data.edit

            return update(state, {
                stack: {
                    $splice: [[action.index, 1, nextPrompt]]
                }
            })

        case 'EDIT_PROMPT':
            editedPrompt = Object.assign({}, action.prompt)
            // handle updating of a single field or multiple choice fields
            // in update the question state
            if (action.fieldIndex === null) {
                editedPrompt.data.form[action.fieldName] = action.value
            } else {
                editedPrompt.data.form[action.fieldName][action.fieldIndex] = action.value
            }

            return update(state, {
                stack: {
                    $splice: [[action.index, 1, editedPrompt]]
                },
                pageEdited: { $set: true }
            })

        case 'ADD_FIELD_TO_PROMPT':
            editedPrompt = Object.assign({}, action.prompt)
            editedPrompt.data.form[action.fieldName].push('')
            return update(state, {
                stack: {
                    $splice: [[action.index, 1, editedPrompt]]
                }
            })

        case 'DELETE_FIELD_FROM_PROMPT':
            editedPrompt = Object.assign({}, action.prompt)
            editedPrompt.data.form[action.fieldName].pop()
            return update(state, {
                stack: {
                    $splice: [[action.index, 1, editedPrompt]]
                },
                pageEdited: { $set: true }
            })

        case 'PROMPTS_LOADING_SUCCESS':
            return update(state, {
                $merge: {
                    stack: action.payload.promptsStack,
                    promptsIndex: action.payload.promptsStack.length - 1,
                    surveyStarted: action.payload.started,
                    saveStatus: undefined,
                    pageEdited: false,
                    saveMessage: ''                    
                }
            })

        case 'PROMPTS_LOADING_FAILED':
            return state

        case 'PROMPTS_SAVING_SUCCESS':
            return update(state, {
                $merge: {
                    saveStatus: action.showSuccess,
                    saveMessage: 'The current prompts have been successfully saved.',
                    pageEdited: false
                }
            })

        case 'PROMPTS_SAVING_FAILED':
            return update(state, {
                $merge: {
                    saveStatus: false,
                    saveMessage: action.error
                }
            })

        default:
            return state
    }
}
