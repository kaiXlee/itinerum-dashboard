/*
 * src/components/LoginLanguageSelect.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'

import { styles } from './loginLanguageSelect.scss'


export default class LanguageSelect extends React.Component {
	static propTypes = {
		changeLanguage: PropTypes.func.isRequired,
		currentLocale: PropTypes.string.isRequired
	}

	handleChangeLanguage = (e) => {
        this.props.changeLanguage(e.target.textContent)
    }	

	render() {
		const languages = ['en', 'fr'],
			  languageButtonsJSX = languages.map((lang, i) => {
			  	  let addedClasses = [lang]
			  	  if (this.props.currentLocale === lang) addedClasses.push('active')

			  	  return(
		              <a key={"lang-" + lang}
		              	 className={classNames("language-select", "flex", ...addedClasses)}
		              	 onClick={this.handleChangeLanguage}>
		                  <div className="language-select-text">{lang}</div>
		              </a>
			  	  )
			  })

		return(
            <section className={classNames(styles)}>
            	{ languageButtonsJSX }
            </section>
		)
	}
}
