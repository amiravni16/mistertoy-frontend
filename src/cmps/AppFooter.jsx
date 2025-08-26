import { useSelector } from "react-redux"

export function AppFooter() {
    const toysLength = useSelector(storeState => storeState.toyModule.toys.length)

    return (
        <section className="app-footer">
            <div className="container">
                <p>Coffeerights to all ({toysLength} toys in the app)</p>
            </div>
        </section>
    )
}
