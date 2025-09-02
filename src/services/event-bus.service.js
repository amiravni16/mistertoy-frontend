export const eventBus = {
    on(event, cb) {
        document.addEventListener(event, cb)
    },
    emit(event, data) {
        document.dispatchEvent(new CustomEvent(event, { detail: data }))
    },
    off(event, cb) {
        document.removeEventListener(event, cb)
    }
}

export function showErrorMsg(txt) {
    eventBus.emit('show-user-msg', { txt, type: 'error' })
}

export function showSuccessMsg(txt) {
    eventBus.emit('show-user-msg', { txt, type: 'success' })
}
