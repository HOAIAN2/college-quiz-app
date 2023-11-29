import { User } from './user'

export type ApiResponseWithData<T> = {
    status: 'success' | 'fail'
    data: T
    message: string | null
}

export type LoginResponse = {
    user: User;
    token: string;
}