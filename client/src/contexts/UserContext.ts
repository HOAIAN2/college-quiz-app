import { Dispatch, Reducer } from 'react'
import { User } from '../models/user'

export type UserContextType = {
    user: User | undefined
    dispatchUser: Dispatch<UserAction>
    USER_ACTION: typeof USER_ACTION
}
export const USER_ACTION = {
    SET: 'SET',
    REMOVE: 'REMOVE'
}
export type UserAction = {
    type: string
    payload: User | undefined
}
export const userReducer: Reducer<User | undefined, UserAction> = (state, action) => {
    switch (action.type) {
        case USER_ACTION.SET: {
            if (!action.payload) return state
            return structuredClone(action.payload)
        }
        case USER_ACTION.REMOVE:
            return undefined
        default:
            return state;
    }
}