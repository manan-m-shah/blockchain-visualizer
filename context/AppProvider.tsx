// create app context and provider
import axios from 'axios'
import React, { useEffect, useReducer, useState } from 'react'
import { Action, ActionKind, State } from '../types/Context'
import AppContext from './AppContext'
import initialState from './initialState'
import reducer from './reducer'

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const getBlockchain = async () => {
        console.log('getBlockchain')
        const response = await axios.get('http://localhost:5000/')
        console.log('response', response)
        return response.data.blockchain
    }

    useEffect(() => {
        if (state.blockchain) return
        const initializeBlockchain = async () => {
            const blockchain = await getBlockchain()
            console.log('blockchain', blockchain)
            dispatch({ type: ActionKind.SET_BLOCKCHAIN, payload: blockchain })
        }
        initializeBlockchain()
    }, [])

    return (
        <AppContext.Provider value={{ state, dispatch } as { state: State, dispatch: React.Dispatch<Action> }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider
