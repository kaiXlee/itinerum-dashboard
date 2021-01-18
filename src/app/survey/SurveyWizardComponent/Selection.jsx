/*
 * src/app/survey/SurveyWizardComponent/Selection.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import { DragSource } from 'react-dnd'
import { FormattedMessage } from 'react-intl'

import { ItemTypes } from './itemTypes'
import { styles } from './styles.scss'


const questionSource = {
    beginDrag(props) {
        return props.question
    },
    canDrag(props) { 
        return props.draggingEnabled
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

@DragSource(ItemTypes.QUESTION, questionSource, collect)
export default class Selection extends React.Component {
    static propTypes = {
        question: PropTypes.object.isRequired,
        connectDragSource: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        draggingEnabled: PropTypes.bool.isRequired
    }

    render() {
        const { connectDragSource, isDragging, draggingEnabled } = this.props,
              fadeOpacity = isDragging || !draggingEnabled

        const style = {
            opacity: fadeOpacity ? 0.3 : 1,
            cursor: 'move',
            display: 'block',
            float: 'left',
            padding: '0.3em 0.3em'
        }


        return connectDragSource(
            <div className={`${styles}`} style={style}>
                <div className="selection btn">
                    <i className="mdi mdi-drag" />
                    <i className={this.props.question.icon} />
                    &nbsp;
                    <FormattedMessage id={this.props.question.label} />
                </div>
            </div>
        )
    }
}
