/*
 * src/utils/downloader.js
 * http://stackoverflow.com/a/36075562/6073881
 */
import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actionCreators from './downloaderActions'
import { serialize } from './requests'


@connect(
    state => state.downloader,
    dispatch => bindActionCreators(actionCreators, dispatch)
)
export default class FileDownload extends React.Component {
    static propTypes = {
        actionPath: PropTypes.string.isRequired,
        method: PropTypes.string,
        onDownloadComplete: PropTypes.func.isRequired,
    }

    static defaultProps = {
        method: 'POST'
    }

    componentDidMount() {
        ReactDOM.findDOMNode(this).submit()
        this.props.onDownloadComplete()
    }

    getFormInputs = () => {
        const { queryParams } = this.props
        if (queryParams === undefined) { return null }

        return Object.keys(queryParams).map((name, index) => {
            return (
                <input key={index}
                       name={name}
                       type="hidden"
                       value={queryParams[name]} />
            )
        })
    }

    render() {
        const { actionPath, method } = this.props

        return (
            <form action={actionPath}
                  className="hidden"
                  method={method}>

                {this.getFormInputs()}
            </form>
        )
    }
}
