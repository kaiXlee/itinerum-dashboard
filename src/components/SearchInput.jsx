/*
 * components/SearchInput.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { injectIntl, intlShape } from 'react-intl'

import { styles } from './searchInput.scss'


class SearchInput extends React.Component {
    render() {
        return(
            <section className={classNames(styles)}>
                <div className="search">
                    <input type="text" className="i-input search-field"
                           placeholder={this.props.intl.formatMessage({id: this.props.searchHelpTextId})}
                           value={this.props.searchText}
                           onChange={(e) => this.props.onChange(e.target.value)} />
                    <div className="search-field-icon">
                        <i className="material-icons">search</i>
                    </div>
                </div>
            </section>
        )
    }
}

SearchInput.propTypes = {
    intl: intlShape.isRequired,
    onChange: PropTypes.func.isRequired,
    searchHelpTextId: PropTypes.string.isRequired,
    searchText: PropTypes.string.isRequired
}

export default injectIntl(SearchInput)
