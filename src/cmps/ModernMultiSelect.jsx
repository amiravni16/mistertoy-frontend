import { useState, useRef, useEffect } from 'react'
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
    const dropdownRef = useRef(null)
    const inputRef = useRef(null)
    const containerRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
                setSearchTerm('')
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
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

            {isOpen && (
                <div 
                    className="select-dropdown"
                    ref={dropdownRef}
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
                </div>
            )}
        </div>
    )
}
