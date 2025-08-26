import { useEffect, useRef, useState } from 'react'
import { eventBus } from '../services/event-bus.service'

export function UserMsg() {
  const [msg, setMsg] = useState(null)
  const timeoutIdRef = useRef()

  useEffect(() => {
    const unsubscribe = eventBus.on('show-user-msg', msg => {
      setMsg(msg)
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current)
      }
      timeoutIdRef.current = setTimeout(closeMsg, 3000)
    })
    return unsubscribe
  }, [])

  function closeMsg() {
    setMsg(null)
  }

  if (!msg) return null
  return (
    <section className={`user-msg ${msg.type}`}>
      {msg.txt}
      <button onClick={closeMsg}>x</button>
    </section>
  )
}
