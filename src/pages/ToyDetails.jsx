import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Loader } from '../cmps/Loader'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { toyService } from '../services/toy.service'
import { authService } from '../services/auth.service'

export function ToyDetails() {
    const user = authService.getLoggedinUser()
    const [toy, setToy] = useState(null)
    const [msg, setMsg] = useState({ txt: '' })
    const { toyId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadToy()
    }, [toyId])

    function handleMsgChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setMsg(msg => ({ ...msg, [field]: value }))
    }

    async function loadToy() {
        try {
            const toy = await toyService.getById(toyId)
            setToy(toy)
        } catch (error) {
            showErrorMsg('Cannot load toy')
            navigate('/toy')
        }
    }

    async function onSaveMsg(ev) {
        ev.preventDefault()
        
        // Check if user is logged in
        if (!user) {
            showErrorMsg('Please log in to send messages')
            return
        }
        
        try {
            const newMsg = {
                txt: msg.txt,
                by: {
                    _id: user._id,
                    fullname: user.fullname || user.username
                }
            }
            
            await toyService.addMsg(toyId, newMsg)
            setMsg({ txt: '' })
            loadToy() // Reload toy to get updated messages from backend
            showSuccessMsg('Message saved!')
        } catch (error) {
            showErrorMsg('Cannot save message')
        }
    }

    async function onRemoveMsg(msgId) {
        try {
            await toyService.removeMsg(toy._id, msgId)
            loadToy() // Reload toy to get updated messages from backend
            showSuccessMsg('Message removed!')
        } catch (error) {
            showErrorMsg('Cannot remove message')
        }
    }

    const { txt } = msg

    if (!toy) return <Loader />

    return (
        <section className="toy-details" style={{ textAlign: 'center' }}>
            <div className="upper-section flex flex-column align-center">
                <h1>
                    Toy name: <span>{toy.name}</span>
                </h1>
                <h1>
                    Toy price: <span>${toy.price}</span>
                </h1>
                <h1>
                    Labels: <span>{toy.labels.join(' ,')}</span>
                </h1>
                <h1 className={toy.inStock ? 'green' : 'red'}>
                    {toy.inStock ? 'In stock' : 'Not in stock'}
                </h1>
                <button>
                    <Link to="/toy">Back</Link>
                </button>
            </div>
            <div className="msg-container">
                <h1>Chat</h1>
                {user ? (
                    <>
                        <form className="login-form" onSubmit={onSaveMsg}>
                            <input
                                type="text"
                                name="txt"
                                value={txt}
                                placeholder="Enter Your Message"
                                onChange={handleMsgChange}
                                required
                                autoFocus
                            />
                            <button>Send</button>
                        </form>
                        <div>
                            <ul className="clean-list">
                                {toy.msgs &&
                                    toy.msgs.map(msg => (
                                        <li key={msg.id}>
                                            By: {msg.by ? msg.by.fullname : 'Unknown User'} - {msg.txt}
                                            <button type="button" onClick={() => onRemoveMsg(msg.id)}>
                                                ✖️
                                            </button>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="login-prompt">
                        <p>Please <Link to="/login" className="login-link">login</Link> to add messages about this toy.</p>
                        <p className="no-messages">No messages yet. Be the first to comment!</p>
                    </div>
                )}
            </div>
        </section>
    )
}
