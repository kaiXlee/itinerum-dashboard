import { Dropdown, Checkboxes, TextBox } from './Fields'

export const ItemTypes = {
    PROMPT: 'prompt'
}

export const PromptTypes = [{
    id: 1,
    name: 'Dropdown',
    label: 'prompts.components.dropdown.title',
    type: ItemTypes.PROMPT,
    icon: 'mdi mdi-chevron-down',
    promptsId: null,
    data: {
        edit: false,
        form: {
            prompt: 'prompts.components.dropdown.prompt',
            choices: ['Choice 1', 'Choice 2']
        }
    },
    component: Dropdown
}, {
    id: 2,
    name: 'Checkboxes',
    label: 'prompts.components.checkbox.title',
    type: ItemTypes.PROMPT,
    icon: 'mdi mdi-checkbox-marked-outline',
    promptsId: null,
    data: {
        edit: false,
        form: {
            prompt: 'prompts.components.checkbox.prompt',
            choices: ['Choice 1', 'Choice 2']
        }
    },
    component: Checkboxes
}, {
    id: 5,
    name: 'Text Box',
    label: 'prompts.components.textBox.title',
    type: ItemTypes.PROMPT,
    icon: 'mdi mdi-comment-text-outline',
    promptsId: null,
    data: {
        edit: false,
        form: {
            prompt: 'prompts.components.textBox.prompt',
            text: ''
        }
    },
    component: TextBox
}]
