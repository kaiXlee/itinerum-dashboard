/*
 * components/SearchableSelect.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import VirtualizedSelect from 'react-virtualized-select'
import createFilterOptions from 'react-select-fast-filter-options'

import { reactSelectStyle } from 'react-select/dist/react-select.css'
import { reactVirtualizedSelectStyle } from 'react-virtualized-select/styles.css'
import { styles } from './searchableSelect.scss'


export default class SearchableSelect extends React.Component {
    render() {
        const selectOptions = this.props.options.map(option => {
            return { label: option, value: option }
        })

        return(
            <section className={classNames(styles, this.props.className)}>
                <VirtualizedSelect clearable={false}
                                   filterOptions={{options: selectOptions}}
                                   isLoading={this.props.isLoading}
                                   options={selectOptions}
                                   value={this.props.value}
                                   onChange={(e) => this.props.onChange(e.value)} />
            </section>
        )
    }
}


SearchableSelect.propTypes = {
    className: PropTypes.string,
    isLoading: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    value: PropTypes.string
}
