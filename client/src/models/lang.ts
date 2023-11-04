export type LoginPageLanguage = {
    login: string
    email: string
    password: string
}
export type DashboardLanguage = {
    dashboard: string
    subjects: string
    courses: string
    profile: string
    exams: string
    questions: string
    teachers: string
    students: string
}
export type CreateUserLanguage = {
    create: string
    student: string
    teacher: string
    admin: string
    genders: Genders
    email: string
    firstName: string
    lastName: string
    shortcode: string
    address: string
    birthDate: string
    password: string
    save: string
    saveMore: string
}

export type Genders = {
    male: string
    female: string
    gender: string
}
export type UsersLanguage = {
    add: string
    import: string
    export: string
    table: {
        header: {
            id: string
            name: string
            shortcode: string
            class: string
            email: string
        }
        filter: {
            perPage: string,
            search: string
        }
    }
}