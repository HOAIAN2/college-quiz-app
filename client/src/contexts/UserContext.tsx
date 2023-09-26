import { createContext, useReducer, ReactNode, Reducer, Dispatch } from 'react'
import { User } from '../models/user'

const init: unknown = undefined
interface UserType {
    user: User | undefined
    dispatchUser: Dispatch<UserAction>
}
const UserContext = createContext<UserType>(init as UserType)
const USER_ACTION = {
    SET: 'SET',
    REMOVE: 'REMOVE'
}
interface UserAction {
    type: string
    payload: User | undefined
}
const userReducer: Reducer<User | undefined, UserAction> = (state, action) => {
    switch (action.type) {
        case USER_ACTION.SET: {
            if (!action.payload) return state
            // const birthDate = new Date(action.payload.birthDate)
            // let avatar = `${baseIMG}avatars/${action.payload.avatar}`
            // if (action.payload?.avatar === 'user.png') avatar = `${baseIMG}default/${action.payload?.avatar}`
            return {
                ...action.payload,
                // birthDate: birthDate,
                // avatar: avatar
            }
        }
        case USER_ACTION.REMOVE:
            return undefined
        default:
            return state;
    }
}
function UserProvider({ children }: { children: ReactNode }) {
    const [user, dispatchUser] = useReducer(userReducer, undefined)
    return (
        <UserContext.Provider value={{ user, dispatchUser } as UserType}>
            {children}
        </UserContext.Provider>
    )
}

export {
    UserProvider,
    UserContext,
    // eslint-disable-next-line react-refresh/only-export-components
    USER_ACTION,
}