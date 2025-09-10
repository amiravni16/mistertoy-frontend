export function HomePage() {
    return (
        <section className="home-page">
            <div className="hero">
                <div className="hero-content">
                    <h1>Welcome to MisterToy</h1>
                    <p className="hero-subtitle">
                        Discover, organize, and manage your amazing toy collection with our modern platform
                    </p>
                    <div className="hero-actions">
                        <button className="btn btn--primary btn--lg">Get Started</button>
                        <button className="btn btn--outline btn--lg">Learn More</button>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="toy-showcase">
                        <div className="toy-card">🧸</div>
                        <div className="toy-card">🚗</div>
                        <div className="toy-card">🎮</div>
                        <div className="toy-card">🧩</div>
                        <div className="toy-card">🎨</div>
                        <div className="toy-card">🏗️</div>
                    </div>
                </div>
            </div>

            <div className="features">
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🎯</div>
                        <h3>Smart Organization</h3>
                        <p>Automatically categorize and organize your toys with intelligent tagging and filtering systems.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔍</div>
                        <h3>Advanced Search</h3>
                        <p>Find any toy in your collection instantly with powerful search and filter capabilities.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Analytics Dashboard</h3>
                        <p>Track your collection growth, spending patterns, and toy trends with detailed analytics.</p>
                    </div>
                </div>
            </div>

            <div className="cta">
                <div className="cta-content">
                    <h2>Ready to Start Your Collection?</h2>
                    <p>Join thousands of toy enthusiasts who trust MisterToy to manage their precious collections.</p>
                    <div className="cta-actions">
                        <button className="btn btn--primary btn--lg">Start Free Trial</button>
                        <button className="btn btn--outline btn--lg">View Demo</button>
                    </div>
                </div>
            </div>
        </section>
    )
}
