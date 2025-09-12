import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Loader } from '../cmps/Loader'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { toyService } from '../services/toy.service'

export function ToyDetails() {
    const user = useSelector(storeState => storeState.userModule.loggedInUser)
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
            console.log('Had issues in toy details', error)
            showErrorMsg('Cannot load toy')
            navigate('/toy')
        }
    }

    async function onSaveMsg(ev) {
        ev.preventDefault()
        try {
            const savedMsg = await toyService.addToyMsg(toy._id, msg)
            setToy(prevToy => ({
                ...prevToy,
                msgs: [...(prevToy.msgs || []), savedMsg],
            }))
            setMsg({ txt: '' })
            showSuccessMsg('Message saved!')
        } catch (error) {
            showErrorMsg('Cannot save message')
        }
    }

    async function onRemoveMsg(msgId) {
        try {
            await toyService.removeToyMsg(toy._id, msgId)
            setToy(prevToy => ({
                ...prevToy,
                msgs: prevToy.msgs.filter(msg => msg.id !== msgId),
            }))
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
            {user && (
                <div className="msg-container">
                    <h1>Chat</h1>
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
                </div>
            )}
        </section>
    )
}
