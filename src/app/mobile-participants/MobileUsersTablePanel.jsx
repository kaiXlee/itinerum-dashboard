/*
 * components/MobileUsersTablePanel.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'
import { Table, Td, Tr } from 'reactable'
import ReactPaginate from 'react-paginate'
import Moment from 'moment-timezone'

import TableColumnSelect from 'components/TableColumnSelect'
import SearchInput from 'components/SearchInput'
import { styles } from './mobileUsersTablePanel.scss'


export default class MobileUsersTablePanel extends React.Component {
    constructor() {
        super()
        this.state = {
            selectedColumnKeys: []
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.selectedColumnKeys.length === 0 && nextProps.columns.length > 0) {
            this.setState({ selectedColumnKeys: Object.assign([], nextProps.columns) })
        }
    }

    toggleSelectedColumn = (e) => {
        const selected = e.target.dataset.colkey,
              selectedColumnKeys = this.state.selectedColumnKeys,
              selectedIdx = selectedColumnKeys.indexOf(selected)
        
        if (selectedIdx > -1) {
            selectedColumnKeys.splice(selectedIdx, 1)
        } else {
            selectedColumnKeys.push(selected)
        }

        this.setState({selectedColumnKeys})
    }

    tableColumns = () => {
        const columnKeys = this.props.columns

        const firstColumnKeys = ['uuid']
        firstColumnKeys.map(k => {
            const colIdx = columnKeys.indexOf(k)
            if (colIdx > -1) columnKeys.splice(colIdx, 1)
        })

        return firstColumnKeys.concat(columnKeys).map(k => {
            return { key: k,
                     label: k.toLowerCase(),
                     enabled: this.state.selectedColumnKeys.indexOf(k) > -1
            }
        })
    }

    tableRows = (columns) => {
        const columnKeys = columns.map(c => c.key)
        return this.props.mobileUsers.map((row, rowIndex) => {
            const existingRowKeys = Object.keys(row),
                  rowIsSelected = row.uuid === this.props.selectedUuid
            const rowCells = existingRowKeys.map((k, cellIndex) => {
                let rowValue = row[k]
                if (k === 'created_at') {
                    rowValue = Moment(rowValue).local().format('YYYY-MM-DD HH:mm:ss')
                }

                if (columnKeys.indexOf(k) > -1) {
                    return <Td key={cellIndex} column={k}>{rowValue}</Td>
                }
                
            })
            return(<Tr key={rowIndex} data-rownum={rowIndex} 
                       onClick={this.props.selectUuid.bind(this, row.uuid)}
                       className={rowIsSelected ? 'active' : undefined}>
                       {rowCells}
                   </Tr>)
        })
    }

    enabledTableColumns = (columns) => {
        return columns.filter(c => c.enabled).map(c => {
            const { enabled, ...restCol } = c
            return restCol
        })
    }


    render() {
        const columns = this.tableColumns()
        const rows = this.tableRows(columns)
        const enabledColumns = this.enabledTableColumns(columns)

        return(
            <section className={classNames(styles)}>
                <div className="row">
                    <div className="col-xs-12 table-column-select">
                        <TableColumnSelect columns={columns} toggleColumn={this.toggleSelectedColumn} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12">
                        <div className="card thick table-search-input">
                            <SearchInput searchHelpTextId={"participants.searchHelpText"}
                                         searchText={this.props.tableFilter}
                                         onChange={this.props.setTableFilter} />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12">
                        <div className="card thick table-container">
                            <Table className="table mobile-users-table"
                                   columns={enabledColumns}
                                   sortable={true}
                                   onSort={this.props.fetchSortedResults}
                                   noDataText={<FormattedMessage id="participants.noMatchingRecordsText"/>}>
                                   {rows}
                            </Table>
                        </div>
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


MobileUsersTablePanel.propTypes = {
    columns: PropTypes.array.isRequired,
    fetchPage: PropTypes.func.isRequired,
    fetchSortedResults: PropTypes.func.isRequired,
    mobileUsers: PropTypes.array.isRequired,
    pagination: PropTypes.object.isRequired,
    selectUuid: PropTypes.func.isRequired,
    selectedUuid: PropTypes.string,
    setTableFilter: PropTypes.func.isRequired,
    tableFilter: PropTypes.string.isRequired

}

