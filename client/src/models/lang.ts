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
    class: string
    address: string
    birthDate: string
    password: string
    save: string
    saveMore: string
}
export type ImportUsersLanguage = {
    import: string
    student: string
    teacher: string
    admin: string
    save: string
    downloadTemplate: string
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
    filter: {
        perPage: string,
        search: string
    }
}
export type UsersTableLanguage = {
    header: {
        id: string
        name: string
        shortcode: string
        class: string
        email: string
        address: string
    }
    filter: {
        perPage: string,
        search: string
    }
}