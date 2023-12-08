export type LoginPageLanguage = {
    login: string
    email: string
    password: string
}
export type NavBarLanguage = {
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
export type ImportDataLanguage = {
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
    delete: string
    student: string,
    teacher: string,
    admin: string,
    filter: {
        perPage: string,
        search: string
    }
    deleteMessage: string
}
export type ViewUserLanguage = {
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
export type YesNoPopUpLanguage = {
    yes: string
    no: string
}
export type DashboardLanguage = {
    items: {
        numberOfTeachers: string
        numberOfStudents: string
        numberOfSubjects: string
        numberOfCourses: string
        numberOfQuestions: string
        examInNextWeek: string
        examInThisMonth: string
    }
}