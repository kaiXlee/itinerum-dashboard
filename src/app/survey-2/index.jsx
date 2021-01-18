/*
 * src/app/survey-2/index.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Prompt } from 'react-router'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { modal } from 'lib/react-redux-modal'

import * as actionCreators from './surveyActions'
import { styles } from './styles.scss'


@connect(
    state => state.survey,
    dispatch => bindActionCreators(actionCreators, dispatch)
)
@DragDropContext(HTML5Backend)
export default class SurveyBuilderView extends React.Component {
    render() {
        return (
            <section className={classNames(styles)}>
                <div className="content-wrapper">
                    <div className="row">
                        <div className="col-xs-12">
                            <p>abc</p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

SurveyBuilderView.propTypes = {
    // updateAboutText: PropTypes.func.isRequired,
    // updateTermsOfService: PropTypes.func.isRequired,
    // surveyStarted: PropTypes.bool.isRequired,
    // pageEdited: PropTypes.bool.isRequired,
}
