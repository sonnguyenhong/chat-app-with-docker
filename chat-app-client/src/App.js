import React from 'react'
import {Container} from 'react-bootstrap'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import ApolloProvider from './ApolloProvider'

import './App.scss'
import Home from './pages/home/Home'
import Register from './pages/Register'
import Login from './pages/Login'

import {AuthProvider} from './context/auth'
import {MessageProvider} from './context/message'

function App() {

  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
          <BrowserRouter>
            <Container className="pt-5">
              <Routes>
                <Route exact path="/" element={ <Home /> } authenticated/>
                <Route path="/register" element={ <Register /> } guest/>
                <Route path="/login" element={ <Login /> } guest/>
              </Routes>
            </Container>
          </BrowserRouter>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
