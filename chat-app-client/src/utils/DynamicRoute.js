import React from 'react'
import { useAuthState } from '../context/auth'
import {Route, Navigate, Routes} from 'react-router-dom'

export default function DynamicRoute(props) {
    const {user} = useAuthState()
    
    if(props.authenticated && !user) {
        return <Routes><Route element={<Navigate to="/login" />} /></Routes>
    } else if(props.guest && user) {
        return <Routes><Route element={<Navigate to="/" />} /></Routes>
    } else {
        return <Routes><Route element={props.element} {...props} /></Routes>
    }
}