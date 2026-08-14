import { generateText, tool } from 'ai'
import { z } from 'zod'

const NAV_TARGETS = ['/controlpanel', '/controlpanel/sort', '/controlpanel/add', '/controlpanel/delete']

const tools = {
  add_flight: tool({
    description:
      'Propose adding a new flight to the airspace. Only call this once you have a flight number, an airline name, and a passenger count. Extract every field verbatim from what the user actually wrote — never invent or substitute a more familiar airline name.',
    inputSchema: z.object({
      flightId: z.string().describe('Digits only, up to 5 characters'),
      airline: z.string().describe('Airline name, copied exactly as the user wrote it'),
      passengers: z.number().int().describe('Passenger count as stated by the user'),
    }),
  }),
  delete_flight: tool({
    description: 'Propose deleting (releasing) an existing flight by its flight number.',
    inputSchema: z.object({
      flightId: z.string().describe('Digits only, up to 5 characters'),
    }),
  }),
  navigate: tool({
    description: 'Navigate the controller to a different screen in the app.',
    inputSchema: z.object({
      to: z.enum(NAV_TARGETS),
    }),
  }),
}

const SYSTEM_PROMPT = `אתה "פנטום" — עוזר בקרת טיסות ידידותי בסגנון רוח-רפאים חמודה-מפחידה (Halloween קליל), בתוך אפליקציית בקרת טיסות אמיתית.

חוקים:
- כשעונים על שאלה לגבי הטיסות הנוכחיות, השתמש אך ורק במידע שמופיע ב"מצב נוכחי" למטה. אל תמציא טיסות, חברות או מספרים.
- כדי להוסיף טיסה, לשחרר טיסה, או לעבור עמוד — קרא לכלי (tool) המתאים עם הפרמטרים הנכונים. אל תתאר את הפעולה במילים בלבד; תמיד השתמש בכלי בפועל.
- לפני קריאה לכלי add_flight, ודא שיש לך מספר טיסה, שם חברה ומספר נוסעים. אם חסר פרט — אל תקרא לכלי, פשוט שאל שאלה קצרה.
- לפני קריאה לכלי delete_flight, ודא שיש לך מספר טיסה. אם הוא לא צוין — אל תקרא לכלי, שאל אותו.
- כשקוראים לכלי, ענה גם במשפט קצר בעברית שמתאר את מה שאתה עומד להציע (לא מבצע בפועל — רק מציע, הבקר יאשר).
- בקשה שלא קשורה לניהול טיסות בכלל: סרב בנימוס, בלי לקרוא לשום כלי.
- טון: עברית, קצר וברור קודם כל, עם קורטוב הומור רוח-רפאים עדין — אבל לעולם לא על חשבון הדיוק.`

function extractAction(result) {
  const call = result.toolCalls?.[0]
  if (!call) return { type: 'none' }

  if (call.toolName === 'add_flight') {
    return { type: 'add_flight', id: call.input.flightId, airline: call.input.airline, passengers: call.input.passengers }
  }
  if (call.toolName === 'delete_flight') {
    return { type: 'delete_flight', id: call.input.flightId }
  }
  if (call.toolName === 'navigate') {
    return { type: 'navigate', to: call.input.to }
  }
  return { type: 'none' }
}

function fallbackReply(action) {
  if (action.type === 'add_flight') return `הבנתי — בקשה להוסיף טיסה ${action.id}.`
  if (action.type === 'delete_flight') return `הבנתי — בקשה לשחרר טיסה ${action.id}.`
  if (action.type === 'navigate') return 'מעביר אותך לשם.'
  return '👻'
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const body = req.body ?? {}
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  const flights = Array.isArray(body.flights) ? body.flights : []
  const history = Array.isArray(body.history) ? body.history : []

  if (!message) {
    res.status(400).json({ error: 'Missing message' })
    return
  }
  if (message.length > 500) {
    res.status(400).json({ error: 'Message too long' })
    return
  }

  const flightsSummary =
    flights
      .slice(0, 100)
      .map((f) => `#${f.id} | ${f.airline} | ${f.passengers} נוסעים`)
      .join('\n') || '(אין טיסות באוויר כרגע)'

  const totalPassengers = flights.reduce((sum, f) => sum + (Number(f.passengers) || 0), 0)

  const trimmedHistory = history
    .filter((h) => h && (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string')
    .slice(-6)
    .map((h) => ({ role: h.role, content: h.content.slice(0, 500) }))

  try {
    const result = await generateText({
      model: 'google/gemini-2.5-flash',
      system: `${SYSTEM_PROMPT}\n\nמצב נוכחי בשמי המדינה:\n${flightsSummary}\n\nסה"כ ${flights.length} טיסות באוויר, ${totalPassengers} נוסעים.`,
      messages: [...trimmedHistory, { role: 'user', content: message }],
      tools,
      temperature: 0,
    })

    const action = extractAction(result)
    const reply = result.text?.trim() || fallbackReply(action)

    res.status(200).json({ reply, action })
  } catch (err) {
    console.error('assistant error', err)
    res.status(500).json({ error: 'assistant_failed' })
  }
}
