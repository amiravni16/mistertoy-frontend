import { toyService } from '../../services/toy.service'

export const SET_TOYS = 'SET_TOYS'
export const REMOVE_TOY = 'REMOVE_TOY'
export const ADD_TOY = 'ADD_TOY'
export const SET_TOY_LABELS = 'SET_TOY_LABELS'
export const UPDATE_TOY = 'UPDATE_TOY'

export const SET_FILTER_BY = 'SET_FILTER_BY'
export const SET_SORT_BY = 'SET_SORT_BY'
export const SET_IS_LOADING = 'SET_IS_LOADING'
export const SET_ERROR = 'SET_ERROR'

export const TOY_UNDO = 'TOY_UNDO'

const initialState = {
    toys: [],
    filterBy: toyService.getDefaultFilter(),
    sortBy: toyService.getDefaultSort(),
    toyLabels: [],
    lastToys: [],
    flag: {
        isLoading: false,
        error: null,
    },
}

export function toyReducer(state = initialState, action = {}) {
    let toys
    switch (action.type) {
        // Toys
        case SET_TOYS:
            return { ...state, toys: action.toys, lastToys: state.toys }

        case REMOVE_TOY:
            toys = state.toys.filter(toy => toy._id !== action.toyId)
            return { ...state, toys, lastToys: state.toys }

        case ADD_TOY:
            toys = [action.toy, ...state.toys]
            return { ...state, toys, lastToys: state.toys }

        case UPDATE_TOY:
            toys = state.toys.map(toy =>
                toy._id === action.toy._id ? action.toy : toy
            )
            return { ...state, toys, lastToys: state.toys }
        case SET_TOY_LABELS:
            return { ...state, toyLabels: action.labels }

        case TOY_UNDO:
            return { ...state, toys: [...state.lastToys] }

        case SET_FILTER_BY:
            return { ...state, filterBy: { ...state.filterBy, ...action.filterBy } }

        case SET_SORT_BY:
            return { ...state, sortBy: { ...action.sortBy } }

        case SET_IS_LOADING:
            return { ...state, flag: { ...state.flag, isLoading: action.isLoading } }

        case SET_ERROR:
            return { ...state, flag: { ...state.flag, error: action.error } }

        default:
            return state
    }
}
