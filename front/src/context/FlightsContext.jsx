import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const FlightsContext = createContext(null)

export function FlightsProvider({ children }) {
  const [flights, setFlights] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/flights')
      if (!res.ok) throw new Error('failed to load flights')
      const data = await res.json()
      setFlights(data)
      setLoadError(null)
    } catch (err) {
      setLoadError(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  function flightExists(id) {
    return flights.some((f) => f.id === id)
  }

  async function addFlight({ id, airline, passengers }) {
    const res = await fetch('/api/flights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, airline, passengers }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'add_failed')
    }
    await refresh()
  }

  async function deleteFlight(id) {
    const res = await fetch(`/api/flights/${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (res.status === 404) {
      return {
        removed: null,
        remainingFlights: flights.length,
        remainingPassengers: totalPassengers(flights),
      }
    }
    if (!res.ok) throw new Error('delete_failed')
    const data = await res.json()
    await refresh()
    return data
  }

  function totalPassengers(list) {
    return list.reduce((sum, f) => sum + f.passengers, 0)
  }

  const value = { flights, isLoading, loadError, flightExists, addFlight, deleteFlight, refresh }

  return <FlightsContext.Provider value={value}>{children}</FlightsContext.Provider>
}

export function useFlights() {
  const ctx = useContext(FlightsContext)
  if (!ctx) throw new Error('useFlights must be used within FlightsProvider')
  return ctx
}
