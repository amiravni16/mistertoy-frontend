import { httpService } from './http.service.js'

const BASE_URL = 'user'

export const userService = {
    query,
    getById,
    remove,
    update,
    add
}

function query() {
    return httpService.get(BASE_URL)
        .then(users => users)
        .catch(err => {
            console.error('Error fetching users:', err)
            throw err
        })
}

function getById(userId) {
    return httpService.get(`${BASE_URL}/${userId}`)
        .then(user => user)
        .catch(err => {
            console.error('Error fetching user:', err)
            throw err
        })
}

function remove(userId) {
    return httpService.delete(`${BASE_URL}/${userId}`)
        .then(() => userId)
        .catch(err => {
            console.error('Error removing user:', err)
            throw err
        })
}

function update(user) {
    return httpService.put(BASE_URL, user)
        .then(savedUser => savedUser)
        .catch(err => {
            console.error('Error updating user:', err)
            throw err
        })
}

function add(user) {
    return httpService.post(BASE_URL, user)
        .then(savedUser => savedUser)
        .catch(err => {
            console.error('Error adding user:', err)
            throw err
        })
}
