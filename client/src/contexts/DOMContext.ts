import { createRef } from 'react'

export type DOMContextType = {
    sideBarRef: React.RefObject<HTMLDivElement>
    titleRef: React.RefObject<HTMLHeadingElement>
}
export const sideBarRef = createRef<HTMLDivElement>()
export const titleRef = createRef<HTMLHeadingElement>()