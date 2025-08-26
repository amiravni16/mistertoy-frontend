import { useState, useRef } from 'react'
import './Accordion.css'

export function Accordion({ items = [] }) {
    const [openIndex, setOpenIndex] = useState(null)
    const contentRefs = useRef({})

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <div className="accordion-container">
            {items.map((item, index) => {
                const isOpen = openIndex === index
                const contentHeight = contentRefs.current[index]?.scrollHeight || 0

                return (
                    <div key={index} className="accordion-item">
                        <button
                            className={`accordion-header ${isOpen ? 'open' : ''}`}
                            onClick={() => toggleAccordion(index)}
                        >
                            <span className="accordion-title">{item.title}</span>
                            <span className="accordion-icon">
                                {isOpen ? '−' : '+'}
                            </span>
                        </button>
                        
                        <div 
                            className="accordion-content-wrapper"
                            style={{
                                height: isOpen ? `${contentHeight}px` : '0px',
                                overflow: 'hidden',
                                transition: 'height 0.3s ease-in-out'
                            }}
                        >
                            <div 
                                ref={el => contentRefs.current[index] = el}
                                className="accordion-content"
                            >
                                {item.content}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

// Example usage with sample data
export function SampleAccordion() {
    const sampleItems = [
        {
            title: "What is MisterToy?",
            content: "MisterToy is a comprehensive toy management application that helps you organize, track, and manage your toy inventory with features like filtering, sorting, and real-time updates."
        },
        {
            title: "How do I add a new toy?",
            content: "Click the 'Add Toy' button in the main interface, fill out the toy details including name, price, labels, and stock status, then click save to add it to your collection."
        },
        {
            title: "Can I filter toys by labels?",
            content: "Yes! Use the filter section to search by toy name, filter by stock status, and select multiple labels to find exactly the toys you're looking for."
        },
        {
            title: "Is my data saved locally?",
            content: "Currently, MisterToy uses localStorage to save your toy data in the browser. This means your data persists between sessions but is stored locally on your device."
        }
    ]

    return <Accordion items={sampleItems} />
}
