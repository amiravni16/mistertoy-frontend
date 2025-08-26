import { storageService } from './async-storage.service'

const TOY_DB = 'toyDB'

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

_createToys()

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
    return storageService.query(TOY_DB).then(toys => {
        let toysToShow = toys

        //* Filter by text
        if (filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i')
            toysToShow = toysToShow.filter(toy => regExp.test(toy.name))
        }

        //* Filter by inStock
        if (typeof filterBy.inStock === 'boolean') {
            toysToShow = toysToShow.filter(toy => toy.inStock === filterBy.inStock)
        }

        //* Filter by labels
        if (filterBy.labels?.length) {
            toysToShow = toysToShow.filter(toy =>
                filterBy.labels.every(label => toy.labels.includes(label))
            )
        }

        //* Sort
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
}

function getById(toyId) {
    return storageService.get(TOY_DB, toyId)
}

function remove(toyId) {
    return storageService.remove(TOY_DB, toyId)
}

function save(toy) {
    if (toy._id) {
        return storageService.put(TOY_DB, toy)
    } else {
        toy.createdAt = Date.now()
        toy.inStock = true
        return storageService.post(TOY_DB, toy)
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
            labelCounts[label] = toys.filter(toy => toy.labels.includes(label)).length
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

function _createToys() {
    let toys = JSON.parse(localStorage.getItem(TOY_DB) || 'null')
    if (!toys || !toys.length) {
        toys = [
            {
                _id: 't101',
                name: 'Talking Doll',
                imgUrl: `https://robohash.org/Talking Doll?set=set4`,
                price: 123,
                labels: ['Doll', 'Battery Powered', 'Baby'],
                createdAt: 1631031801011,
                inStock: true,
            },
            {
                _id: 't102',
                name: 'Remote Control Car',
                imgUrl: `https://robohash.org/Remote Control Car?set=set4`,
                price: 156,
                labels: ['On wheels', 'Battery Powered', 'Outdoor'],
                createdAt: 1631031801012,
                inStock: true,
            },
            {
                _id: 't103',
                name: 'Art & Craft Set',
                imgUrl: `https://robohash.org/Art Craft Set?set=set4`,
                price: 67,
                labels: ['Art', 'Box game'],
                createdAt: 1631031801013,
                inStock: false,
            },
            {
                _id: 't104',
                name: 'Wooden Puzzle',
                imgUrl: `https://robohash.org/Wooden Puzzle?set=set4`,
                price: 45,
                labels: ['Puzzle', 'Box game'],
                createdAt: 1631031801014,
                inStock: true,
            },
            {
                _id: 't105',
                name: 'Building Blocks',
                imgUrl: `https://robohash.org/Building Blocks?set=set4`,
                price: 78,
                labels: ['Box game', 'Art'],
                createdAt: 1631031801015,
                inStock: true,
            },
            {
                _id: 't106',
                name: 'Plush Rabbit',
                imgUrl: `https://robohash.org/Plush Rabbit?set=set4`,
                price: 34,
                labels: ['Baby', 'Doll'],
                createdAt: 1631031801016,
                inStock: false,
            }
        ]
        localStorage.setItem(TOY_DB, JSON.stringify(toys))
    }
}
