import { createContext, ReactNode, createRef } from 'react'

const init: unknown = null

const SideBarContext = createContext<React.RefObject<HTMLDivElement>>
    (init as React.RefObject<HTMLDivElement>)
const sideBarRef = createRef<React.RefObject<HTMLDivElement>>()

function SideBarProvider({ children }: { children: ReactNode }) {
    return (
        <SideBarContext.Provider value={sideBarRef as never}>
            {children}
        </SideBarContext.Provider>
    )
}

export {
    SideBarProvider,
    SideBarContext,
}