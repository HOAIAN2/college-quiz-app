import { createContext, ReactNode, createRef } from 'react'

const init: unknown = {}
interface DOMType {
    sideBarRef: React.RefObject<HTMLDivElement>
    titleRef: React.RefObject<HTMLHeadingElement>
}
const DOMContext = createContext<DOMType>(init as DOMType)
const sideBarRef = createRef<React.RefObject<HTMLDivElement>>()
const titleRef = createRef<React.RefObject<HTMLHeadingElement>>()

function DOMProvider({ children }: { children: ReactNode }) {
    return (
        <DOMContext.Provider value={{
            sideBarRef,
            titleRef
        } as never}>
            {children}
        </DOMContext.Provider>
    )
}

export {
    DOMProvider,
    DOMContext,
}