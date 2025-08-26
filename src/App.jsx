import { useOnlineStatus } from './hooks/useOnlineStatus'
import { ToyDetails } from './pages/ToyDetails'
import { ToyEdit } from './pages/ToyEdit'
import { ToyIndex } from './pages/ToyIndex'

function App() {
    const isOnline = useOnlineStatus()

    return (
        <div className="App">
            {/* Online Status Indicator */}
            <div className={`online-status ${isOnline ? 'online' : 'offline'}`}>
                {isOnline ? '🟢 Online' : '🔴 Offline'}
            </div>

            {/* Main Content */}
            <main>
                <h1>🎯 MisterToy</h1>
                <p>Welcome to your toy management application!</p>
                
                {/* For now, we'll show a simple navigation */}
                <div className="app-navigation">
                    <p>This is the main app structure. Components are ready but routing needs to be set up.</p>
                </div>
            </main>
        </div>
    )
}

export default App
