import { getFlightsCollection } from '../lib/mongodb.js'

const HAS_LETTER_REGEX = /\p{L}/u

export default async function handler(req, res) {
  try {
    const flights = await getFlightsCollection()

    if (req.method === 'GET') {
      const all = await flights.find({}, { projection: { _id: 0 } }).sort({ _id: 1 }).toArray()
      res.status(200).json(all)
      return
    }

    if (req.method === 'POST') {
      const body = req.body ?? {}
      const id = String(body.id ?? '').trim()
      const airline = String(body.airline ?? '').trim()
      const passengers = Number(body.passengers)

      if (!/^\d{1,5}$/.test(id)) {
        res.status(400).json({ error: 'invalid_id' })
        return
      }
      if (!HAS_LETTER_REGEX.test(airline)) {
        res.status(400).json({ error: 'invalid_airline' })
        return
      }
      if (!Number.isInteger(passengers) || passengers < 1 || passengers > 450) {
        res.status(400).json({ error: 'invalid_passengers' })
        return
      }

      try {
        await flights.insertOne({ id, airline, passengers })
      } catch (err) {
        if (err?.code === 11000) {
          res.status(409).json({ error: 'duplicate_id' })
          return
        }
        throw err
      }

      res.status(201).json({ id, airline, passengers })
      return
    }

    res.setHeader('Allow', 'GET, POST')
    res.status(405).json({ error: 'method_not_allowed' })
  } catch (err) {
    console.error('flights api error', err)
    res.status(500).json({ error: 'server_error' })
  }
}
