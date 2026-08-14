import { useMemo, useState } from 'react'
import { useFlights } from '@/context/FlightsContext'
import FlightCard from '@/components/FlightCard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function SortFlightsPage() {
  const { flights } = useFlights()
  const [airlineQuery, setAirlineQuery] = useState('')
  const [order, setOrder] = useState('none')

  const filteredAndSorted = useMemo(() => {
    let result = flights.filter((f) =>
      f.airline.toLowerCase().includes(airlineQuery.trim().toLowerCase())
    )

    if (order === 'asc') {
      result = [...result].sort((a, b) => a.passengers - b.passengers)
    } else if (order === 'desc') {
      result = [...result].sort((a, b) => b.passengers - a.passengers)
    }

    return result
  }, [flights, airlineQuery, order])

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">מיון טיסות</h1>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="airline-filter">חיפוש לפי חברת תעופה</Label>
          <Input
            id="airline-filter"
            value={airlineQuery}
            onChange={(e) => setAirlineQuery(e.target.value)}
            placeholder="לדוגמה: אל על"
          />
        </div>

        <div className="flex flex-col gap-2 sm:w-64">
          <Label htmlFor="order-select">מיון לפי מספר נוסעים</Label>
          <Select value={order} onValueChange={setOrder}>
            <SelectTrigger id="order-select">
              <SelectValue placeholder="ללא מיון" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">ללא מיון</SelectItem>
              <SelectItem value="asc">הכי פחות נוסעים תחילה</SelectItem>
              <SelectItem value="desc">הכי הרבה נוסעים תחילה</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAndSorted.length === 0 ? (
        <p className="text-muted-foreground">לא נמצאו טיסות התואמות את החיפוש.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSorted.map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
        </div>
      )}
    </div>
  )
}
