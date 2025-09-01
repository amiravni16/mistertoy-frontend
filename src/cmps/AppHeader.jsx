import { NavLink } from 'react-router-dom'

export function AppHeader() {
    return (
        <section className="app-header">
            <div className="container">
                <div className="flex justify-between">
                    <nav>
                        <NavLink to="/">home</NavLink> |
                        <NavLink to="/toy">toys</NavLink> |
                        <NavLink to="/dashboard">dashboard</NavLink> |
                        <NavLink to="/about">about</NavLink> |
                        <NavLink to="/login">login</NavLink>
                    </nav>
                </div>
                <div className="logo">Mister Toy</div>
            </div>
        </section>
    )
}
