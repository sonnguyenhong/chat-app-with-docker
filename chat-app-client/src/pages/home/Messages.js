import React, {useEffect, Fragment, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {gql, useLazyQuery, useMutation } from '@apollo/client'
import {faPaperPlane} from '@fortawesome/free-regular-svg-icons'
import {Col, Form} from 'react-bootstrap';

import Message from './Message'

import { useMessageDispatch, useMessageState } from '../../context/message'

const SEND_MESSAGE = gql`
    mutation sendMessage($to: String!, $content: String!) {
        sendMessage(to: $to, content: $content) {
            id
            from
            to
            content
            createdAt
        }
    }
`

const GET_MESSAGES = gql`
    query getMessages($from: String!) {
        getMessages(from: $from) {
            id
            from
            to
            content
            createdAt
            reactions {
                id
                content
            }
        }
    }
`

const SEND_MESSAGE_SUBCRIPTION = gql`
    subscription OnSendMessage($username: String!) {
        newMessage(username: $username) {
            id 
            content
            from
            to
            createdAt
        }
    }
`

export default function Messages() { 

    const {users} = useMessageState()
    const dispatch = useMessageDispatch()
    const [content, setContent] = useState('')

    const selectedUser = users?.find(u => u.selected === true)
    const messages = selectedUser?.messages


    const [getMessages, {loading: messagesLoading, data: messagesData}] = useLazyQuery(GET_MESSAGES)
    const [sendMessage] = useMutation(SEND_MESSAGE, {
        // onCompleted: data => {
        //     return dispatch({type: 'ADD_MESSAGE', payload: {
        //         username: selectedUser.username,
        //         message: data.sendMessage
        //     }})
        // },
        onError: err => console.log(err)
    })
    

    useEffect(() => {
        if(selectedUser && !selectedUser?.messages) {
            getMessages({variables: {from: selectedUser.username}})
        }
    }, [selectedUser])

    useEffect(() => {
        if(messagesData) {
            dispatch({type: 'SET_USER_MESSAGES', payload: {
                username: selectedUser.username,
                messages: messagesData.getMessages
            }})
        }
    }, [messagesData])

    const submitMessage = e => {
        e.preventDefault()
        if(content.trim() === '' || !selectedUser) {
            return 
        } 

        setContent('')
        // mutation for sending message
        sendMessage({variables: {
            to: selectedUser.username,
            content
        }})
    }

    let selectedChatMarkup
    if(!messages && !messagesLoading) {
        selectedChatMarkup = <p className='info-text'>Select a friend</p>
    } else if(messagesLoading) {
        selectedChatMarkup = <p className='info-text'>Loading ...</p>
    } else if(messages.length > 0) {
        selectedChatMarkup = messages.map((message, index) => {
            return (
                <Fragment key={message.id}>
                    <Message message={message} />
                    {index === messages.length - 1 && (
                        <div className="invisible">
                            <hr className="m-0" />
                        </div>
                    )}
                </Fragment>
            )
        })
    } else if(messages.length === 0) {
        selectedChatMarkup = <p className='info-text'>You are now connected! Send your first messages</p>
    }

    return (
        <Col xs={10} md={8} className="p-0">
            <div className='messages-box d-flex flex-column-reverse p-3'>
                {selectedChatMarkup}
            </div>
            <div className='mb-4 px-3 py-2'>  
                <Form onSubmit={submitMessage}>
                    <Form.Group className="d-flex align-items-center m-0">
                        <Form.Control
                            type="text"
                            className="message-input rounded-pill bg-secondary border-0 px-4"
                            placeholder="Type a message ..."
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                        <FontAwesomeIcon icon={faPaperPlane} className="sent-icon" onClick={submitMessage}/>
                    </Form.Group>
                </Form>
            </div>
        </Col>
    )
}