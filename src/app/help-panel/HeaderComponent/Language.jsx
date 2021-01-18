/*
 * src/app/help-panel/HeaderComponent/Language.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'

import { styles } from './styles.scss'

export default class LanguageHeader extends React.Component {
    render() {
        return (
            <section className={classNames(styles)}>
                <div className="row language-header">
                    <div className="col-xs-12">            
                        <div className="language pull-right">
                            <label htmlFor="language-select">
                                <FormattedMessage id='header.languageSelect.languageTitle' />:
                            </label>
                            <select id="language-select" value={this.props.currentLocale} onChange={this.props.changeLanguage}>
                                <option value="en">EN</option>
                                <option value="fr">FR</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

LanguageHeader.propTypes = {
    currentLocale: PropTypes.string.isRequired,
    changeLanguage: PropTypes.func.isRequired
}