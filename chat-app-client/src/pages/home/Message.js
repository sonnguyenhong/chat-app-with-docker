import React, { useState } from 'react' 
import classNames from 'classnames'
import { useAuthState } from '../../context/auth'
import { OverlayTrigger, Popover, Tooltip } from 'react-bootstrap'
import moment from 'moment'
import { Button } from 'react-bootstrap'
import { gql, useMutation } from '@apollo/client'

const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎']

const REACT_TO_MESSAGE = gql`
    mutation reactToMessage($messageId: Int! $content: String!) {
        reactToMessage(messageId: $messageId, content: $content) {
            id
            content
            createdAt
        }
    }
`

export default function Message({message}) {
    const {user} = useAuthState()
    const sent = message.from === user.username
    const received = !sent
    const [showPopover, setShowPopover] = useState(false)

    const reactionIcons = [...new Set(message.reactions.map(reaction => reaction.content))]

    const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
        onError: err => console.log(err),
        onCompleted: (data) => setShowPopover(false)
    })
    
    const react = (reaction) => {
        console.log(`React ${reaction} to message: ${message.id}`)
        reactToMessage({variables: {messageId: message.id, content: reaction}})
    }

    const reactButton = (
        <OverlayTrigger
            trigger="click"
            placement="top"
            show={showPopover}
            onToggle={setShowPopover}
            transition={false}
            rootClose
            overlay={
                <Popover
                    className='rounded-pill'>
                    <Popover.Body className="d-flex align-items-center react-btn-popover">
                        {
                            reactions.map(reaction => {
                                return (
                                    <Button 
                                        variant="link" 
                                        className="react-icon-btn"
                                        key={reaction}
                                        onClick={() => react(reaction)}>
                                            {reaction}
                                    </Button>
                                )
                            })
                        }
                    </Popover.Body>
                </Popover>
            }
            >
            <Button variant="link" className="px-2">
                <i className="far fa-smile"></i>
            </Button>
        </OverlayTrigger>
    )

    return (
        <div className={classNames("d-flex my-3", {
            "ms-auto": sent,
            "me-auto": received
        })}>
            {sent && reactButton}
            <OverlayTrigger
                placement={sent ? "left" : "right"}
                overlay={
                    <Tooltip>
                        {moment(message.createdAt).format('MMMM DD, YYYY @ h:mm a')}
                    </Tooltip>
                }
            >
                <div className={classNames("py-2 px-3 rounded-pill position-relative", {
                    "bg-primary": sent,
                    "bg-secondary": received
                })}>
                    {message.reactions.length > 0 && (
                        <div className='reactions-div bg-secondary p-1 rounded-pill'>
                            {reactionIcons} {message.reactions.length}
                        </div>
                    )}
                    <p className={classNames({"text-white": sent})} key={message.id}>{message.content}</p>
                </div>
            </OverlayTrigger>
            {received && reactButton}
        </div>

        
    )
}