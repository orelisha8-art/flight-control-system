import { useFlights } from '@/context/FlightsContext'
import FlightCard from '@/components/FlightCard'

export default function AllFlightsPage() {
  const { flights } = useFlights()

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">כל הטיסות</h1>
      {flights.length === 0 ? (
        <p className="text-muted-foreground">אין טיסות באוויר כרגע.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {flights.map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
        </div>
      )}
    </div>
  )
}
