/*
 * components/__________.jsx
 */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { styles } from './boilerplate.scss'


export default class Boilerplate extends React.Component {
    render() {
        return(
            <section className={classNames(styles)}>
            </section>
        )
    }
}


Boilerplate.propTypes = {}
