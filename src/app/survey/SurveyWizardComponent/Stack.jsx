/*
 * src/app/survey/SurveyWizardComponent/Stack.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import { Question } from './Question'
import { ItemTypes } from './itemTypes'
import { styles } from './styles.scss'


const stackTarget = {
    drop(props, monitor) {
        // test if this is a new question to the stack or being moved
        const question = monitor.getItem()

        if (question.type === ItemTypes.QUESTION) {
            // flag question as dropped to receive default labels
            question.dropped = true
            props.addSelectionToSurvey(question)
        }
    }
}


function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    }
}
@DropTarget(ItemTypes.QUESTION, stackTarget, collect)
class Stack extends React.Component {
    static propTypes = {
        survey: PropTypes.array.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        isOver: PropTypes.bool.isRequired,
        addSelectionToSurvey: PropTypes.func.isRequired,
        questionProps: PropTypes.object.isRequired,
        showEditAboutTextModal: PropTypes.func.isRequired,
        showEditTermsOfServiceModal: PropTypes.func.isRequired,
        surveyLanguage: PropTypes.string.isRequired,
        changeSurveyLanguage: PropTypes.func.isRequired
    }

    handleChangeSurveyLanguage = (e) => {
        const lang = e.target.value
        this.props.changeSurveyLanguage(lang)
    }

    render() {
        const { connectDropTarget, isOver, survey, questionTypes } = this.props
        const color = isOver ? '#88A5FF': 'transparent'

        // generate survey language select options
        const langs = [
            { key: 'en', msgString: 'surveyWizard.settings.language.en' },
            { key: 'fr', msgString: 'surveyWizard.settings.language.fr' },
        ]
        const langOptionsJSX = langs.map((d, i) => {
            return <option value={d.key} key={d.key}>{this.props.intl.formatMessage({id: d.msgString})}</option>
        })

        // generate question field elements for stack
        let numUserQuestions = 0
        const questions = survey.map((item, index) => {
            if (item.id >= 100) return
            numUserQuestions += 1

            return <Question key={index}
                             question={item}
                             questionTypes={questionTypes}
                             stackIndex={index}
                             questionProps={this.props.questionProps} />
        })

        let showPlaceholderCSS = ''
        if (numUserQuestions === 0)  showPlaceholderCSS = ' show'

        // return stack with questions included
        return connectDropTarget(
            <div className={classNames(styles)}>
                <div className="stack" style={{"backgroundColor": color}}>
                    {/* Language and about text */}
                    <div className="container-fluid">
                        <div className="row language-about-row">
                            <div className="col-xs-6 language">
                                <div className="select-field">
                                    <label htmlFor="language-select"><FormattedMessage id='surveyWizard.settings.languageLabel' />:</label>
                                    <select id="language-select"
                                            className="form-control"
                                            value={this.props.surveyLanguage}
                                            onChange={this.handleChangeSurveyLanguage}>
                                        { langOptionsJSX }
                                    </select>                            
                                </div>
                            </div>

                            {/* MODALS TO BE MOVED TO SETTINGS MENU; LINK HERE? */}
                            <div className="col-xs-3 about">
                                <button className="button"
                                        onClick={this.props.showEditAboutTextModal}>
                                    <i className="material-icons button-icon">edit</i>
                                    <span className="button-text">
                                        <FormattedMessage id='settings.survey.aboutTextEditBtn' />
                                    </span>
                                </button>
                            </div>

                            <div className="col-xs-3 about">
                                <button className="button"
                                        onClick={this.props.showEditTermsOfServiceModal}>
                                    <i className="material-icons button-icon">edit</i>
                                    <span className="button-text">
                                        <FormattedMessage id='settings.survey.termsOfServiceEditBtn' />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Placeholder question */}
                    <div className={"question placeholder" + showPlaceholderCSS}>
                        <div className="container-fluid">
                            <div className="row title">
                                <FormattedMessage id='surveyWizard.placeholder.title' />
                            </div>
                            <div className="form-field text-center">
                                <FormattedMessage id='surveyWizard.placeholder.text' />
                            </div>
                        </div>
                    </div>

                {/* Generated question divs */}
                    {questions}
                </div>
            </div>
        )
    }
}

export default injectIntl(Stack)
