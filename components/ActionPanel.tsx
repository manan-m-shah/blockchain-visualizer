import axios from "axios"
import { use, useContext, useEffect, useState } from "react"
import { createNewTransaction, minePendingTransactions } from "../chain"
import { generateKeys, getPublicKey } from "../chain/keygenerator"
import AppContext from "../context/AppContext"
import { ActionKind } from "../types/Context"

// there are 3 windows: balance, transaction, and private key
enum windows {
    INFO = 'info',
    TRANSACTION = 'transaction',
    PRIVATEKEY = 'privatekey'
}

const getBlockchain = async () => {
    console.log('getBlockchain')
    const response = await axios.get('http://localhost:5000/')
    console.log('response', response)
    return response.data.blockchain
}

// the user should be able to see his current balance, number of transactions, reveal his private key, and send a transaction to another address
const ActionPanel = () => {
    const { state, dispatch } = useContext(AppContext)
    const [window, setWindow] = useState<windows>(windows.TRANSACTION)

    const fetchChain = async () => {
        // dispatch({ type: ActionKind.SET_BLOCKCHAIN, payload: state.blockchain })
        const blockchain = await getBlockchain()
        console.log('blockchain', blockchain)
        dispatch({ type: ActionKind.SET_BLOCKCHAIN, payload: blockchain })
    }

    const SwitchTabs = () => {
        return (
            <div className='grid grid-cols-3 gap-x-2 h-fit p-2 pb-1 border-b-2'>
                <button
                    className={
                        'p-3 rounded ' + (window === windows.INFO ? 'bg-violet-500' : '')
                    }
                    onClick={() => setWindow(windows.INFO)}>Info</button>
                <button
                    className={
                        'p-3 rounded ' + (window === windows.TRANSACTION ? 'bg-violet-500' : '')
                    }
                    onClick={() => setWindow(windows.TRANSACTION)}>Transaction</button>
                <button
                    className={
                        'p-3 rounded ' + (window === windows.PRIVATEKEY ? 'bg-violet-500' : '')
                    }
                    onClick={() => setWindow(windows.PRIVATEKEY)}>Private Key</button>
            </div>
        )
    }

    return (
        <div className='flex flex-col p-2 h-full border-2 rounded'>
            <SwitchTabs />
            <div className="grid items-start p-2 h-full">
                {
                    window === windows.INFO && <BalanceComponent /> ||
                    window === windows.TRANSACTION && <TransactionComponent /> ||
                    window === windows.PRIVATEKEY && <PrivateKeyComponent />
                }
            </div>
            <button
                className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded mb-4"
                onClick={fetchChain}
            >
                Fetch
            </button>
            <button
                className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                    console.log('logging out')
                }}
            >
                Logout
            </button>
        </div>
    )
}

const BalanceComponent = () => {
    const { state, dispatch } = useContext(AppContext)
    const [balance, setBalance] = useState(0)

    useEffect(() => {
        if (!state.blockchain || !state.publicKey) {
            return
        }
        const newBalance = state.blockchain.getBalanceOfAddress(state.publicKey)
        setBalance(newBalance)
    }, [state])

    if (!state.blockchain || !state.publicKey) {
        return (
            <div>
                No Account
            </div>
        )
    }


    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl text-gray-500">
                My Wallet
            </h1>
            <button
                className="text-gray-500 break-all border-2 p-2 rounded text-left"
                onClick={() => {
                    navigator.clipboard.writeText(state.publicKey || 'No public key')
                }}
            >
                {state.publicKey}
            </button>
            <div className="flex flex-col gap-y-4">
                <div className="flex gap-x-4 items-center">
                    <h1 className="text-xl">
                        Balance:
                    </h1>
                    <h1 className="text-gray-500">
                        {balance}
                    </h1>
                </div>
                <div className="flex gap-x-4 items-center">
                    <h1 className="text-xl">
                        Transactions:
                    </h1>
                    <h1 className="text-gray-500">
                        {state.blockchain?.getAllTransactionsForWallet(state.publicKey).length}
                    </h1>
                </div>
            </div>
        </div >
    )
}

const TransactionComponent = () => {
    const { state, dispatch } = useContext(AppContext)
    const [receiverPublicKey, setReceiverPublicKey] = useState<string>('')
    const [amount, setAmount] = useState<number>(0)

    const sendTransaction = (e: any) => {
        e.preventDefault()
        if (!state.blockchain || !state.publicKey) {
            console.log('no blockchain or public key')
            return
        }
        console.log('sending transaction')
        createNewTransaction(state.blockchain, state.publicKey, receiverPublicKey, amount)
    }

    return (
        <div className="flex flex-col gap-y-8">
            <form
                className="flex flex-col gap-y-8"
                onSubmit={sendTransaction}
            >
                <div className="flex flex-col gap-y-2">
                    <label className="text-gray-500">
                        To:
                    </label>
                    <input
                        className="border-2 p-2 rounded"
                        type="text"
                        placeholder="Receiver Public Key"
                        onChange={(e) => setReceiverPublicKey(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-y-2">
                    <label className="text-gray-500">
                        Amount:
                    </label>
                    <input
                        className="border-2 p-2 rounded"
                        type="number"
                        placeholder="0"
                        onChange={(e) => setAmount(parseInt(e.target.value))}
                    />
                </div>
                <button
                    className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded"
                    type="submit"
                >
                    Send
                </button>
            </form>
        </div>
    )
}

const PrivateKeyComponent = () => {
    const { state, dispatch } = useContext(AppContext)
    const [privateKeyInput, setPrivateKeyInput] = useState<string | undefined>(undefined)
    const createAccount = () => {
        console.log('creating account')
        const { publicKey, privateKey } = generateKeys()

        dispatch({
            type: ActionKind.SET_PUBLIC_KEY,
            payload: publicKey
        })

        dispatch({
            type: ActionKind.SET_PRIVATE_KEY,
            payload: privateKey
        })
    }

    const importAccount = (e: any) => {
        e.preventDefault()
        dispatch({
            type: ActionKind.SET_PRIVATE_KEY,
            payload: privateKeyInput
        })
        console.log('importing account')
        if (!state.privateKey) {
            console.log('no private key')
            return
        }
        const publicKey = getPublicKey(state.privateKey)
        dispatch({
            type: ActionKind.SET_PUBLIC_KEY,
            payload: publicKey
        })
    }

    if (!state.publicKey) {
        return (
            <div className='flex flex-col gap-y-2 justify-center items-center w-full h-full'>
                <form
                    className='flex gap-y-2 gap-x-2'
                    onSubmit={importAccount}
                >
                    <input
                        className='border-2 border-gray-300 p-2 rounded'
                        type='text'
                        placeholder='Private Key'
                        onChange={(e) => {
                            setPrivateKeyInput(e.target.value)
                        }} />
                    <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs'
                        type='submit'>
                        Import
                    </button>
                </form>
                <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                    onClick={createAccount}>
                    Create Account
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-start gap-y-8 h-full items-center w-full">
            <h1 className="w-full text-left text-2xl text-gray-500">
                Tap your private key to copy
            </h1>
            <button className="border-2 rounded p-4 w-full break-all text-left"
                onClick={() => {
                    navigator.clipboard.writeText(state.privateKey || 'No private key')
                }}
            >
                {state.privateKey}
            </button>
            <h1 className="text-red-400 border-2 border-red-600 bg-red-100 p-2 rounded w-full text-left">
                Warning: Never disclose this key. Anyone with your private keys can steal any assets held in your account.
            </h1>
        </div >
    )
}

export default ActionPanel