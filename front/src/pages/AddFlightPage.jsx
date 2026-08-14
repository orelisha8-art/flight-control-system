import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFlights } from '@/context/FlightsContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const HAS_LETTER_REGEX = /\p{L}/u

export default function AddFlightPage() {
  const { flightExists, addFlight } = useFlights()
  const navigate = useNavigate()

  const [flightId, setFlightId] = useState('')
  const [airline, setAirline] = useState('')
  const [passengers, setPassengers] = useState('')

  function validate() {
    if (!/^\d{1,5}$/.test(flightId.trim())) {
      return 'מספר טיסה חייב להיות ערך מספרי עד 5 ספרות.'
    }
    if (flightExists(flightId.trim())) {
      return 'כבר קיימת טיסה עם מספר זהה.'
    }
    if (!HAS_LETTER_REGEX.test(airline.trim())) {
      return 'שם חברת התעופה חייב להכיל לפחות אות אחת.'
    }
    const passengersNum = Number(passengers)
    if (!Number.isInteger(passengersNum) || passengersNum < 1 || passengersNum > 450) {
      return 'מספר הנוסעים חייב להיות בין 1 ל-450.'
    }
    return null
  }

  function handleSubmit(e) {
    e.preventDefault()
    const error = validate()
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
      <h1 className="mb-4 text-2xl font-bold">הוסף טיסה</h1>
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

        <Button type="submit">צור</Button>
      </form>
    </div>
  )
}
