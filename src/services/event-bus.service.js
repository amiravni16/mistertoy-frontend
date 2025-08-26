export const eventBus = {
    on(event, cb) {
        document.addEventListener(event, cb)
    },
    emit(event, data) {
        document.dispatchEvent(new CustomEvent(event, data))
    },
    off(event, cb) {
        document.removeEventListener(event, cb)
    }
}

export function showErrorMsg(txt) {
    eventBus.emit('show-msg', { txt, type: 'error' })
}

export function showSuccessMsg(txt) {
    eventBus.emit('show-msg', { txt, type: 'success' })
}
