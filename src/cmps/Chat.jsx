import { useState, useEffect, useRef } from 'react'

export function Chat() {
    const [messages, setMessages] = useState([])
    const [inputText, setInputText] = useState('')
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    function handleSubmit(ev) {
        ev.preventDefault()
        if (!inputText.trim()) return

        // Add user message
        const userMessage = {
            id: Date.now(),
            text: inputText,
            sender: 'user',
            timestamp: new Date()
        }
        
        setMessages(prev => [...prev, userMessage])
        setInputText('')

        // Auto-response after delay
        setTimeout(() => {
            const autoResponse = {
                id: Date.now() + 1,
                text: `Thanks for your message: "${inputText}"! This is an auto-response.`,
                sender: 'bot',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, autoResponse])
        }, 1000)
    }

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map(message => (
                    <div 
                        key={message.id} 
                        className={`chat-message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                    >
                        <div className="message-text">{message.text}</div>
                        <div className="message-time">
                            {message.timestamp.toLocaleTimeString()}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSubmit} className="chat-input-form">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message..."
                    className="chat-input"
                />
                <button type="submit" className="chat-send-btn">
                    Send
                </button>
            </form>
        </div>
    )
}
