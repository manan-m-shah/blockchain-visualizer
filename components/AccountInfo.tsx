import { useContext, useState } from "react"
import AppContext from "../context/AppContext"


// windows - accounts and details
enum windows {
    ACCOUNTS = 'accounts',
    DETAILS = 'details',
}

const AccountInfo = () => {
    const [window, setWindow] = useState<windows>(windows.ACCOUNTS)

    const SwitchTabs = () => {
        return (
            <div className='grid grid-cols-3 gap-x-2 h-fit p-2'>
                <button
                    className={
                        'p-3 rounded ' + (window === windows.ACCOUNTS ? 'bg-violet-500' : '')
                    }
                    onClick={() => setWindow(windows.ACCOUNTS)}>Accounts</button>
                <button
                    className={
                        'p-3 rounded ' + (window === windows.DETAILS ? 'bg-violet-500' : '')
                    }
                    onClick={() => setWindow(windows.DETAILS)}>Details</button>
            </div>
        )
    }

    return (
        <div className='flex flex-col p-2 h-full border-2 rounded'>
            <SwitchTabs />
            {
                window === windows.ACCOUNTS && <Accounts /> ||
                window === windows.DETAILS && <Details />
            }
        </div>
    )
}

const Accounts = () => {
    const { state, dispatch } = useContext(AppContext)

    return (
        <div className="flex flex-col gap-y-8">
            <h1 className="text-2xl text-gray-500">Accounts</h1>
        </div>
    )
}

const Details = () => {
    const { state, dispatch } = useContext(AppContext)
    
    return (
        <div className="flex flex-col gap-y-8">
            <h1 className="text-2xl text-gray-500">Details</h1>
        </div>
    )
}

export default AccountInfo