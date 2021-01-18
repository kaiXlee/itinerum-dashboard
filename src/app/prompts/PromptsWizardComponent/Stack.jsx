/*
 * src/app/prompts/PromptsWizardComponent/Stack.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { DropTarget } from 'react-dnd'

import { Prompt } from './Prompt'
import { ItemTypes } from './itemTypes'
import { styles } from './styles.scss'


const stackTarget = {
    drop(props, monitor) {
        // test if this is a new prompt to the stack or being moved
        const prompt = monitor.getItem()

        if (prompt.type === ItemTypes.PROMPT) {
            props.addPrompt(prompt)
        }
    }
}


function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    }
}
@DropTarget(ItemTypes.PROMPT, stackTarget, collect)
export default class Stack extends React.Component {
    static propTypes = {
        stack: PropTypes.array.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        isOver: PropTypes.bool.isRequired,
        addPrompt: PropTypes.func.isRequired,
        promptProps: PropTypes.object.isRequired
    }


    render() {
        const { connectDropTarget, isOver, stack, promptTypes } = this.props
        const color = isOver ? '#88A5FF': 'transparent'

        // generate prompt field elements for stack
        const prompts = stack.map((item, index) => {
            return <Prompt key={index}
                prompt={item}
                promptTypes={promptTypes}
                stackIndex={index}
                promptProps={this.props.promptProps} />
        })

        let showPlaceholderCSS = ''
        if (stack.length === 0)  showPlaceholderCSS = ' show'

        // return stack with prompts included
        return connectDropTarget(
            <div className={`${styles}`}>
                <div className="stack" style={{'backgroundColor': color}}>
                    {/* Placeholder prompt */}
                    <div className={"question placeholder" + showPlaceholderCSS}>
                        <div className="container-fluid">
                            <div className="row title">
                                <FormattedMessage id='promptsWizard.placeholder.title' />
                            </div>
                            <div className="form-field text-center">
                                <FormattedMessage id='promptsWizard.placeholder.text' />
                            </div>
                        </div>
                    </div>

                    {prompts}
                </div>
            </div>
        )
    }
}
