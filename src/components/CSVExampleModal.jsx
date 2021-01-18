/*
 * components/CSVExampleModal.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { baseStyles } from 'app/appStyles/baseStyles.scss'
import { modalStyles } from './modals.scss'


export default class CSVExampleModal extends React.Component {
    render() {
        return(
            <section className={classNames(baseStyles, modalStyles, 'subway-help')}>
                <div className="modal-body">
                    <div className="help-text">
                        <p><FormattedMessage id="dataManagement.uploadSubway.csvModal.helpText" /></p>
                    </div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th></th>
                                <th>longitude</th>
                                <th>latitude</th>
                                <th>name <i>(optional)</i></th>
                                <th>other <i>(optional)</i></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>-73.60419368</td>
                                <td>45.44593094</td>
                                <td>ANGRIGNON</td>
                                <td>1</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>-73.59421491</td>
                                <td>45.45100128</td>
                                <td>MONK</td>
                                <td>2</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>-73.58177134</td>
                                <td>45.45672866</td>
                                <td>JOLICOEUR</td>
                                <td>7</td>
                            </tr>
                            <tr>
                                <th scope="row">4</th>
                                <td>...</td>
                                <td>...</td>
                                <td>...</td>
                                <td>...</td>
                            </tr>                            
                        </tbody>
                    </table>
                </div>
                <div className="modal-footer">
                    <button className="button medium" data-dismiss="modal" onClick={this.props.removeModal}>
                        <FormattedMessage id='dataManagement.uploadSubway.csvModal.closeBtn' />
                    </button>
                </div>            
            </section>
        )
    }
}


CSVExampleModal.propTypes = {
    removeModal: PropTypes.func.isRequired
}
