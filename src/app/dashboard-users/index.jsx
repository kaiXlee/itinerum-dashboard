/*
 * src/containers/Permissions/index.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ResearcherInviteCard from './ResearcherInviteCard'
import WebUsersTableCard from './WebUsersTableCard'

import * as actionCreators from './permissionsActions'
import { baseStyles } from 'app/appStyles/baseStyles.scss'

@connect(
    state => state.permissions,
    dispatch => bindActionCreators(actionCreators, dispatch)
)
export default class DashboardUsersView extends React.Component {
    static propTypes = {
        fetchWebUsers: PropTypes.func.isRequired,
        fetchInviteCode: PropTypes.func.isRequired,
        inviteCode: PropTypes.string,
        inviteCodeIsUpdating: PropTypes.bool,
        refreshInviteCode: PropTypes.func.isRequired,
        removeWebUser: PropTypes.func.isRequired,
        // setTableSorting: PropTypes.func.isRequired,
        // tableSorting: PropTypes.object.isRequired,
        pagination: PropTypes.object.isRequired,
        webUsers: PropTypes.array.isRequired
    }

    componentDidMount() {
        this.props.fetchInviteCode()    
    }

    fetchPage = (page) => {
        /* Fetch clicked users view page from pagination bar */
        let targetPage = page.selected + 1

        // submit the ajax request
        const params = {
            pageIndex: targetPage,
            searchString: this.props.tableFilter
        }
        this.sendAjax(params)
    }

    sendAjax(newParams) {
        /* Submit a table data request. Calling functions can override the default parameters set below */
        let defaultParams = {
            pageIndex: this.props.pagination.currentPage,
            itemsPerPage: 8,
            sorting: JSON.stringify(this.props.tableSorting),
        }

        const params = Object.assign({}, defaultParams, newParams)
        this.props.fetchWebUsers(params)
    }

    handleRemoveWebUser = (email) => {
        const refreshTableParams = {
            pageIndex: this.props.pagination.currentPage,
            itemsPerPage: 8
        }
        this.props.removeWebUser(email)
                  .then(() => { this.props.fetchWebUsers(refreshTableParams) })
                  .catch(error => { console.log(error) })
    }

    render() {
        return (
            <section className={classNames(baseStyles)}>
                <div className="content-wrapper">
                    <div className="card thick">
                        <ResearcherInviteCard inviteCode={this.props.registrationCode.text}
                                              inviteCodeIsUpdating={this.props.registrationCode.updating}
                                              fetchInviteCode={this.props.fetchInviteCode}
                                              refreshInviteCode={this.props.refreshInviteCode} />
                    </div>

                    <div className="card thick">
                        <WebUsersTableCard fetchPage={this.fetchPage}
                                           pagination={this.props.pagination}
                                           removeWebUser={this.handleRemoveWebUser}
                                           webUsers={this.props.webUsers} />
                    </div>
                </div>
            </section>
        )
    }
}

