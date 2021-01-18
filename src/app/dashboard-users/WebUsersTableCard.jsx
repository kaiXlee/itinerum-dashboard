/*
 * components/WebUsersTableCard.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'
import { Table, Tr } from 'reactable'
import ReactPaginate from 'react-paginate'

import { styles } from './webUsersTableCard.scss'


export default class WebUsersTableCard extends React.Component {
    tableColumns = () => {
        // Generate columns from schema object: [(colName, colLabelMessageId)]
        const columnSchema = [['email',     'permissions.webusersTable.emailColumn'],
                              ['createdAt', 'permissions.webusersTable.registeredColumn'],
                              ['userLevel', 'permissions.webusersTable.userLevelColumn'],
                              ['active',    'permissions.webusersTable.activeColumn'],
                              ['action',    'permissions.webusersTable.manageUserColumn']]
        return columnSchema.map(c => { 
            return { key: c[0],  label: <FormattedMessage id={c[1]} /> }
        })
    }

    tableRows = () => {
        const rows = this.props.webUsers.map(user => {
            let html
            if (user.userLevel !== 'admin') {
                html = (
                    <div>
                        <button className="button medium danger center" onClick={this.props.removeWebUser.bind(this, user.email)}>
                            <i className="button-icon material-icons">delete_forever</i>
                            <span className="button-text">
                              <FormattedMessage id='permissions.webusersTable.deleteUserBtn' />
                            </span>
                        </button>
                    </div>
                )
            }
            return Object.assign({}, user, { action: html })
        })
        return rows
    }

    render() {
        return(
            <section className={classNames(styles)}>
                <div className="row">
                    <div className="col-xs-12">
                        <h4><FormattedMessage id="permissions.webusersTable.title" /></h4>
                    </div>

                    <div className="col-xs-12">
                        <Table className="table"
                               columns={this.tableColumns()}
                               data={this.tableRows()}
                               sortable={['email', 'createdAt', 'userLevel', 'active']} />
                    </div>

                    <div className="col-xs-12">
                        <div className="table-paginator text-center">
                            <ReactPaginate containerClassName={"pagination medium"}
                                           pageLinkClassName={"page-link"}
                                           previousLinkClassName={"end-link previous-link"}
                                           nextLinkClassName={"end-link next-link"}
                                           previousLabel={false}
                                           nextLabel={false}
                                           breakLabel={<a>...</a>}
                                           pageCount={this.props.pagination.totalPages || 0}
                                           initialPage={this.props.pagination.currentPage}
                                           marginPagesDisplayed={1}
                                           pageRangeDisplayed={5}
                                           onPageChange={this.props.fetchPage}
                                           activeClassName={"active"} />
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}


WebUsersTableCard.propTypes = {
    fetchPage: PropTypes.func.isRequired,
    pagination: PropTypes.object.isRequired,
    removeWebUser: PropTypes.func.isRequired,
    webUsers: PropTypes.array.isRequired
}
