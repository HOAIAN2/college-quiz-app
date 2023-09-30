import { Outlet } from 'react-router-dom'

export default function AuthLayout() {

    return (
        <div>
            <header></header>
            <div>
                <Outlet />
            </div>
            <footer></footer>
        </div>
    )
}