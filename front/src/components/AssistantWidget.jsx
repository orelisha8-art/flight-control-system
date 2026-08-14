import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFlights } from '@/context/FlightsContext'
import { validateNewFlight } from '@/lib/validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const WELCOME_MESSAGE = {
  role: 'assistant',
  content:
    'בּוּ! 👻 אני פנטום, עוזר הבקרה שלך. אפשר לבקש ממני להוסיף טיסה, לשחרר טיסה, לעבור בין המסכים, או סתם לשאול אותי מה קורה באוויר. כל פעולה שמשנה נתונים אני אציג לך לאישור לפני שהיא מתבצעת.',
}

function describeAction(action) {
  if (action.type === 'add_flight') {
    return `להוסיף טיסה מספר ${action.id}, חברת ${action.airline}, ${action.passengers} נוסעים?`
  }
  if (action.type === 'delete_flight') {
    return `לשחרר (למחוק) את הטיסה מספר ${action.id}?`
  }
  return null
}

export default function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef(null)

  const { flights, flightExists, addFlight, deleteFlight } = useFlights()
  const navigate = useNavigate()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen])

  function runAction(action) {
    if (action.type === 'add_flight') {
      const error = validateNewFlight(
        { id: action.id, airline: action.airline, passengers: action.passengers },
        flightExists
      )
      if (error) return `⚠️ ${error}`
      addFlight({
        id: String(action.id).trim(),
        airline: String(action.airline).trim(),
        passengers: Number(action.passengers),
      })
      navigate('/controlpanel')
      return `✅ טיסה ${action.id} נוספה בהצלחה.`
    }

    if (action.type === 'delete_flight') {
      const { removed, remainingFlights, remainingPassengers } = deleteFlight(String(action.id).trim())
      if (!removed) return `⚠️ לא קיימת טיסה עם מספר ${action.id}.`
      return `💀 הטיסה ${removed.id} (${removed.airline}) שוחררה. כרגע באוויר: ${remainingFlights} טיסות, ${remainingPassengers} נוסעים.`
    }

    return null
  }

  function resolvePending(index, confirmed) {
    setMessages((prev) =>
      prev.map((m, i) => {
        if (i !== index || !m.pendingAction) return m
        return { ...m, pendingAction: { ...m.pendingAction, resolved: true } }
      })
    )

    if (!confirmed) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'בסדר, ביטלתי. 👻' }])
      return
    }

    const target = messages[index]
    const note = runAction(target.pendingAction)
    setMessages((prev) => [...prev, { role: 'assistant', content: note ?? 'בוצע.' }])
  }

  async function handleSend(e) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMessage = { role: 'user', content: trimmed }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          flights,
          history: nextMessages.slice(-8).map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!response.ok) throw new Error('assistant_failed')

      const data = await response.json()
      const action = data.action

      if (action?.type === 'navigate') {
        navigate(action.to)
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
      } else if (action?.type === 'add_flight' || action?.type === 'delete_flight') {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply, pendingAction: { ...action, resolved: false } },
        ])
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '👻 אופס, איבדתי קשר לרגע עם המגדל. נסה שוב.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-3">
      {isOpen && (
        <div className="assistant-panel flex h-[28rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border-2 border-ink bg-card shadow-[6px_6px_0_0_var(--ink)]">
          <div className="flex items-center justify-between gap-2 border-b-2 border-ink bg-primary/15 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👻</span>
              <div>
                <p className="font-heading text-lg leading-none text-primary">פנטום</p>
                <p className="text-xs text-muted-foreground">עוזר בקרת הטיסות שלך</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
              aria-label="סגור צ'אט"
            >
              ✕
            </Button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={
                    m.role === 'user'
                      ? 'max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground'
                      : 'max-w-[85%] rounded-2xl rounded-bl-sm border border-border bg-secondary px-3 py-2 text-sm text-secondary-foreground'
                  }
                >
                  <p>{m.content}</p>
                  {m.pendingAction && !m.pendingAction.resolved && (
                    <div className="mt-2 flex flex-col gap-2 rounded-xl border-2 border-ink bg-card p-2">
                      <p className="text-xs font-bold text-card-foreground">{describeAction(m.pendingAction)}</p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          className="flex-1"
                          onClick={() => resolvePending(i, true)}
                        >
                          אשר ✅
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => resolvePending(i, false)}
                        >
                          בטל ❌
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-border bg-secondary px-3 py-2 text-sm text-muted-foreground">
                  פנטום חושב... 🕯️
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="flex gap-2 border-t-2 border-ink p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="לדוגמה: תוסיף טיסה 55555 של וויז אייר עם 120 נוסעים"
              disabled={isLoading}
              autoFocus
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              שלח
            </Button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="assistant-fab flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-card text-3xl shadow-[3px_3px_0_0_var(--ink)] transition-transform hover:scale-110 hover:shadow-[5px_5px_0_0_var(--ink)]"
        aria-label="פתח את פנטום, עוזר הבקרה"
      >
        👻
      </button>
    </div>
  )
}
