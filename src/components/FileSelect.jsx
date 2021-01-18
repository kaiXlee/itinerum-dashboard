/* 
 * src/components/FileSelect.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'

import { baseStyles } from 'app/appStyles/baseStyles.scss'


export default class FileSelect extends React.Component {
    handleFileSelect = (e) => {
        const file = e.target.files[0]
        this.props.fileSelectAction(file)
    }

    render() {
        return(
            <section className={classNames(baseStyles)}>
                <div className="input-group">
                    <span className="input-group-addon" id="file-select-label">
                        <i className="mdi mdi-upload" />
                        &nbsp;
                        <FormattedMessage id={this.props.formattedLabelId} />
                    </span>

                    <input className="form-control input-file"
                           type="file"
                           onChange={this.handleFileSelect} />
                </div>
            </section>
        )
    }
}

FileSelect.propTypes = {
    formattedLabelId: PropTypes.string.isRequired,
    fileSelectAction: PropTypes.func.isRequired
}
