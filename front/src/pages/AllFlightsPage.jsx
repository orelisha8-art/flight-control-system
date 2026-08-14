import { useFlights } from '@/context/FlightsContext'
import FlightCard from '@/components/FlightCard'

export default function AllFlightsPage() {
  const { flights, isLoading, loadError } = useFlights()

  return (
    <div>
      <h1 className="mb-4 font-heading text-3xl text-primary">🛫 כל הטיסות</h1>
      {isLoading ? (
        <p className="text-muted-foreground">טוען טיסות... 👻</p>
      ) : loadError ? (
        <p className="text-destructive">שגיאה בטעינת הטיסות. נסה לרענן את העמוד.</p>
      ) : flights.length === 0 ? (
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
