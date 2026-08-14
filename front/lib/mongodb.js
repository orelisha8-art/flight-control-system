import { MongoClient } from 'mongodb'

let cachedClientPromise = null

function getClientPromise() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable')
  }
  if (!cachedClientPromise) {
    const client = new MongoClient(uri)
    cachedClientPromise = client.connect()
  }
  return cachedClientPromise
}

export async function getFlightsCollection() {
  const client = await getClientPromise()
  const db = client.db('flight_control')
  const collection = db.collection('flights')
  await collection.createIndex({ id: 1 }, { unique: true })
  return collection
}
