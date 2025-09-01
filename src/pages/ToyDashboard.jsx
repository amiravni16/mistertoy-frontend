import { useState, useEffect } from 'react'
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Area,
    AreaChart
} from 'recharts'
import { toyService } from '../services/toy.service.js'
import '../assets/style/cmps/ToyDashboard.css'

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

    // Process data for charts
    const getPricesPerLabel = () => {
        const labelData = {}
        
        toys.forEach(toy => {
            toy.labels?.forEach(label => {
                if (!labelData[label]) {
                    labelData[label] = {
                        label,
                        totalPrice: 0,
                        count: 0,
                        avgPrice: 0
                    }
                }
                labelData[label].totalPrice += toy.price
                labelData[label].count += 1
            })
        })

        // Calculate average prices
        Object.values(labelData).forEach(item => {
            item.avgPrice = Math.round((item.totalPrice / item.count) * 100) / 100
        })

        return Object.values(labelData).sort((a, b) => b.avgPrice - a.avgPrice)
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

        return Object.values(labelData).map(item => ({
            name: item.label,
            value: item.inStock,
            outOfStock: item.outOfStock,
            total: item.total,
            percentage: Math.round((item.inStock / item.total) * 100)
        }))
    }

    // Generate random data for line chart (sales over time)
    const getSalesData = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const currentYear = new Date().getFullYear()
        
        return months.map((month, index) => ({
            month,
            year: currentYear,
            sales: Math.floor(Math.random() * 1000) + 200,
            revenue: Math.floor(Math.random() * 5000) + 1000,
            toysSold: Math.floor(Math.random() * 50) + 10
        }))
    }

    // Generate random data for area chart (inventory levels over time)
    const getInventoryTrends = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        
        return months.map((month, index) => ({
            month,
            inStock: Math.floor(Math.random() * 200) + 100,
            outOfStock: Math.floor(Math.random() * 50) + 10,
            totalInventory: Math.floor(Math.random() * 300) + 150
        }))
    }

    if (isLoading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard data...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="dashboard-error">
                <h2>Error Loading Dashboard</h2>
                <p>{error}</p>
                <button onClick={loadToys} className="btn-retry">Retry</button>
            </div>
        )
    }

    const pricesData = getPricesPerLabel()
    const inventoryData = getInventoryByLabel()
    const salesData = getSalesData()
    const inventoryTrends = getInventoryTrends()

    return (
        <section className="dashboard-page">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Mister Toy Dashboard</h1>
                    <p>Analytics and insights for your toy business</p>
                </div>

                <div className="dashboard-stats">
                    <div className="stat-card">
                        <h3>Total Toys</h3>
                        <p className="stat-number">{toys.length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>In Stock</h3>
                        <p className="stat-number">{toys.filter(toy => toy.inStock).length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Categories</h3>
                        <p className="stat-number">{new Set(toys.flatMap(toy => toy.labels || [])).size}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Avg Price</h3>
                        <p className="stat-number">
                            ${Math.round((toys.reduce((sum, toy) => sum + toy.price, 0) / toys.length) * 100) / 100}
                        </p>
                    </div>
                </div>

                <div className="charts-grid">
                    {/* Prices per Label Chart */}
                    <div className="chart-container">
                        <h3>Average Prices by Category</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={pricesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`$${value}`, 'Average Price']} />
                                <Legend />
                                <Bar dataKey="avgPrice" fill="#8884d8" name="Average Price" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Inventory by Label Chart */}
                    <div className="chart-container">
                        <h3>Inventory Status by Category</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={inventoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {inventoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [value, 'In Stock']} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Sales Line Chart */}
                    <div className="chart-container full-width">
                        <h3>Monthly Sales Performance</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                <Line 
                                    yAxisId="left"
                                    type="monotone" 
                                    dataKey="sales" 
                                    stroke="#8884d8" 
                                    name="Sales Count"
                                    strokeWidth={2}
                                />
                                <Line 
                                    yAxisId="right"
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#82ca9d" 
                                    name="Revenue ($)"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Inventory Trends Area Chart */}
                    <div className="chart-container full-width">
                        <h3>Inventory Levels Over Time</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={inventoryTrends}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area 
                                    type="monotone" 
                                    dataKey="inStock" 
                                    stackId="1" 
                                    stroke="#8884d8" 
                                    fill="#8884d8" 
                                    name="In Stock"
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="outOfStock" 
                                    stackId="1" 
                                    stroke="#ff8042" 
                                    fill="#ff8042" 
                                    name="Out of Stock"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="dashboard-actions">
                    <button onClick={loadToys} className="btn-refresh">
                        Refresh Data
                    </button>
                </div>
            </div>
        </section>
    )
}
