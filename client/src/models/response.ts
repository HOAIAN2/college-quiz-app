import { User } from './user'

export type ApiResponseWithData<T> = {
    status: 'success' | 'fail'
    data: T
    message?: string
}

export type LoginResponse = {
    user: User;
    token: string;
}