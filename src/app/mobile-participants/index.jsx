/*
 * src/app/mobile-participants/index.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actionCreators from './participantsActions'
import MobileUsersTablePanel from './MobileUsersTablePanel'
import { baseStyles } from 'app/appStyles/baseStyles.scss'

@connect(
    state => state.participants,
    dispatch => bindActionCreators(actionCreators, dispatch)
)
export default class MobileParticipantsView extends React.Component {
    static propTypes = {
        fetchMobileUsers: PropTypes.func.isRequired,
        pagination: PropTypes.object.isRequired,
        setSelectedUser: PropTypes.func.isRequired,
        selectedUuid: PropTypes.string,
        setTableSorting: PropTypes.func.isRequired,
        setTableFilter: PropTypes.func.isRequired,
        tableSorting: PropTypes.object.isRequired
    }

    /* Search users values left-to-right using input string text */
    handleTableFilter = (searchString) => {
        // submit the ajax request
        const params = { pageIndex: 1, searchString }
        this.sendAjax(params)
        this.props.setTableFilter(searchString)
    }


    handleFetchPage = (page) => {
        /* Fetch clicked users view page from pagination bar */
        let targetPage = Math.max(1, page.selected + 1)

        // submit the ajax request
        const params = {
            pageIndex: targetPage,
            searchString: this.props.tableFilter
        }
        this.sendAjax(params)
    }


    /* Get the sorted results (w/ filter string) from database users view */
    fetchSortedResults = (sorting) => {
        // submit the ajax request
        const params = {
            sorting: JSON.stringify(sorting),
            searchString: this.props.tableFilter
        }

        this.props.setTableSorting(sorting)
        this.sendAjax(params)
    }


    /* Submit a table data request. Calling functions can override the default parameters set below */
    sendAjax(newParams) {
        let defaultParams = {
            pageIndex: Math.max(1, this.props.pagination.currentPage),
            itemsPerPage: 10,
            sorting: JSON.stringify(this.props.tableSorting),
            searchString: this.props.searchString ? this.props.searchString : ''
        }

        const params = Object.assign({}, defaultParams, newParams)
        this.props.fetchMobileUsers(params)
    }

    render() {
        return (
            <section className={classNames(baseStyles)}>
                <MobileUsersTablePanel columns={this.props.columns}
                                       fetchPage={this.handleFetchPage}
                                       fetchSortedResults={this.fetchSortedResults}
                                       mobileUsers={this.props.mobileUsers}
                                       selectUuid={this.props.setSelectedUser}
                                       selectedUuid={this.props.selectedUuid}
                                       pagination={this.props.pagination}
                                       tableFilter={this.props.tableFilter}
                                       setTableFilter={this.handleTableFilter} />
            </section>
        )
    }
}

