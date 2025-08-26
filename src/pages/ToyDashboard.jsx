import { useEffect, useState } from 'react'
import { toyService } from '../services/toy.service.js'
import { Loader } from '../cmps/Loader.jsx'

export function ToyDashboard() {
    const [labelCounts, setLabelCounts] = useState(null)

    useEffect(() => {
        loadLabels()
    }, [])

    function loadLabels() {
        toyService.getToyLabelCounts()
            .then(labelCounts => {
                console.log('labelCounts:', labelCounts)
                setLabelCounts(labelCounts)
            })
    }

    if (!labelCounts) return <Loader />
    return (
        <section className="toy-dashboard">
            <h2>Toy Dashboard</h2>
            <div className="dashboard-content">
                <p>Label counts: {JSON.stringify(labelCounts)}</p>
                {/* Charts will be added later */}
            </div>
        </section>
    )
}
