/*
 * components/UploadSubwayDataCard.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { modal } from 'lib/react-redux-modal'
import uuid from 'uuid'

import CSVExampleModal from 'components/CSVExampleModal'
import FileSelect from 'components/FileSelect'
import { styles } from './uploadSubwayDataCard.scss'

export default class UploadSubwayDataCard extends React.Component {
    constructor() {
        super()
        this.state = {
            inputFileKey: uuid.v4()
        }
    }

    handleDeleteSubwayData = () => {
        this.props.deleteSubwayStopsData()
        this.setState({ inputFileKey: uuid.v4() })
    }

    handleUploadSubwayStopsData = (file) => {
        const data = new FormData()
        data.append('stops', file)
        this.props.uploadSubwayStopsData(data)
    }

    showCSVExampleModal = () => {
        const titleJSX = (
            <div className="subway-help-title">
                <FormattedMessage  id='dataManagement.uploadSubway.csvModal.title' />
            </div>
        )
        modal.add(CSVExampleModal, {
            title: titleJSX,
            size: 'medium',
            closeOnOutsideClick: true
        })        
    }

    subwayStopsStatusButtonJSX = () => {
        const dataExists = this.props.databaseSubwayStopsData.features.length > 0,
              statusText = dataExists
                         ? <FormattedMessage id='dataManagement.uploadSubway.statusBtn.added' /> 
                         : <FormattedMessage id='dataManagement.uploadSubway.statusBtn.empty' />,
              statusClass = dataExists ? 'success' : 'warning'
        return (
            <button type="button" className={classNames('button', 'subway-data-status', statusClass)} disabled>
                {statusText}
            </button>
        )
    }

    render() {
        return(
            <section className={classNames(styles, 'card', 'thick')}>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="title">
                            <h3><FormattedMessage id="dataManagement.uploadSubway.title" /></h3>
                        </div>

                        <div className="help-text">
                            <p>
                                <FormattedMessage id="dataManagement.uploadSubway.helpText" />
                                &nbsp;
                                <a onClick={this.showCSVExampleModal}>
                                    <FormattedMessage id="dataManagement.uploadSubway.csvModal.linkText" />
                                </a>                                
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-8">
                        <FileSelect fileSelectAction={this.handleUploadSubwayStopsData}
                                    formattedLabelId={"dataManagement.uploadSubway.uploadLabel"}
                                    key={this.state.inputFileKey} />
                    </div>

                    <div className="col-xs-4 subway-status-button-group">
                        {this.subwayStopsStatusButtonJSX()}
                        <button className="button danger" onClick={this.handleDeleteSubwayData}>
                            <i className="button-icon material-icons">delete_forever</i>
                            <span className="button-text">
                                <FormattedMessage id="dataManagement.uploadSubway.deleteBtn" />
                            </span>
                        </button>
                    </div>
                </div>
            </section>
        )
    }
}


UploadSubwayDataCard.propTypes = {
    databaseSubwayStopsData: PropTypes.object,
    deleteSubwayStopsData: PropTypes.func.isRequired,
    uploadSubwayStopsData: PropTypes.func.isRequired
}
