/*
 * src/app/prompts/PromptsWizardComponent/Selection.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import { DragSource } from 'react-dnd'
import { FormattedMessage } from 'react-intl'

import { ItemTypes } from './itemTypes'
import { styles } from './styles.scss'


const promptSource = {
    beginDrag(props) {
        return props.prompt
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

@DragSource(ItemTypes.PROMPT, promptSource, collect)
export default class Selection extends React.Component {
    static propTypes = {
        prompt: PropTypes.object.isRequired,
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
                <button className="selection btn">
                    <i className="mdi mdi-drag" />
                    <i className={this.props.prompt.icon} />
                    &nbsp;
                    <FormattedMessage id={this.props.prompt.label} />
                </button>
            </div>
        )
    }
}