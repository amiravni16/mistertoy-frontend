import { httpService } from './http.service.js'
import { authService } from './auth.service.js'

const BASE_URL = 'toy'



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
    getInStockValue,
    addMsg,
    removeMsg
}

function query(filterBy = {}, sortBy = {}) {
    // Build query parameters for backend
    const params = {}
    
    if (filterBy.txt) params.txt = filterBy.txt
    if (filterBy.minPrice) params.minPrice = filterBy.minPrice
    if (filterBy.maxPrice) params.maxPrice = filterBy.maxPrice
    if (filterBy.category) params.category = filterBy.category
    if (typeof filterBy.inStock === 'boolean') params.inStock = filterBy.inStock
    if (filterBy.pageIdx !== undefined) params.pageIdx = filterBy.pageIdx
    
    return httpService.get(BASE_URL, params)
        .then(res => {
            // Handle new backend response structure: {toys: [...], totalCount: 3, ...}
            const toys = res.toys || res // Fallback to direct array for backward compatibility
            let toysToShow = toys.map(backendToy => {
                return {
                    _id: backendToy._id,
                    name: backendToy.name,
                    price: backendToy.price,
                    labels: backendToy.labels || [],
                    imgUrl: backendToy.imageUrl || `https://robohash.org/${backendToy.name}?set=set4`,
                    createdAt: backendToy.createdAt,
                    inStock: backendToy.inStock,
                    description: backendToy.description,
                    ageRange: backendToy.ageRange
                }
            })
            
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
    return httpService.get(`${BASE_URL}/${toyId}`)
        .then(backendToy => {
            return {
                _id: backendToy._id,
                name: backendToy.name,
                price: backendToy.price,
                labels: backendToy.labels || [],
                imgUrl: backendToy.imageUrl || `https://robohash.org/${backendToy.name}?set=set4`,
                createdAt: backendToy.createdAt,
                inStock: backendToy.inStock,
                description: backendToy.description,
                ageRange: backendToy.ageRange,
                msgs: backendToy.msgs || []
            }
        })
        .catch(err => {
            console.error('Error fetching toy:', err)
            throw err
        })
}

function remove(toyId) {
    return httpService.delete(`${BASE_URL}/${toyId}`)
        .then(() => toyId)
        .catch(err => {
            console.error('Error removing toy:', err)
            throw err
        })
}

function save(toy) {
    if (toy._id) {
        // Update existing toy
        return httpService.put(`${BASE_URL}/${toy._id}`, {
            name: toy.name,
            labels: toy.labels || [],
            price: toy.price,
            description: toy.description || '',
            ageRange: toy.ageRange || '',
            imageUrl: toy.imgUrl || '',
            inStock: toy.inStock
        })
        .then(backendToy => {
            return {
                _id: backendToy._id,
                name: backendToy.name,
                price: backendToy.price,
                labels: backendToy.labels || [],
                imgUrl: backendToy.imageUrl || `https://robohash.org/${backendToy.name}?set=set4`,
                createdAt: backendToy.createdAt,
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
        return httpService.post(BASE_URL, {
            name: toy.name,
            labels: toy.labels || [],
            price: toy.price,
            description: toy.description || '',
            ageRange: toy.ageRange || '',
            imageUrl: toy.imgUrl || '',
            inStock: toy.inStock
        })
        .then(backendToy => {
            return {
                _id: backendToy._id,
                name: backendToy.name,
                price: backendToy.price,
                labels: backendToy.labels || [],
                imgUrl: backendToy.imageUrl || `https://robohash.org/${backendToy.name}?set=set4`,
                createdAt: backendToy.createdAt,
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
        minPrice: '',
        maxPrice: '',
        inStock: '',
        labels: [],
        pageIdx: 0,
    }
}

function getDefaultSort() {
    return { type: '', desc: 1 }
}

function getToyLabels() {
    // For now, return predefined labels to fix the loading issue
    console.log('Getting toy labels:', labels)
    return Promise.resolve([...labels])
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

function addMsg(toyId, msg) {
    return httpService.post(`${BASE_URL}/${toyId}/msg`, msg)
        .then(savedMsg => savedMsg)
        .catch(err => {
            console.error('Error adding toy message:', err)
            throw err
        })
}

function removeMsg(toyId, msgId) {
    return httpService.delete(`${BASE_URL}/${toyId}/msg/${msgId}`)
        .then(() => msgId)
        .catch(err => {
            console.error('Error removing toy message:', err)
            throw err
        })
}
