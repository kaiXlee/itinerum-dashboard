/* 
 * src/app/help-panel/index.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actionCreators from 'app/login/loginActions'
import LanguageHeader from './HeaderComponent/Language'
import TutorialComponent from './Tutorial'

const mapStateToProps = (state) => {
    return { currentLocale: state.intl.locale }
}

@connect(
    state => state.intl,
    dispatch => bindActionCreators(actionCreators, dispatch)
)
export default class HelpPanelView extends React.Component {
    handleChangeLanguage = (event) => {
        this.props.changeCurrentLanguage(event.target.value)
    }

    render() {
        return (
            <section>
                <LanguageHeader changeLanguage={this.handleChangeLanguage}
                    currentLocale={this.props.locale} />
                <TutorialComponent />
            </section>        
        )
    }
}
