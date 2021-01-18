/*
 * components/TableColumnSelect.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import { styles } from './tableColumnSelect.scss'


export default class TableColumnSelect extends React.Component {
    columnTags = () => {
        return this.props.columns.map(c => {
            const activeClass = c.enabled ? "active" : undefined
            return(
                <li key={c.key} onClick={this.props.toggleColumn}>
                    <a className={classNames("column-tag", activeClass)}
                       data-colkey={c.key}>
                       { c.label }
                    </a>
                </li>
            )
        })
    }

    render() {
        return(
            <section className={classNames(styles)}>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="card thick">
                            <h5>Column Select</h5>
                            <div className="column-tag-container">
                                { this.columnTags() }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}


TableColumnSelect.propTypes = {
    columns: PropTypes.array.isRequired,
    toggleColumn: PropTypes.func.isRequired
}
