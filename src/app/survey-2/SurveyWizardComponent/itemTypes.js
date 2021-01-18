import { Time, Address, SingleChoice, Checkboxes, Email, Dropdown, TextBox, TermsOfService,
    NumberInput } from './Fields'


export const ItemTypes =  {
    QUESTION: 'question',
    SURVEY: 'survey'
}

export const QuestionTypes = [{
    id: 1,
    name: 'Dropdown',
    label: 'surveyWizard.components.dropdown.title',
    type: ItemTypes.QUESTION,
    icon: 'mdi mdi-chevron-down',
    surveyId: null,
    data: {
        edit: false,
        form: {
            prompt: 'surveyWizard.components.dropdown.prompt',
            choices: ['Choice 1', 'Choice 2']
        }
    },
    component: Dropdown
}, {
    id: 2,
    name: 'Checkboxes',
    label: 'surveyWizard.components.checkbox.title',
    type: ItemTypes.QUESTION,
    icon: 'mdi mdi-checkbox-marked-outline',
    surveyId: null,
    data: {
        edit: false,
        form: {
            prompt: 'surveyWizard.components.checkbox.prompt',
            choices: ['Choice 1', 'Choice 2']
        }
    },
    component: Checkboxes
}, {
    id: 3,
    name: 'Number',
    label: 'surveyWizard.components.number.title',
    type: ItemTypes.QUESTION,
    icon: 'mdi mdi-numeric',
    surveyId: null,
    data: {
        edit: false,
        form: {
            prompt: 'surveyWizard.components.number.prompt',
            number: ''
        }
    },
    component: NumberInput
}, {
    id: 4,
    name: 'Address',
    label: 'surveyWizard.components.address.title',
    type: ItemTypes.QUESTION,
    icon: 'mdi mdi-map-marker',
    surveyId: null,
    data: {
        edit: false,
        form: {
            prompt: 'surveyWizard.components.address.prompt'
        }
    },
    component: Address
}, {
    id: 5,
    name: 'Text Box',
    label: 'surveyWizard.components.textBox.title',
    type: ItemTypes.QUESTION,
    icon: 'mdi mdi-comment-text-outline',
    surveyId: null,
    data: {
        edit: false,
        form: {
            prompt: 'surveyWizard.components.textBox.prompt',
            text: ''
        }
    },
    component: TextBox
}, {
    id: 99,
    name: 'Placeholder',
    type: ItemTypes.QUESTION,
    icon: '',
    surveyId: null,
    data: {
        edit: false,
        form: {
            prompt: '',
            choices: []
        }
    },
    component: Dropdown
}, {
    id: 100,
    name: 'Gender',
    type: ItemTypes.QUESTION,
    icon: '',
    surveyId: null,
    data: {
        edit: false,
        form: {
            prompt: '',
            choices: []
        }
    },
    component: Dropdown,
    mandatory: true
}, {
    id: 101,
    name: 'Age',
    type: ItemTypes.QUESTION,
    icon: '',
    surveyId: null,
    data: {
        edit: false,
        form: {
            prompt: ''
        }
    },
    component: Dropdown,
    mandatory: true
}, {
    id: 102,
    name: 'Primary Mode',
    type: ItemTypes.QUESTION,
    icon: 'fa fa-bus',
    surveyId: null,
    data: {
        edit: false,
        form: {
            prompt: ''
        }
    },
    component: Dropdown,
    mandatory: true
}, {
    id: 103,
    name: 'Email',
    type: ItemTypes.QUESTION,
    icon: 'fa fa-envelope-o',
    surveyId: null,
    data: {
        edit: false,
        form: {
            prompt: '',
            email: ''
        }
    },
    component: Email,
    mandatory: true
}, {
    id: 104,
    name: 'member_type',
    type: ItemTypes.QUESTION,
    icon: '',
    surveyId: null,
    data: {
        edit: false,
        form: {
            prompt: ''
        }
    },
    component: Dropdown,
    mandatory: true
}, {
    id: 105,
    name: 'home_location',
    type: ItemTypes.QUESTION,
    icon: 'mdi mdi-map-marker',
    surveyId: null,
    data: {
        edit: false,
        form: {
            prompt: 'Enter an address'
        }
    },
    component: Address,
    mandatory: true
}, {
    id: 106,
    name: 'study_location',
    type: ItemTypes.QUESTION,
    icon: 'mdi mdi-map-marker',
    surveyId: null,
    data: {
        edit: false,
        form: {
            prompt: 'Enter an address'
        }
    },
    component: Address,
    mandatory: true
}, {
    id: 107,
    name: 'work_location',
    type: ItemTypes.QUESTION,
    icon: 'mdi mdi-map-marker',
    surveyId: null,
    data: {
        edit: false,
        form: {
            prompt: 'Enter an address'
        }
    },
    component: Address,
    mandatory: true
}, {
    id: 108,
    name: 'travel_mode_study',
    type: ItemTypes.QUESTION,
    icon: '',
    surveyId: null,
    data: {
        edit: false,
        form: {
            prompt: ''
        }
    },
    component: Dropdown,
    mandatory: true
}, {
    id: 109,
    name: 'travel_mode_alt_study',
    type: ItemTypes.QUESTION,
    icon: '',
    surveyId: null,
    data: {
        edit: false,
        form: {
            prompt: ''
        }
    },
    component: Dropdown,
    mandatory: true
}, {
    id: 110,
    name: 'travel_mode_work',
    type: ItemTypes.QUESTION,
    icon: '',
    surveyId: null,
    data: {
        edit: false,
        form: {
            prompt: ''
        }
    },
    component: Dropdown,
    mandatory: true
}, {
    id: 111,
    name: 'travel_mode_alt_work',
    type: ItemTypes.QUESTION,
    icon: '',
    surveyId: null,
    data: {
        edit: false,
        form: {
            prompt: ''
        }
    },
    component: Dropdown,
    mandatory: true
}]
