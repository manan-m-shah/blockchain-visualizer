import { useContext } from "react"
import AppContext from "../context/AppContext"
import { ActionKind } from "../types/Context"

const BlockchainComponent = () => {
    const { state, dispatch } = useContext(AppContext)


    return (
        <div className="flex flex-col gap-y-8">
            <h1 className="text-2xl text-gray-500">
                Blocks
            </h1>
            <div className="flex gap-x-16">
                {
                    state.blockchain?.chain.map((block, index) => {
                        return (
                            <button key={index}
                                className="p-8 px-12 text-xl text-yellow-500 bg-yellow-100 rounded-2xl"
                                onClick={() => { 
                                    dispatch({
                                        type: ActionKind.SET_ACTIVE_BLOCK,
                                        payload: block
                                    })
                                }}
                            >
                                <h1 className="">
                                    {index}
                                </h1>
                            </button>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default BlockchainComponent