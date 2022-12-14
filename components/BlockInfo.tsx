import { useContext, useState } from "react"
import AppContext from "../context/AppContext"
import { ActionKind } from "../types/Context"

// windows - block, transaction
enum windows {
    BLOCK = 'block',
    TRANSACTION = 'transaction'
}

const BlockInfo = () => {
    const { state, dispatch } = useContext(AppContext)
    const [window, setWindow] = useState<windows>(windows.BLOCK)

    const SwitchTabs = () => {
        return (
            <div className='grid grid-cols-2 gap-x-2 h-fit p-2 pb-1 border-b-2'>
                <button
                    className={
                        'p-3 rounded ' + (window === windows.BLOCK ? 'bg-violet-500' : '')
                    }
                    onClick={() => setWindow(windows.BLOCK)}>Block</button>
                <button
                    className={
                        'p-3 rounded ' + (window === windows.TRANSACTION ? 'bg-violet-500' : '')
                    }
                    onClick={() => setWindow(windows.TRANSACTION)}>Transaction</button>
            </div>
        )
    }

    return (
        <div className='flex flex-col p-2 h-full rounded border-2'>
            <SwitchTabs />
            {
                window === windows.BLOCK && <Block setWindow={setWindow}/> ||
                window === windows.TRANSACTION && <Transaction />
            }
        </div>
    )
}

const Block = ({ setWindow }: { setWindow: React.Dispatch<windows> }) => {
    const { state, dispatch } = useContext(AppContext)

    console.log("current block hash", state.activeBlock?.getCurrentHash())
    console.log("previous block hash", state.activeBlock?.previousHash)

    return (
        <div className="flex flex-col gap-y-8">
            <h1 className="text-2xl text-gray-500">Block Details</h1>
            <div className="flex gap-x-4 items-center">
                <h1 className="text-xl text-gray-500">Block Hash</h1>
                <h1 className="text-gray-500 text-sm break-all">{state.activeBlock?.getCurrentHash()}</h1>
            </div>
            <div className="flex gap-x-4 items-center">
                <h1 className="text-xl text-gray-500">Previous Hash</h1>
                <h1 className="text-gray-500 text-sm break-all">{state.activeBlock?.previousHash}</h1>
            </div>
            <div className="flex gap-x-4 items-center">
                <h1 className="text-xl text-gray-500">Timestamp</h1>
                <h1 className="text-gray-500 text-sm break-all">{state.activeBlock?.timestamp}</h1>
            </div>
            <h1 className="text-2xl text-gray-500">Transactions</h1>
            <div className="grid grid-cols-6 gap-y-4 gap-x-4 items-center">
                {
                    state.activeBlock?.transactions.map((transaction, index) => {
                        return (
                            <button key={index} className='p-3 rounded bg-gray-800 text-center'
                                onClick={() => {
                                    dispatch({ type: ActionKind.SET_ACTIVE_TRANSACTION, payload: transaction })
                                    setWindow(windows.TRANSACTION)
                                }}
                            >
                                <h1 className="text-xl text-gray-100">{index + 1}</h1>
                            </button>
                        )
                    })
                }
            </div>
        </div>
    )
}

const Transaction = () => {
    const { state, dispatch } = useContext(AppContext)

    return (
        <div className="flex flex-col gap-y-8">
            <h1 className="text-2xl text-gray-500">Transaction Details</h1>
            <div className="flex gap-x-4 items-center">
                <h1 className="text-xl text-gray-500">Transaction Hash</h1>
                <h1 className="text-gray-500 text-sm break-all">{state.activeTransaction?.calculateHash()}</h1>
            </div>
            <div className="flex gap-x-4 items-center">
                <h1 className="text-xl text-gray-500">Amount</h1>
                <h1 className="text-gray-500 text-sm break-all">{state.activeTransaction?.amount}</h1>
            </div>
            <div className="flex gap-x-4 items-center">
                <h1 className="text-xl text-gray-500">Sender</h1>
                <h1 className="text-gray-500 text-sm break-all">{state.activeTransaction?.fromAddress}</h1>
            </div>
            <div className="flex gap-x-4 items-center">
                <h1 className="text-xl text-gray-500">Receiver</h1>
                <h1 className="text-gray-500 text-sm break-all">{state.activeTransaction?.toAddress}</h1>
            </div>
            <div className="flex gap-x-4 items-center">
                <h1 className="text-xl text-gray-500">Timestamp</h1>
                <h1 className="text-gray-500 text-sm break-all">{state.activeTransaction?.timestamp}</h1>
            </div>
        </div>
    )
}

export default BlockInfo