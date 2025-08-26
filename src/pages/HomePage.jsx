export function HomePage() {
    return (
        <section className="home-page">
            <div className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Welcome to MisterToy</h1>
                    <p className="hero-subtitle">
                        Discover, organize, and manage your amazing toy collection with our modern platform
                    </p>
                    <div className="hero-features">
                        <div className="feature">
                            <span className="feature-icon">🎯</span>
                            <span>Smart Organization</span>
                        </div>
                        <div className="feature">
                            <span className="feature-icon">🔍</span>
                            <span>Advanced Search</span>
                        </div>
                        <div className="feature">
                            <span className="feature-icon">📊</span>
                            <span>Analytics Dashboard</span>
                        </div>
                    </div>
                </div>
                <div className="hero-image">
                    <img
                        src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                        alt="Colorful Toys Collection"
                    />
                </div>
            </div>
        </section>
    )
}
