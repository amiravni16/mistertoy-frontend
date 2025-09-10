import { useState, useEffect } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js'
import { Pie, Bar, Line } from 'react-chartjs-2'
import { toyService } from '../services/toy.service.js'
import '../assets/style/pages/ToyDashboard.css'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement)

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B']

export function ToyDashboard() {
    const [toys, setToys] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loadToys()
    }, [])

    async function loadToys() {
        try {
            setIsLoading(true)
            const toysData = await toyService.query()
            setToys(toysData)
        } catch (err) {
            setError('Failed to load toys data')
            console.error('Error loading toys:', err)
        } finally {
            setIsLoading(false)
        }
    }

    // Process data for charts (Chart.js format)
    const getPricesPerLabel = () => {
        const labelData = {}
        
        toys.forEach(toy => {
            toy.labels?.forEach(label => {
                if (!labelData[label]) {
                    labelData[label] = {
                        totalPrice: 0,
                        count: 0
                    }
                }
                labelData[label].totalPrice += toy.price
                labelData[label].count += 1
            })
        })

        const labels = Object.keys(labelData)
        const data = labels.map(label => 
            Math.round((labelData[label].totalPrice / labelData[label].count) * 100) / 100
        )

        return {
            labels,
            datasets: [{
                label: 'Average Price ($)',
                data,
                backgroundColor: COLORS.slice(0, labels.length),
                borderColor: COLORS.slice(0, labels.length),
                borderWidth: 1
            }]
        }
    }

    const getInventoryByLabel = () => {
        const labelData = {}
        
        toys.forEach(toy => {
            toy.labels?.forEach(label => {
                if (!labelData[label]) {
                    labelData[label] = {
                        label,
                        inStock: 0,
                        outOfStock: 0,
                        total: 0
                    }
                }
                if (toy.inStock) {
                    labelData[label].inStock += 1
                } else {
                    labelData[label].outOfStock += 1
                }
                labelData[label].total += 1
            })
        })

        const labels = Object.keys(labelData)
        const inStockData = labels.map(label => labelData[label].inStock)
        const outOfStockData = labels.map(label => labelData[label].outOfStock)

        return {
            labels,
            datasets: [{
                label: 'In Stock',
                data: inStockData,
                backgroundColor: '#00C49F',
                borderColor: '#00C49F',
                borderWidth: 1
            }, {
                label: 'Out of Stock',
                data: outOfStockData,
                backgroundColor: '#FF8042',
                borderColor: '#FF8042',
                borderWidth: 1
            }]
        }
    }

    // Generate random data for line chart (sales over time) - Chart.js format
    const getSalesData = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        
        return {
            labels: months,
            datasets: [{
                label: 'Sales',
                data: months.map(() => Math.floor(Math.random() * 1000) + 200),
                borderColor: '#0088FE',
                backgroundColor: 'rgba(0, 136, 254, 0.1)',
                tension: 0.4
            }, {
                label: 'Revenue ($)',
                data: months.map(() => Math.floor(Math.random() * 5000) + 1000),
                borderColor: '#00C49F',
                backgroundColor: 'rgba(0, 196, 159, 0.1)',
                tension: 0.4
            }]
        }
    }

    // Generate random data for line chart (inventory levels over time) - Chart.js format
    const getInventoryTrends = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        
        return {
            labels: months,
            datasets: [{
                label: 'In Stock',
                data: months.map(() => Math.floor(Math.random() * 200) + 100),
                borderColor: '#00C49F',
                backgroundColor: 'rgba(0, 196, 159, 0.1)',
                tension: 0.4
            }, {
                label: 'Out of Stock',
                data: months.map(() => Math.floor(Math.random() * 50) + 10),
                borderColor: '#FF8042',
                backgroundColor: 'rgba(255, 128, 66, 0.1)',
                tension: 0.4
            }]
        }
    }

    if (isLoading) {
        return (
            <div className="toy-dashboard">
                <div className="dashboard-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading dashboard data...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="toy-dashboard">
                <div className="dashboard-error">
                    <h2>Error Loading Dashboard</h2>
                    <p>{error}</p>
                    <button onClick={loadToys} className="btn btn--primary">Retry</button>
                </div>
            </div>
        )
    }

    // Data is now generated directly in the chart components

    return (
        <section className="toy-dashboard">
            <div className="dashboard-header">
                <h1>Mister Toy Dashboard</h1>
                <p className="dashboard-description">Analytics and insights for your toy business</p>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon">🧸</div>
                    <div className="stat-value">{toys.length}</div>
                    <div className="stat-label">Total Toys</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-value">{toys.filter(toy => toy.inStock).length}</div>
                    <div className="stat-label">In Stock</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📂</div>
                    <div className="stat-value">{new Set(toys.flatMap(toy => toy.labels || [])).size}</div>
                    <div className="stat-label">Categories</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-value">
                        ${Math.round((toys.reduce((sum, toy) => sum + toy.price, 0) / toys.length) * 100) / 100}
                    </div>
                    <div className="stat-label">Avg Price</div>
                </div>
            </div>

            <div className="dashboard-charts">
                {/* Prices per Label Chart */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3>Average Prices by Category</h3>
                    </div>
                    <div className="chart-content">
                        <Bar data={getPricesPerLabel()} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                }
                            }
                        }} />
                    </div>
                </div>

                {/* Inventory by Label Chart */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3>Inventory Status by Category</h3>
                    </div>
                    <div className="chart-content">
                        <Bar data={getInventoryByLabel()} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                }
                            }
                        }} />
                    </div>
                </div>

                {/* Sales Line Chart */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3>Monthly Sales Performance</h3>
                    </div>
                    <div className="chart-content">
                        <Line data={getSalesData()} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                }
                            }
                        }} />
                    </div>
                </div>

                {/* Inventory Trends Area Chart */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3>Inventory Levels Over Time</h3>
                    </div>
                    <div className="chart-content">
                        <Line data={getInventoryTrends()} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                }
                            }
                        }} />
                    </div>
                </div>
            </div>

            <div className="dashboard-actions">
                <button onClick={loadToys} className="action-btn primary">
                    🔄 Refresh Data
                </button>
            </div>
        </section>
    )
}
