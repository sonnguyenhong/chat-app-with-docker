import React, { Fragment, useEffect } from 'react'
import {Row, Col, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom'
import {gql, useSubscription } from '@apollo/client'

import { useAuthDispatch, useAuthState } from '../../context/auth';
import { useMessageDispatch } from '../../context/message'

import Users from './Users'
import Messages from './Messages'

const NEW_MESSAGE = gql`
    subscription newMessage {
        newMessage {
            id
            from
            to
            content
            createdAt
        }
    }
`

const NEW_REACTION = gql`
    subscription newReaction {
        newReaction {
            id
            content
            message {
                id 
                from
                to
            }
        }
    }
`

export default function Home({history}) {
    // const history = useNavigate()
    const authDispatch = useAuthDispatch()
    const messageDispatch = useMessageDispatch()

    const { user } = useAuthState()

    const { data: messageData, error: messageError } = useSubscription(NEW_MESSAGE)

    const { data: reactionData, error: reactionError } = useSubscription(NEW_REACTION)

    useEffect(() => {
        if(messageError) {
            console.log(messageError)
        }

        if(messageData) {
            const message = messageData.newMessage
            const otherUser = user.username === message.to ? message.from : message.to

            messageDispatch({
                type: 'ADD_MESSAGE', 
                payload: {
                    username: otherUser,
                    message
                }
            })
        }
    }, [messageError, messageData])

    useEffect(() => {
        if(reactionError) {
            console.log(reactionError)
        }

        if(reactionData) {
            const reaction = reactionData.newReaction
            const otherUser = user.username === reaction.message.to ? reaction.message.from : reaction.message.to

            messageDispatch({
                type: 'ADD_REACTION', 
                payload: {
                    username: otherUser,
                    reaction
                }
            })
        }
    }, [reactionError, reactionData])

    const logout = () => {
        authDispatch({type: 'LOGOUT'})
        window.location.href = '/login'
    }   
    

    return (
        <Fragment>
            <Row className="bg-white mb-1">
                <Col xs={4} className="text-center">
                    <Link to="/login">
                        <Button variant="link">Login</Button>
                    </Link>
                </Col>
                <Col xs={4} className="text-center">
                    <Link to="/register">
                        <Button variant="link">Register</Button>
                    </Link>
                </Col>
                <Col xs={4} className="text-center">
                    <Button variant="link" onClick={logout}>Logout</Button>
                </Col>
            </Row>
            <Row className="bg-white">
                <Users />
                <Messages />
            </Row>
        </Fragment>
    )
}