/*
 * src/app/survey/SurveyWizardComponent/Question.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom';
import { DropTarget, DragSource } from 'react-dnd'

import { ItemTypes } from './itemTypes'
import { styles } from './styles.scss'



const questionTarget = {
    canDrop() {
        return false
    },

    hover(props, monitor, component) {
        // cancel if hovering item is a new selection
        if (monitor.getItem().surveyId === null) return

        const { surveyId: draggedId } = monitor.getItem()
        const { surveyId: overId } = props.question

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
        // particular spot in survey stack
        const dragIndex = monitor.getItem().originalIndex,
              hoverIndex = props.stackIndex,
              offset = hoverMiddleY / 4
        // dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < (hoverMiddleY + offset)) {
            return
        }
        // dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > (hoverMiddleY - offset)) {
            return
        }

        const { index: overIndex } = props.questionProps.findQuestion(overId)
        props.questionProps.moveQuestion(draggedId, overIndex)
    }
}

const questionSource = {
    beginDrag(props) {
        return {
            surveyId: props.question.surveyId,
            originalIndex: props.questionProps.findQuestion(props.question.surveyId).index
        }
    },

    isDragging(props, monitor) {
        return props.question.surveyId === monitor.getItem().surveyId
    },

    endDrag(props, monitor) {
        const { surveyId: droppedId, originalIndex } = monitor.getItem()
        const didDrop = monitor.didDrop()

        if (!didDrop) {
            props.questionProps.moveQuestion(droppedId, originalIndex)
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


@DropTarget(ItemTypes.QUESTION, questionTarget, collectTarget)
@DragSource(ItemTypes.QUESTION, questionSource, collectSource)
export class Question extends React.Component {
    static propTypes = {
        question: PropTypes.object.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        connectDragSource: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        questionProps: PropTypes.shape({
            toggleView: PropTypes.func,
            findQuestion: PropTypes.func,
            moveQuestion: PropTypes.func,
            deleteQuestion: PropTypes.func,
            editQuestion: PropTypes.func,
            addQuestionField: PropTypes.func,
            deleteQuestionField: PropTypes.func,
        }).isRequired
    }

    generateField(question) {
        // map the dragged selection to a new jsx element
        const { questionTypes } = this.props

        // generate a field using Fields/Template.js and the filling jsx using the map
        // provided as props from index.js via Stack.js
        let FieldComponent = questionTypes.filter(type => type.id === question.id)[0].component
        return <FieldComponent { ...question } { ...this.props.questionProps } />
    }

    render() {
        const { connectDropTarget, connectDragSource, isDragging, question } = this.props
        const style = {
            opacity: isDragging ? 0.5 : 1,
            cursor: 'grab'
        }
        const element = this.generateField(question)

        // only allow dragging if question is not open for editing
        if (!element.props.data.edit) {
            return connectDragSource(connectDropTarget(
                <div className="question" style={style}>
                    {element}
                </div>
            ))
        } else {
            return (
                <div className="question" style={style}>
                    {element}
                </div>
            )
        }
    }
}
