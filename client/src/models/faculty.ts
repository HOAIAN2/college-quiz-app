export type Faculty = {
    id: number
    shortcode: string
    name: string
    email: string | null
    phoneNumber: string
    leaderId: number | null
    createdAt: string
    updatedAt: string
}

export type QueryFacultyType = {
    page?: number
    perPage?: number,
    search?: string
}