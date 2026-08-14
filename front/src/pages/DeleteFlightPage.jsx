import { useState } from 'react'
import { useFlights } from '@/context/FlightsContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function DeleteFlightPage() {
  const { deleteFlight } = useFlights()
  const [flightId, setFlightId] = useState('')

  function handleDelete() {
    const trimmed = flightId.trim()
    if (!/^\d{1,5}$/.test(trimmed)) {
      alert('יש להזין מספר טיסה תקין (עד 5 ספרות).')
      return
    }

    const { removed, remainingFlights, remainingPassengers } = deleteFlight(trimmed)

    if (!removed) {
      alert(`לא קיימת טיסה עם מספר ${trimmed}.`)
      return
    }

    alert(
      `הטיסה ${removed.id} (${removed.airline}) נמחקה בהצלחה.\n` +
        `כרגע באוויר: ${remainingFlights} טיסות, ${remainingPassengers} נוסעים.`
    )
    setFlightId('')
  }

  return (
    <div>
      <h1 className="mb-4 font-heading text-3xl text-primary">💀 מחק טיסה</h1>
      <div className="flex max-w-sm flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="delete-flight-id">מספר טיסה</Label>
          <Input
            id="delete-flight-id"
            dir="ltr"
            inputMode="numeric"
            maxLength={5}
            value={flightId}
            onChange={(e) => setFlightId(e.target.value.replace(/\D/g, '').slice(0, 5))}
            placeholder="לדוגמה: 12345"
          />
        </div>
        <Button variant="destructive" onClick={handleDelete}>
          מחק 💀
        </Button>
      </div>
    </div>
  )
}
