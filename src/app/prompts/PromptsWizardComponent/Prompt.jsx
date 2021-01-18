/*
 * src/app/prompts/PromptWizardComponent/Prompt.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom';
import { DropTarget, DragSource } from 'react-dnd'

import { ItemTypes } from './itemTypes'
import { styles } from './styles.scss'



const promptTarget = {
    canDrop() {
        return false
    },

    hover(props, monitor, component) {
        // cancel if hovering item is a new selection
        if (monitor.getItem().promptId === null) return

        const { promptId: draggedId } = monitor.getItem()
        const { promptId: overId } = props.prompt

        // don't replace questions with themselves
        if (draggedId === overId) return

        // determine rectangle of the field component being hovered over
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

        // get the vertical middle of the field being hovered
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

        // get mouse position
        const clientOffset = monitor.getClientOffset()

        // get pixels to the top of the component
        const hoverClientY = clientOffset.y - hoverBoundingRect.top

        // only perform when mouse cursor has crossed half of the items height (adj. by offset);
        // offset keeps field elements from rapidly bouncing back and forth when mouse is in
        // particular spot in prompts stack
        const dragIndex = monitor.getItem().originalIndex
        const hoverIndex = props.stackIndex
        const offset = hoverMiddleY / 4
        // dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < (hoverMiddleY + offset)) {
            return
        }
        // dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > (hoverMiddleY - offset)) {
            return
        }        

        const { index: overIndex } = props.promptProps.findQuestion(overId)
        props.promptProps.movePrompt(draggedId, overIndex)
    }
}

const promptSource = {
    beginDrag(props) {
        return {
            promptId: props.prompt.promptId,
            originalIndex: props.promptProps.findPrompt(props.prompt.promptId).index
        }
    },

    isDragging(props, monitor) {
        return props.prompt.promptId === monitor.getItem().promptId
    },

    endDrag(props, monitor) {
        const { promptId: droppedId, originalIndex } = monitor.getItem()
        const didDrop = monitor.didDrop()

        if (!didDrop) {
            props.promptProps.movePrompt(droppedId, originalIndex)
        }
    }
}


function collectTarget(connect) {
    return {
        connectDropTarget: connect.dropTarget()
    }
}


function collectSource(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}


@DropTarget(ItemTypes.PROMPT, promptTarget, collectTarget)
@DragSource(ItemTypes.PROMPT, promptSource, collectSource)
export class Prompt extends React.Component {
    static propTypes = {
        prompt: PropTypes.object.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        connectDragSource: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        promptProps: PropTypes.shape({
            toggleView: PropTypes.func,
            findPrompt: PropTypes.func,
            movePrompt: PropTypes.func,
            deletePrompt: PropTypes.func,
            editPrompt: PropTypes.func,
            addPromptField: PropTypes.func,
            deletePromptField: PropTypes.func,
        }).isRequired
    }

    generateField(prompt) {
        // map the dragged selection to a new jsx element        
        const { promptTypes } = this.props

        // generate a field using Fields/Template.js and the filling jsx using the map
        // provided as props from index.js via Stack.js
        let FieldComponent = promptTypes.filter(type => type.id === prompt.id)[0].component
        return <FieldComponent { ...prompt } { ...this.props.promptProps } />
    }

    render() {
        const { connectDropTarget, connectDragSource, isDragging, prompt } = this.props
        const style = {
            opacity: isDragging ? 0.5 : 1,
            cursor: 'move'
        }
        const promptField = this.generateField(prompt)
        const promptFieldJSX = (
            <div className="question" style={style}>
                { promptField }
            </div>
        )

        // only allow dragging if prompt is not open for editing
        if (!promptField.props.data.edit) {
            return connectDragSource(connectDropTarget(promptFieldJSX))
        } else {
            return promptFieldJSX
        }        
    }
}