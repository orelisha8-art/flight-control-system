import { createContext, useContext, useState } from 'react'

const FlightsContext = createContext(null)

const initialFlights = [
  { id: '10023', airline: 'אל על', passengers: 210 },
  { id: '20456', airline: 'ישראייר', passengers: 156 },
  { id: '30789', airline: 'אריקיה', passengers: 98 },
  { id: '40012', airline: 'Lufthansa', passengers: 320 },
  { id: '50034', airline: 'Turkish Airlines', passengers: 275 },
  { id: '60078', airline: 'Wizz Air', passengers: 180 },
]

export function FlightsProvider({ children }) {
  const [flights, setFlights] = useState(initialFlights)

  function flightExists(id) {
    return flights.some((f) => f.id === id)
  }

  function addFlight({ id, airline, passengers }) {
    setFlights((prev) => [...prev, { id, airline, passengers }])
  }

  function deleteFlight(id) {
    const removed = flights.find((f) => f.id === id) ?? null
    if (!removed) {
      return { removed: null, remainingFlights: flights.length, remainingPassengers: totalPassengers(flights) }
    }
    const remaining = flights.filter((f) => f.id !== id)
    setFlights(remaining)
    return {
      removed,
      remainingFlights: remaining.length,
      remainingPassengers: totalPassengers(remaining),
    }
  }

  function totalPassengers(list) {
    return list.reduce((sum, f) => sum + f.passengers, 0)
  }

  const value = { flights, flightExists, addFlight, deleteFlight }

  return <FlightsContext.Provider value={value}>{children}</FlightsContext.Provider>
}

export function useFlights() {
  const ctx = useContext(FlightsContext)
  if (!ctx) throw new Error('useFlights must be used within FlightsProvider')
  return ctx
}
