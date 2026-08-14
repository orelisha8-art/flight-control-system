import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFlights } from '@/context/FlightsContext'
import { validateNewFlight } from '@/lib/validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AddFlightPage() {
  const { flightExists, addFlight } = useFlights()
  const navigate = useNavigate()

  const [flightId, setFlightId] = useState('')
  const [airline, setAirline] = useState('')
  const [passengers, setPassengers] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const error = validateNewFlight({ id: flightId, airline, passengers }, flightExists)
    if (error) {
      alert(error)
      return
    }
    addFlight({
      id: flightId.trim(),
      airline: airline.trim(),
      passengers: Number(passengers),
    })
    navigate('/controlpanel')
  }

  return (
    <div>
      <h1 className="mb-4 font-heading text-3xl text-primary">➕ הוסף טיסה</h1>
      <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="flight-id">מספר טיסה</Label>
          <Input
            id="flight-id"
            dir="ltr"
            inputMode="numeric"
            maxLength={5}
            value={flightId}
            onChange={(e) => setFlightId(e.target.value.replace(/\D/g, '').slice(0, 5))}
            placeholder="לדוגמה: 12345"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="airline">חברת תעופה</Label>
          <Input
            id="airline"
            value={airline}
            onChange={(e) => setAirline(e.target.value)}
            placeholder="לדוגמה: אל על"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="passengers">מספר נוסעים (1-450)</Label>
          <Input
            id="passengers"
            dir="ltr"
            type="number"
            min={1}
            max={450}
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
            placeholder="לדוגמה: 180"
          />
        </div>

        <Button type="submit">צור טיסה 🪄</Button>
      </form>
    </div>
  )
}
