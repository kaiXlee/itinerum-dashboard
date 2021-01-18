/*
 * src/actions/promptsActions.js
 */

import clone from 'clone'
import { baseApiUrl } from 'utils/config'
import { tokenRequest } from 'utils/requests'
import { PromptTypes } from './PromptsWizardComponent/itemTypes'


export function addPrompt(prompt) {
    return {
        type: 'ADD_PROMPT',
        prompt
    }
}

export function deletePrompt(index) {
    return {
        type: 'DELETE_PROMPT',
        index
    }
}

export function togglePromptView(payload) {
    return {
        type: 'TOGGLE_PROMPT_VIEW',
        ...payload
    }
}

export function editPrompt(payload) {
    return {
        type: 'EDIT_PROMPT',
        ...payload
    }
}

export function addFieldToPrompt(payload) {
    return {
        type: 'ADD_FIELD_TO_PROMPT',
        ...payload
    }
}

export function deleteFieldFromPrompt(payload) {
    return {
        type: 'DELETE_FIELD_FROM_PROMPT',
        ...payload
    }
}

function fetchPromptsSuccess(payload) {
    return {
        type: 'PROMPTS_LOADING_SUCCESS',
        payload
    }
}

function fetchPromptsFailed(error) {
    return {
        type: 'PROMPTS_LOADING_FAILED',
        error: 'Failed to load prompts from database'
    }
}

export function fetchPrompts() {
    return function(dispatch) {
        const params = { url: baseApiUrl + 'promptswizard/edit', method: 'GET' }
        const jsonCallbacks = {
            begin: function() {},
            success: function(json) {
                const data = json.results
                let prompts = data.prompts

                //create stack state from survey json
                console.log(PromptTypes)
                data.promptsStack = prompts.map((promptQuestion, index) => {
                    let promptPrototype = clone(PromptTypes.filter(p => p.id === promptQuestion.id)[0])
                    promptPrototype.promptsId = index

                    let { id, prompt, colName, answerRequired, ...rest } = promptQuestion
                    promptPrototype.data.form = { id, prompt, colName, answerRequired }
                    Object.assign(promptPrototype.data.form, rest.fields)
                    return promptPrototype
                })
                dispatch(fetchPromptsSuccess(data))
            },
            error: function(error) { dispatch(fetchPromptsFailed(error)) }
        }
        tokenRequest(params, jsonCallbacks)
    }
}

function savePromptsSuccess(payload, showSuccess) {
    return {
        type: 'PROMPTS_SAVING_SUCCESS',
        ...payload.results,
        showSuccess
    }
}

function savePromptsFailed(error) {
    return {
        type: 'PROMPTS_SAVING_FAILED',
        error: error
    }
}

function getDuplicateColumns(array) {
    // find and return all duplicates within an array of survey prompts
    const unique = array.map((prompt) => {
        return { count: 1, colName: prompt.colName }
    }).reduce((a, b) => {
        a[b.colName] = (a[b.colName] || 0) + b.count
        return a
    }, {})
    const duplicates = Object.keys(unique).filter((a) => unique[a] > 1)
    return duplicates
}

export function savePrompts(prompts, showSuccess = true) {
    // assert all prompts have a unique column identifier
    const blank = prompts.some(p => (p.colName == null || p.colName === '') && (p.id < 90))
    if (blank) {
        const error = 'Prompts cannot have blank column names'
        return savePromptsFailed(error)
    }

    const duplicates = getDuplicateColumns(prompts)
    if (duplicates.length > 0) {
        const error = 'Prompts cannot have duplicate column names: ' + duplicates
        return savePromptsFailed(error)
    }

    return function(dispatch) {
        const params = { 
            url: baseApiUrl + 'promptswizard/edit', 
            method: 'POST',
            body: JSON.stringify({prompts})
        }

        const jsonCallbacks = {
            begin: function() {},
            success: function(json) { dispatch(savePromptsSuccess(json, showSuccess)) },
            error: function(error) { dispatch(savePromptsFailed(error)) }
        }

        tokenRequest(params, jsonCallbacks)
    }
}



