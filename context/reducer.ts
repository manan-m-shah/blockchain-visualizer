import { Action, ActionKind, State } from "../types/Context"

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionKind.SET_PUBLIC_KEY:
            return {
                ...state,
                publicKey: action.payload,
            }
        case ActionKind.SET_PRIVATE_KEY:
            return {
                ...state,
                privateKey: action.payload,
            }
        case ActionKind.SET_SELECTED_ACCOUNT:
            return {
                ...state,
                selectedAccount: action.payload,
            }
        case ActionKind.SET_BLOCKCHAIN:
            return {
                ...state,
                blockchain: action.payload,
            }
        case ActionKind.SET_ACTIVE_BLOCK:
            return {
                ...state,
                activeBlock: action.payload,
            }
        case ActionKind.SET_ACTIVE_TRANSACTION:
            return {
                ...state,
                activeTransaction: action.payload,
            }
        default:
            return state
    }
}

export default reducer