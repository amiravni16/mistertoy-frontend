import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import '../assets/style/cmps/ModernMultiSelect.css'

export function ModernMultiSelect({ 
    options = [], 
    value = [], 
    onChange, 
    placeholder = "Select options...",
    className = "",
    disabled = false 
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
    const dropdownRef = useRef(null)
    const inputRef = useRef(null)
    const containerRef = useRef(null)

    // Calculate dropdown position
    const calculateDropdownPosition = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
                width: rect.width
            })
        }
    }

    // Close dropdown when clicking outside and handle window resize
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
                setSearchTerm('')
            }
        }

        function handleResize() {
            if (isOpen) {
                calculateDropdownPosition()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        window.addEventListener('resize', handleResize)
        window.addEventListener('scroll', handleResize)
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('scroll', handleResize)
        }
    }, [isOpen])

    // Filter options based on search term
    const filteredOptions = (options || []).filter(option =>
        option && option.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Handle option selection/deselection
    const handleOptionClick = (option) => {
        const newValue = value.includes(option)
            ? value.filter(item => item !== option)
            : [...value, option]
        
        onChange(newValue)
    }

    // Handle removing a chip
    const handleRemoveChip = (optionToRemove) => {
        const newValue = value.filter(item => item !== optionToRemove)
        onChange(newValue)
    }

    // Handle input focus
    const handleInputFocus = () => {
        if (!disabled) {
            calculateDropdownPosition()
            setIsOpen(true)
            inputRef.current?.focus()
        }
    }

    // Handle key events
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsOpen(false)
            setSearchTerm('')
        } else if (e.key === 'Backspace' && searchTerm === '' && value.length > 0) {
            // Remove last chip when backspace is pressed on empty input
            const newValue = value.slice(0, -1)
            onChange(newValue)
        }
    }

    return (
        <div className={`modern-multi-select ${className} ${disabled ? 'disabled' : ''}`} ref={containerRef}>
            <div 
                className={`select-input ${isOpen ? 'open' : ''}`}
                onClick={handleInputFocus}
            >
                <div className="chips-container">
                    {value.map((option) => (
                        <div key={option} className="chip">
                            <span className="chip-text">{option}</span>
                            <button
                                type="button"
                                className="chip-remove"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveChip(option)
                                }}
                                disabled={disabled}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <input
                        ref={inputRef}
                        type="text"
                        className="select-input-field"
                        placeholder={value.length === 0 ? placeholder : ''}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={disabled}
                    />
                </div>
                <div className="select-arrow">
                    {isOpen ? '▲' : '▼'}
                </div>
            </div>

            {isOpen && createPortal(
                <div 
                    className="select-dropdown"
                    ref={dropdownRef}
                    style={{
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                        width: `${dropdownPosition.width}px`
                    }}
                >
                    <div className="dropdown-content">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => {
                                const isSelected = value.includes(option)
                                return (
                                    <div
                                        key={option}
                                        className={`dropdown-option ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleOptionClick(option)}
                                    >
                                        <span className="option-text">{option}</span>
                                        {isSelected && (
                                            <span className="option-checkmark">✓</span>
                                        )}
                                    </div>
                                )
                            })
                        ) : (
                            <div className="no-options">
                                No options found
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
