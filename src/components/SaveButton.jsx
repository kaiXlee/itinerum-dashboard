/*
 * components/SaveButton.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { styles } from './saveButton.scss'


export default class SaveButton extends React.Component {
    saveIconJSX = () => {
        let icon
        if (this.props.isSaving) {
            return <i className="loading-spinner button-icon saving" />
        } else if (this.props.isEdited) {
            return <i className="material-icons button-icon">more_horiz</i>
        } else {
            return <i className="material-icons button-icon">check</i>
        }
    }

    render() {
        return(
            <section className={classNames(styles, 'save-button', 'pull-right')}>
                <button className="button" onClick={this.props.save}>
                    {this.saveIconJSX()}
                    <span className="button-text">
                        <FormattedMessage id='settings.saveBtn' />
                    </span>
                </button>
            </section>
        )
    }
}


SaveButton.propTypes = {
    classNames: PropTypes.string,
    isEdited: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired
}
