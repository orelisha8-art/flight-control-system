import { getFlightsCollection } from '../../lib/mongodb.js'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', 'DELETE')
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }

  const id = String(req.query.id ?? '').trim()

  try {
    const flights = await getFlightsCollection()

    const result = await flights.findOneAndDelete({ id })
    const removedDoc = result && 'value' in result ? result.value : result

    if (!removedDoc) {
      res.status(404).json({ error: 'not_found' })
      return
    }

    const remaining = await flights.find({}, { projection: { _id: 0 } }).toArray()
    const remainingPassengers = remaining.reduce((sum, f) => sum + f.passengers, 0)

    res.status(200).json({
      removed: { id: removedDoc.id, airline: removedDoc.airline, passengers: removedDoc.passengers },
      remainingFlights: remaining.length,
      remainingPassengers,
    })
  } catch (err) {
    console.error('delete flight error', err)
    res.status(500).json({ error: 'server_error' })
  }
}
