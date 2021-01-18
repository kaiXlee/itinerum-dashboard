/*
 * components/MetricsQuickStatsCard.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Table } from 'reactable'

import { styles } from './metricsQuickStatsCard.scss'


export default class MetricsQuickStatsCard extends React.Component {
    tableRows = () => {
        return this.props.surveyStats.map(item => {
            return {
                name: <FormattedMessage id={item.name} />,
                value: item.value
            }
        })
    }

    render() {
        return(
            <section className={classNames(styles, 'card', 'thick')}>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="title">
                            <b><FormattedMessage id="metrics.charts.hourlyActiveUsers.title" /></b>
                            <h4><b><FormattedMessage id="metrics.statsTable.title" /></b></h4>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="table-container quick-stats">
                            <Table className="table"
                                   data={this.tableRows()}
                                   columns={[
                                       { key: 'name', label: '' },
                                       { key: 'value', label: '' }
                                   ]} />
                        </div>
                    </div>
                </div>            
            </section>
        )
    }
}


MetricsQuickStatsCard.propTypes = {
    surveyStats: PropTypes.array.isRequired,
}
