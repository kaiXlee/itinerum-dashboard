// https://github.com/yahoo/react-intl/issues/243
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { en, fr } from 'language'

const languages = { en, fr }

function mapStateToProps(state) {
    // set language from jwt if available
    const languageCode = localStorage.getItem('dmdashboard-language')
    if (languageCode) {
        state.intl.locale = languageCode
        state.intl.messages = languages[languageCode.toLowerCase()].messages
    }
    return state.intl
}

export default connect(mapStateToProps)(IntlProvider)