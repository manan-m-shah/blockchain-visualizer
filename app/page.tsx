'use client'
import type { NextPage } from 'next'
import { useContext } from 'react'
import AccountInfo from '../components/AccountInfo'
import ActionPanel from '../components/ActionPanel'
import BlockchainComponent from '../components/BlockchainComponent'
import BlockInfo from '../components/BlockInfo'
import TransactionInfo from '../components/TransactionInfo'
import AppContext from '../context/AppContext'
import { ActionKind } from '../types/Context'

const Home: NextPage = () => {
    const { state, dispatch } = useContext(AppContext)
    console.log(state)
    return (
        <div className="grid grid-rows-3 w-full gap-y-8 p-4 min-h-screen h-full">
            <div className='grid row-span-2 grid-cols-3 gap-x-8'>
                <AccountInfo />
                <BlockInfo />
                <ActionPanel />
            </div>
            <div className='grid row-span-1'>
                <BlockchainComponent />
            </div>
        </div>
    )
}

export default Home
