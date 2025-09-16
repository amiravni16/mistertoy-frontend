import { httpService } from './http.service.js'

const BASE_URL = '/api/review'

export const reviewService = {
    query,
    getById,
    remove,
    add,
    update,
    getReviewsByToyId,
    getReviewStats
}

function query() {
    return httpService.get(BASE_URL)
        .then(reviews => reviews)
        .catch(err => {
            console.error('Error fetching reviews:', err)
            throw err
        })
}

function getById(reviewId) {
    return httpService.get(`${BASE_URL}/${reviewId}`)
        .then(review => review)
        .catch(err => {
            console.error('Error fetching review:', err)
            throw err
        })
}

function remove(reviewId) {
    return httpService.delete(`${BASE_URL}/${reviewId}`)
        .then(() => reviewId)
        .catch(err => {
            console.error('Error removing review:', err)
            throw err
        })
}

function add(review) {
    return httpService.post(BASE_URL, review)
        .then(savedReview => savedReview)
        .catch(err => {
            console.error('Error adding review:', err)
            throw err
        })
}

function update(review) {
    return httpService.put(BASE_URL, review)
        .then(savedReview => savedReview)
        .catch(err => {
            console.error('Error updating review:', err)
            throw err
        })
}

function getReviewsByToyId(toyId) {
    return httpService.get(`${BASE_URL}/toy/${toyId}`)
        .then(reviews => reviews)
        .catch(err => {
            console.error('Error fetching reviews for toy:', err)
            throw err
        })
}

function getReviewStats(toyId) {
    return httpService.get(`${BASE_URL}/toy/${toyId}/stats`)
        .then(stats => stats)
        .catch(err => {
            console.error('Error fetching review stats:', err)
            throw err
        })
}
