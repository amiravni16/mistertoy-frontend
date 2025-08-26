import { useEffect } from 'react'

export function NicePopup({ header, footer, children, isOpen = false, onClose = () => {} }) {

    useEffect(() => {
        if (!isOpen) return

        function handleEscKey(event) {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        // Add event listener to body for ESC key
        document.body.addEventListener('keydown', handleEscKey)

        // Cleanup function
        return () => {
            document.body.removeEventListener('keydown', handleEscKey)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="nice-popup-backdrop" onClick={onClose}>
            <div className="nice-popup-container" onClick={ev => ev.stopPropagation()}>
                {header && (
                    <header className="nice-popup-header">
                        {header}
                    </header>
                )}
                <main className="nice-popup-main">
                    {children}
                </main>
                {footer && (
                    <footer className="nice-popup-footer">
                        {footer}
                    </footer>
                )}
            </div>
        </div>
    )
}
