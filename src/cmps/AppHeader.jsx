import { NavLink } from 'react-router-dom'

export function AppHeader() {
    return (
        <section className="app-header container">
            <div className="flex justify-between">
                <nav>
                    <NavLink to="/">home</NavLink> |
                    <NavLink to="/toy">toys</NavLink> |
                    <NavLink to="/dashboard">dashboard</NavLink> |
                    <NavLink to="/about">about</NavLink>
                </nav>
            </div>
            <div className="logo">Mister Toy</div>
        </section>
    )
}
