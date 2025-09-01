import axios from 'axios'
import { authService } from './auth.service.js'

const BASE_URL = '/api/toy'



const labels = [
    'On wheels',
    'Box game',
    'Art',
    'Baby',
    'Doll',
    'Puzzle',
    'Outdoor',
    'Battery Powered',
]

export const toyService = {
    query,
    getById,
    save,
    remove,
    getEmptyToy,
    getDefaultFilter,
    getDefaultSort,
    getToyLabels,
    getToyLabelCounts,
    getInStockValue
}

function query(filterBy = {}, sortBy = {}) {
    // Build query parameters for backend
    const params = new URLSearchParams()
    
    if (filterBy.txt) params.append('txt', filterBy.txt)
    if (filterBy.minPrice) params.append('minPrice', filterBy.minPrice)
    if (filterBy.maxPrice) params.append('maxPrice', filterBy.maxPrice)
    if (filterBy.category) params.append('category', filterBy.category)
    if (typeof filterBy.inStock === 'boolean') params.append('inStock', filterBy.inStock)
    if (filterBy.pageIdx !== undefined) params.append('pageIdx', filterBy.pageIdx)
    
    return axios.get(`${BASE_URL}?${params.toString()}`)
        .then(res => {
            let toysToShow = res.data.map(backendToy => ({
                _id: backendToy._id,
                name: backendToy.name,
                price: backendToy.price,
                labels: backendToy.category ? backendToy.category.split(', ').filter(Boolean) : [],
                imgUrl: backendToy.imageUrl || `https://robohash.org/${backendToy.name}?set=set4`,
                createdAt: new Date(backendToy.createdAt).getTime(),
                inStock: backendToy.inStock,
                description: backendToy.description,
                ageRange: backendToy.ageRange
            }))
            
            //* Filter by labels (backend doesn't support this yet, so we filter client-side)
            if (filterBy.labels?.length) {
                toysToShow = toysToShow.filter(toy =>
                    filterBy.labels.every(label => toy.labels?.includes(label))
                )
            }
            
            //* Sort (backend doesn't support this yet, so we sort client-side)
            if (sortBy.type) {
                const dir = +sortBy.desc
                toysToShow.sort((a, b) => {
                    if (sortBy.type === 'name') {
                        return a.name.localeCompare(b.name) * dir
                    } else if (sortBy.type === 'price' || sortBy.type === 'createdAt') {
                        return (a[sortBy.type] - b[sortBy.type]) * dir
                    }
                })
            }
            
            return toysToShow
        })
        .catch(err => {
            console.error('Error fetching toys:', err)
            throw err
        })
}

function getById(toyId) {
    return axios.get(`${BASE_URL}/${toyId}`)
        .then(res => {
            const backendToy = res.data
            return {
                _id: backendToy._id,
                name: backendToy.name,
                price: backendToy.price,
                labels: backendToy.category ? backendToy.category.split(', ').filter(Boolean) : [],
                imgUrl: backendToy.imageUrl || `https://robohash.org/${backendToy.name}?set=set4`,
                createdAt: new Date(backendToy.createdAt).getTime(),
                inStock: backendToy.inStock,
                description: backendToy.description,
                ageRange: backendToy.ageRange
            }
        })
        .catch(err => {
            console.error('Error fetching toy:', err)
            throw err
        })
}

function remove(toyId) {
    return axios.delete(`${BASE_URL}/${toyId}`)
        .then(() => toyId)
        .catch(err => {
            console.error('Error removing toy:', err)
            throw err
        })
}

function save(toy) {
    if (toy._id) {
        // Update existing toy
        return axios.put(`${BASE_URL}/${toy._id}`, {
            name: toy.name,
            category: toy.labels?.join(', ') || '',
            price: toy.price,
            description: toy.description || '',
            ageRange: toy.ageRange || '',
            imageUrl: toy.imgUrl || '',
            inStock: toy.inStock
        })
        .then(res => {
            const backendToy = res.data
            return {
                _id: backendToy._id,
                name: backendToy.name,
                price: backendToy.price,
                labels: backendToy.category ? backendToy.category.split(', ').filter(Boolean) : [],
                imgUrl: backendToy.imageUrl || `https://robohash.org/${backendToy.name}?set=set4`,
                createdAt: new Date(backendToy.createdAt).getTime(),
                inStock: backendToy.inStock,
                description: backendToy.description,
                ageRange: backendToy.ageRange
            }
        })
        .catch(err => {
            console.error('Error updating toy:', err)
            throw err
        })
    } else {
        // Add new toy
        return axios.post(BASE_URL, {
            name: toy.name,
            category: toy.labels?.join(', ') || '',
            price: toy.price,
            description: toy.description || '',
            ageRange: toy.ageRange || '',
            imageUrl: toy.imgUrl || '',
            inStock: toy.inStock
        })
        .then(res => {
            const backendToy = res.data
            return {
                _id: backendToy._id,
                name: backendToy.name,
                price: backendToy.price,
                labels: backendToy.category ? backendToy.category.split(', ').filter(Boolean) : [],
                imgUrl: backendToy.imageUrl || `https://robohash.org/${backendToy.name}?set=set4`,
                createdAt: new Date(backendToy.createdAt).getTime(),
                inStock: backendToy.inStock,
                description: backendToy.description,
                ageRange: backendToy.ageRange
            }
        })
        .catch(err => {
            console.error('Error adding toy:', err)
            throw err
        })
    }
}

function getDefaultFilter() {
    return {
        txt: '',
        inStock: '',
        labels: [],
        pageIdx: 0,
    }
}

function getDefaultSort() {
    return { type: '', desc: 1 }
}

function getToyLabels() {
    return Promise.resolve(labels)
}

function getEmptyToy() {
    return {
        name: '',
        price: 0,
        labels: [],
        createdAt: Date.now(),
        inStock: true,
        imgUrl: 'https://robohash.org/New Toy?set=set4'
    }
}

function getToyLabelCounts() {
    return query().then(toys => {
        const labelCounts = {}
        labels.forEach(label => {
            labelCounts[label] = toys.filter(toy => toy.labels?.includes(label)).length
        })
        return labelCounts
    })
}

function getInStockValue() {
    return query().then(toys => {
        const inStockCount = toys.filter(toy => toy.inStock).length
        const totalCount = toys.length
        return { inStockCount, totalCount }
    })
}
