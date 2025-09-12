import { useEffect, useRef, useState } from 'react'
import { eventBus } from '../services/event-bus.service'

export function UserMsg() {
  const [msg, setMsg] = useState(null)
  const timeoutIdRef = useRef()

  useEffect(() => {
    const unsubscribe = eventBus.on('show-user-msg', event => {
      setMsg(event.detail)
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current)
      }
      timeoutIdRef.current = setTimeout(closeMsg, 5000)
    })
    return unsubscribe
  }, [])

  function closeMsg() {
    setMsg(null)
  }

  if (!msg) return null
  
  return (
    <section className={`user-msg ${msg.type}`} style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 99999,
      background: msg.type === 'error' ? '#ff4757' : '#2ed573',
      color: 'white',
      padding: '1rem 1.5rem',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      minWidth: '300px',
      fontWeight: 'bold'
    }}>
      {msg.txt}
      <button 
        onClick={closeMsg}
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          color: 'white',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ×
      </button>
    </section>
  )
}
