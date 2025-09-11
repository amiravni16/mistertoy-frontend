import { useState, useEffect, useRef } from 'react'
import '../assets/style/cmps/Chat.css'

export function Chat() {
    const [messages, setMessages] = useState([])
    const [inputText, setInputText] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    function handleSubmit(ev) {
        ev.preventDefault()
        if (!inputText.trim() || isLoading) return

        const messageText = inputText.trim()
        
        // Add user message
        const userMessage = {
            id: Date.now(),
            text: messageText,
            sender: 'user',
            timestamp: new Date()
        }
        
        setMessages(prev => [...prev, userMessage])
        setInputText('')
        setIsLoading(true)

        // Auto-response after delay
        setTimeout(() => {
            const autoResponse = {
                id: Date.now() + 1,
                text: `Thanks for your message: "${messageText}"! This is an auto-response.`,
                sender: 'bot',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, autoResponse])
            setIsLoading(false)
        }, 1500)
    }

    function handleKeyPress(ev) {
        if (ev.key === 'Enter' && !ev.shiftKey) {
            ev.preventDefault()
            handleSubmit(ev)
        }
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
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="chat-input"
                    disabled={isLoading}
                />
                <button 
                    type="submit" 
                    className={`chat-send-btn ${isLoading ? 'loading' : ''}`}
                    disabled={!inputText.trim() || isLoading}
                >
                    {isLoading ? 'Sending...' : 'Send'}
                </button>
            </form>
        </div>
    )
}
